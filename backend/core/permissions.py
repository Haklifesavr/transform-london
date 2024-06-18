from rest_framework.permissions import IsAuthenticated


class IsAdminUser(IsAuthenticated):
    """
    Allows access only to admin users.
    """

    def has_permission(self, request, view):
        if super().has_permission(request, view):
            return bool(request.user.is_active and request.user.is_admin)
