from django.core import exceptions
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import Company, User


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ("id", "name", "slug", "website", "logo_link")
        extra_kwargs = {
            "id": {"read_only": True}
        }


class ChangePasswordSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("password", "confirm_password")
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def validate(self, data):
        data = super().validate(data)
        try:
            if not data.get("password") == data.get("confirm_password"):
                raise serializers.ValidationError({"error": "Password doesn't match"})
            validate_password(password=data.get("password"))
            return data
        except exceptions.ValidationError as e:
            errors = {"password": list(e.messages)}
            raise serializers.ValidationError(errors)

    def save(self):
        user = self.instance
        user.set_password(self.validated_data.get("password"))
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(max_length=60, write_only=True)
    company_name = serializers.CharField(max_length=100, write_only=True, default=None)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "password",
            "confirm_password",
            "company",
            "company_name",
            "is_admin",
        )
        extra_kwargs = {
            "id": {"read_only": True},
            "password": {"write_only": True},
            "is_admin": {"read_only": True},
        }

    def save(self):
        if self.validated_data.get("company_name"):
            company = Company.objects.filter(name__icontains=self.validated_data["company_name"])
            if company.exists():
                self.validated_data["company"] = company.first()

        del self.validated_data["confirm_password"]
        del self.validated_data["company_name"]

        user = User(**self.validated_data)
        user.set_password(self.validated_data.get("password"))
        user.save()
        return user

    def validate(self, data):
        data = super().validate(data)
        try:
            if not data.get("password") == data.get("confirm_password"):
                raise serializers.ValidationError({"error": "Password doesn't match"})
            validate_password(password=data.get("password"))
            return data
        except exceptions.ValidationError as e:
            errors = {"password": list(e.messages)}
            raise serializers.ValidationError(errors)


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("first_name", "last_name")


class InActivateUserSerializer(serializers.ModelSerializer):
    is_active = serializers.BooleanField(default=False)

    class Meta:
        model = User
        fields = ("is_active", )

