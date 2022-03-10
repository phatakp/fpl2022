from rest_framework import permissions


class IsOwnerorAuthenticatedOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to authenticated requests only
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated

        return obj.user == request.user
