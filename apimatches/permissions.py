from rest_framework import permissions


class IsAdminorReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to authenticated requests only
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user.is_authenticated and request.user.profile.ipl_admin
