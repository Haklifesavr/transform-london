from rest_framework import serializers

from .models import Dashboard, DataSource, Share, Page
from account.models import User
from .utils import Utils


class DataSourceSerializer(serializers.ModelSerializer):
    file = serializers.FileField(write_only=True)

    class Meta:
        model = DataSource
        fields = (
            "id",
            "source_type",
            "dashboard",
            "source_uri",
            "processed_uri",
            "file",
            "created_at",
            "updated_at",
        )
        extra_kwargs = {
            "id": {"read_only": True},
            "source_uri": {"read_only": True},
            "processed_uri": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }

    def save(self):
        del self.validated_data["file"]
        data_source = DataSource(**self.validated_data)
        data_source.save()
        return data_source


class GoogleSheetSerializer(serializers.ModelSerializer):

    class Meta:
        model = DataSource
        fields = (
            "id",
            "source_type",
            "dashboard",
            "source_uri",
            "processed_uri",
            "created_at",
            "updated_at",
        )
        extra_kwargs = {
            "id": {"read_only": True},
            "processed_uri": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }

    def validate(self, data):
        data = super().validate(data)
        if not data.get("source_uri"):
            raise serializers.ValidationError({"source_uri": "This field is required."})
        return data


class DashboardSerializer(serializers.ModelSerializer):

    class Meta:
        model = Dashboard
        fields = (
            "id",
            "name",
            "owner",
            "company",
            "created_at",
            "updated_at",
        )
        extra_fields = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True}
        }


class PageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Page
        fields = (
            "id",
            "name",
            "dashboard",
            "created_at",
            "updated_at",
        )
        extra_fields = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True}
        }


class ShareSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255, required=False)

    class Meta:
        model = Share
        fields = ("id", "user", "email", "dashboard", "public", "company", "role", "share_key")
        extra_fields = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
            "user": {"write_only": True},
        }

    def validate(self, data):
        data = super().validate(data)
        if data.get("email"):
            user = User.objects.filter(email=data["email"])
            if user.exists():
                data["user"] = user.first()
            else:
                raise serializers.ValidationError({"email": "User doesn't exist."})
        share_record = Share.objects.filter(dashboard=data.get("dashboard"))
        if data.get("user") and share_record.filter(user=data.get("user")).exists():
            raise serializers.ValidationError({"user": "Dashboard already has been shared with this user."})
        if data.get("user") and Dashboard.objects.filter(owner=data.get("user")).exists():
            raise serializers.ValidationError({"user": "Dashboard already has been shared with this user."})
        if data.get("company") and share_record.filter(company=data.get("company")).exists():
            raise serializers.ValidationError(
                {"company": "Dashboard already has been shared with this company."})
        if data.get("public") and share_record.filter(public=True).exists():
            raise serializers.ValidationError({"public": "Dashboard already has been shared publicly."})
        if not (data.get("user") or data.get("company") or data.get("public")):
            raise serializers.ValidationError({"error": "one sharer is required."})
        if data.get("user") and data.get("company") and data.get("public"):
            raise serializers.ValidationError({"error": "Can share with multiple in one request."})
        if data.get("user") and data.get("company"):
            raise serializers.ValidationError({"error": "Can share with multiple in one request."})
        if data.get("user") and data.get("public"):
            raise serializers.ValidationError({"error": "Can share with multiple in one request."})
        if data.get("company") and data.get("public"):
            raise serializers.ValidationError({"error": "Can share with multiple in one request."})

        return data

    def save(self):
        share = Share.objects.filter(dashboard=self.validated_data.get("dashboard"))
        if share.exists():
            self.validated_data["share_key"] = share.first().share_key
        else:
            self.validated_data["share_key"] = f"{self.validated_data.get('dashboard')}{Utils.get_random_number()}"

        if self.validated_data.get("email"):
            del self.validated_data["email"]

        share = Share(**self.validated_data)
        share.save()
        return share


class ChangeRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Share
        fields = ("role",)
