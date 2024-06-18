from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.views import TokenVerifyView

from . import views


app_name = "accounts_urls"

urlpatterns = [
    # For company
    path("company/", views.CompanyView.as_view()),
    # For User Registration
    path("register/", views.UserRegistrationView.as_view()),

    # For Profile
    path("profile/", views.UserView.as_view()),
    path("profile/password/", views.ChangePasswordView.as_view()),

    # For Deleting User (Admin Use Only)
    path("profile/delete/", views.DeleteUser.as_view()),

    # For Authentication
    path("auth/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),

    path("users/list/", views.UserListView.as_view()),
]
