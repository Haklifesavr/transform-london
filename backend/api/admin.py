import os

from django.contrib import admin

from .models import DataSource, Dashboard, Share, Page
from .forms import DataSourceCreationForm, ShareCreationForm
from .utils import GCS


# Register your models here.
@admin.register(Dashboard)
class DashboardAdmin(admin.ModelAdmin):
    list_display = ["name", "owner", "company_name", "link"]
    list_editable = ["name"]
    list_display_links = ["link"]
    list_select_related = ["company"]
    list_filter = ["company"]

    def link(self, dashboard):
        return "open"

    def company_name(self, dashboard):
        if dashboard.company:
            return dashboard.company.name
        return None


@admin.register(DataSource)
class DataSourceAdmin(admin.ModelAdmin):
    form = DataSourceCreationForm

    list_display = ["source_type", "source_uri", "dashboard"]
    list_filter = ["dashboard"]

    def delete_model(self, request, obj):
        """
        Given a model instance delete it from the database.
        """
        if obj.source_uri:
            file_name = obj.source_uri.replace(f"gs://{os.getenv('BUCKET')}/", "")
            GCS.delete_blob(file_name, os.getenv("BUCKET"))
        obj.delete()

    def delete_queryset(self, request, queryset):
        """Given a queryset, delete it from the database."""
        for datasource in queryset:
            if datasource.source_uri:
                file_name = datasource.source_uri.replace(f"gs://{os.getenv('BUCKET')}/", "")
                GCS.delete_blob(file_name, os.getenv("BUCKET"))

        queryset.delete()


@admin.register(Share)
class ShareAdmin(admin.ModelAdmin):
    form = ShareCreationForm

    list_display = ["dashboard", "user", "company_name", "public", "role", "share_key", "link"]
    list_editable = ["role"]
    list_display_links = ["link"]
    list_filter = ["dashboard"]

    def link(self, share):
        return "open"

    def company_name(self, share):
        if share.company:
            return share.company.name
        return None

@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ["name", "dashboard_name", "link"]
    list_editable = ["name"]
    list_display_links = ["link"]
    list_select_related = ["dashboard"]
    list_filter = ["dashboard"]

    def link(self, page):
        return "open"

    def dashboard_name(self, page):
        if page.dashboard.name:
            return page.dashboard.name
        return None