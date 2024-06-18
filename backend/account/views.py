from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from .models import Company, User
from .serializers import (
    CompanySerializer,
    UserSerializer,
    ChangePasswordSerializer,
    ProfileUpdateSerializer,
    InActivateUserSerializer,
)


# Create your views here.
class CompanyView(APIView):

    def get(self, request):
        companies = Company.objects.all()
        serializer = CompanySerializer(companies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = CompanySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserRegistrationView(APIView):
    permission_classes = ()

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"user": serializer.data, "message": "User Created Successfully."},
            status=status.HTTP_201_CREATED
        )


class UserView(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        user = get_object_or_404(User, pk=request.user.id)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        user = get_object_or_404(User, pk=request.user.id)
        serializer = ProfileUpdateSerializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request):
        user = get_object_or_404(User, pk=request.user.id)
        serializer = InActivateUserSerializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"msg": "User has been scheduled for deletion successfully."}, status=status.HTTP_200_OK)


class DeleteUser(APIView):

    def delete(self, request):
        print("debug request body", request.data['pk'], "debug again")
        pk = int(request.data['pk'])
        print(type(pk))
        # pk = request.DELETE.get('pk')
        # pk=10
        user = get_object_or_404(User, id=pk)
        print(user)
        user.delete()
        return Response({"msg": "User has been deleted successfully."}, status=status.HTTP_200_OK)


class ChangePasswordView(APIView):
    permission_classes = (IsAuthenticated,)

    def patch(self, request):
        user = get_object_or_404(User, pk=request.user.id)
        serializer = ChangePasswordSerializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"msg": "Password updated successfully."}, status=status.HTTP_200_OK)


class UserListView(APIView):

    def get(self, request):
        users = User.objects.all()
        user_serializer = UserSerializer(users, many=True)
        return Response(user_serializer.data, status=status.HTTP_200_OK)
