from rest_framework import generics, permissions
from rest_framework.response import Response

from . import permissions as custom_permissions
from .models import Prediction
from .serializers import PredictionSerializer

# Create your views here.


class PredictionListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PredictionSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        if queryset is not None:
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        else:
            return Response({"error": "User or Match required"}, status=400)

    def get_queryset(self):
        qs = Prediction.objects.all()
        try:
            user = self.request.query_params.get('user')
            match = self.request.query_params.get('match')
            if not user and not match:
                raise ValueError
            if user:
                qs = qs.filter(user__id=user).order_by('-updated')
            if match:
                qs = qs.filter(match__num=int(match)).order_by('-updated')
            return qs
        except:
            return None


class PredictionUpdateView(generics.UpdateAPIView):
    permission_classes = [custom_permissions.IsOwnerorAuthenticatedOnly]
    serializer_class = PredictionSerializer
    lookup_field = 'id'
    queryset = Prediction.objects.all()
