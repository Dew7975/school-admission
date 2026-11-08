from django.shortcuts import render


from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import FormSubmission
from .serializers import FormSubmissionSerializer

class FormSubmissionViewSet(viewsets.ModelViewSet):
    queryset = FormSubmission.objects.all().order_by('-created_at')
    serializer_class = FormSubmissionSerializer

    # Status summary counts ganna custom action ekak (Accepted, Rejected, Pending counts)
    @action(detail=False, methods=['GET'])
    def summary(self, request):
        total = self.queryset.count()
        pending = self.queryset.filter(status='Pending').count()
        accepted = self.queryset.filter(status='Accepted').count()
        rejected = self.queryset.filter(status='Rejected').count()
        
        return Response({
            'total': total,
            'pending': pending,
            'accepted': accepted,
            'rejected': rejected
        })