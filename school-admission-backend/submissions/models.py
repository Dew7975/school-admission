from django.db import models

class FormSubmission(models.Model):
    applicant_name = models.CharField(max_length=255)
    grade_level = models.CharField(max_length=50)
    gender = models.CharField(max_length=20)
    extracurriculars = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, default='Pending')
    profile_image = models.FileField(upload_to='images/', blank=True, null=True)
    document = models.FileField(upload_to='documents/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.applicant_name