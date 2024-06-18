from django import forms

from .models import DataSource, Share
from .utils import GCS, GoogleSheet, Utils


class ContentTypes:
    EXCEL = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    EXCEL_2 = 'application/vnd.ms-excel'
    CSV = "text/csv"


class DataSourceCreationForm(forms.ModelForm):
    sheet_url = forms.CharField(label="Google Sheet File", widget=forms.TextInput, required=False)
    file = forms.FileField(label='File', widget=forms.FileInput, required=False)

    class Meta:
        model = DataSource
        fields = ('dashboard', 'source_type',)

    def is_valid(self):
        valid = super().is_valid()
        if self.cleaned_data.get("source_type") != DataSource.SourceTypes.GOOGLE_SHEET.name:
            if not self.cleaned_data.get("file"):
                self.add_error("file", "file is required.")
                valid = False
            elif self.cleaned_data.get("source_type") == DataSource.SourceTypes.EXCEL.name:
                if (self.cleaned_data.get("file").content_type != ContentTypes.EXCEL and
                        self.cleaned_data.get("file").content_type != ContentTypes.EXCEL_2):
                    self.add_error("file", "Invalid Content Type, doesn't match with selected source type.")
                    valid = False
            elif self.cleaned_data.get("source_type") == DataSource.SourceTypes.CSV.name:
                if self.cleaned_data.get("file").content_type != ContentTypes.CSV:
                    self.add_error("file", "Invalid Content Type, doesn't match with selected source type.")
                    valid = False
        elif self.cleaned_data.get("source_type") == DataSource.SourceTypes.GOOGLE_SHEET.name:
            if not self.cleaned_data.get("sheet_url"):
                self.add_error("sheet_url", "Google Sheet url is required.")
                valid = False
        return valid

    def save(self, commit=True):
        uri = ""
        data_source = super(DataSourceCreationForm, self).save(commit=False)
        if self.cleaned_data.get("source_type") == DataSource.SourceTypes.GOOGLE_SHEET.name:
            uri = GoogleSheet.export_file(self.cleaned_data.get("sheet_url"), self.cleaned_data.get("dashboard"))
        elif self.cleaned_data.get("file"):
            uri = GCS.upload(file_obj=self.cleaned_data.get("file"), data_source=self.cleaned_data)
        if uri and uri != "exist":
            data_source.source_uri = uri
            data_source.save(True)
        elif uri and uri == "exist":
            self.add_error("file", "File with same name already exist.")
            data_source.source_uri = "Same data source already present."
        else:
            self.add_error("file", "Facing issue on uploading file.")
            data_source.source_uri = "Issue while uploading file"
        return data_source


class ShareCreationForm(forms.ModelForm):

    class Meta:
        model = Share
        fields = ('dashboard', 'user', 'company', 'public', 'role')

    def is_valid(self):
        valid = super().is_valid()

        if not (self.cleaned_data.get("public") or self.cleaned_data.get("company") or self.cleaned_data.get("user")):
            self.add_error("user", "One sharer is required.")
        elif self.cleaned_data.get("public") and self.cleaned_data.get("company") and self.cleaned_data.get("user"):
            self.add_error("user", "Cannot share with multiple at the same time.")
            self.add_error("company", "Cannot share with multiple at the same time.")
            self.add_error("public", "Cannot share with multiple at the same time.")
        elif self.cleaned_data.get("public") and self.cleaned_data.get("company"):
            self.add_error("company", "Cannot share with multiple at the same time.")
            self.add_error("public", "Cannot share with multiple at the same time.")
        elif self.cleaned_data.get("company") and self.cleaned_data.get("user"):
            self.add_error("user", "Cannot share with multiple at the same time.")
            self.add_error("company", "Cannot share with multiple at the same time.")
        elif self.cleaned_data.get("public") and self.cleaned_data.get("user"):
            self.add_error("user", "Cannot share with multiple at the same time.")
            self.add_error("public", "Cannot share with multiple at the same time.")
        else:
            existing_share = Share.objects.filter(dashboard=self.cleaned_data.get("dashboard"))
            if existing_share.exists():
                if self.cleaned_data.get("public") and existing_share.filter(public=True).exists():
                    self.add_error("public", "Already shared publicly")
                elif (
                    self.cleaned_data.get("company") and
                    existing_share.filter(company=self.cleaned_data.get("company")).exists()
                ):
                    self.add_error("company", "Already shared with this company")
                elif self.cleaned_data.get("user") and existing_share.filter(user=self.cleaned_data.get("user")).exists():
                    self.add_error("user", "Already shared with this user")

        return not bool(self.errors)

    def save(self, commit=True):
        share = super(ShareCreationForm, self).save(commit=False)
        existing_rows = Share.objects.filter(dashboard=share.dashboard.id)
        if existing_rows.exists():
            share_key = existing_rows.first().share_key
        else:
            share_key = f"{share.dashboard.id}{Utils.get_random_number()}"
        share.share_key = share_key
        share.save(True)
        return share
