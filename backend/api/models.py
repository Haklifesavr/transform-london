from django.conf import settings
from django.db import models
from account.models import Company


class Dashboard(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}"


class Page(models.Model):
    name = models.CharField(max_length=100)
    # owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    dashboard = models.ForeignKey(Dashboard, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}"


class DataSource(models.Model):
    class SourceTypes(models.TextChoices):
        EXCEL = "EXCEL", "Excel"
        CSV = "CSV", "CSV"
        GOOGLE_SHEET = "GOOGLE_SHEET", "Google Sheet"
        MEDIA = "MEDIA", "Media"
    source_type = models.CharField(max_length=12, choices=SourceTypes.choices)
    source_uri = models.CharField(max_length=250, null=True, blank=True, unique=True)
    processed_uri = models.CharField(max_length=650, null=True, blank=True, unique=True)
    dashboard = models.ForeignKey(Dashboard, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)


class Share(models.Model):
    class Roles(models.TextChoices):
        VIEW = "V", "View"
        SHARE = "S", "Share"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    dashboard = models.ForeignKey(Dashboard, on_delete=models.CASCADE)
    public = models.BooleanField(default=False, blank=True)
    company = models.ForeignKey(Company, null=True, blank=True, on_delete=models.CASCADE)
    role = models.CharField(max_length=1, choices=Roles.choices)
    share_key = models.CharField(max_length=64, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)
