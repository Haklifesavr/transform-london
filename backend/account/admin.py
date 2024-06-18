from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import Company, User
from .forms import UserCreationForm, UserChangeForm


admin.site.unregister(Group)


# Register your models here.
@admin.register(User)
class UserAdmin(BaseUserAdmin):

    form = UserChangeForm
    add_form = UserCreationForm

    list_display = ["first_name", "last_name", "email", "company_name", "is_admin", "is_active", "link"]
    list_filter = ()

    list_editable = ["first_name", "last_name"]
    list_display_links = ["link"]
    list_select_related = ["company"]

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'company')}),
        ('Permissions', {'fields': ('is_admin',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'password1', 'password2')}
        ),
    )
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ()

    def link(self, user):
        return "open"

    def company_name(self, user):
        if user.company:
            return user.company.name
        return None


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "website", "link"]
    list_editable = ["name", "slug"]
    list_display_links = ["link"]

    def link(self, company):
        return "open"