import logging
import os

from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from .serializers import (
    DashboardSerializer, DataSourceSerializer, ShareSerializer, ChangeRoleSerializer, GoogleSheetSerializer, PageSerializer
)
from .models import Dashboard, Share, DataSource, Page
from account.models import Company, User
from account.serializers import CompanySerializer
from .utils import GCS, Firestore, GoogleSheet
import json
import pandas as pd


logger = logging.getLogger("django")


class DashboardView(APIView):

    def get(self, request):
        dashboards = Dashboard.objects.all()
        serializer = DashboardSerializer(dashboards, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        dashboard_serializer = DashboardSerializer(data=request.data)
        dashboard_serializer.is_valid(raise_exception=True)
        dashboard_serializer.save()
        return Response(dashboard_serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request, dash_id):
        dashboard = get_object_or_404(Dashboard, pk=dash_id)
        serializer = DashboardSerializer(dashboard, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, dash_id):
        dashboard = get_object_or_404(Dashboard, pk=dash_id)
        dashboard.delete()
        return Response({"msg": "Dashboard has been deleted successfully."}, status=status.HTTP_200_OK)


class DashboardDetailView(APIView):
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get_dashboard_metadata(dashboard):
        company = CompanySerializer(dashboard.company)
        datasources = DataSource.objects.filter(dashboard_id=dashboard.id)
        dashboard = DashboardSerializer(dashboard)
        datasources = DataSourceSerializer(datasources, many=True)

        source_types = set()
        for datasource in datasources.data:
            if datasource.get("source_type") == DataSource.SourceTypes.MEDIA:
                source_types.add("media")
            else:
                source_types.add("charts")
        response = {"dashboard": dashboard.data, "sources": source_types, "company": company.data}
        return Response(response, status=status.HTTP_200_OK)

    def get(self, request, dash_id):
        user_id = request.user.id
        dashboard = get_object_or_404(Dashboard, pk=dash_id)
        if Share.objects.filter(user=user_id, dashboard=dash_id).exists() or dashboard.owner.id == user_id:
            return DashboardDetailView.get_dashboard_metadata(dashboard)
        return Response(status=status.HTTP_401_UNAUTHORIZED)


class UserDashboardView(APIView):
    permission_classes = (IsAuthenticated,)

    def get_dashboard_data(self, dashboard):
        dashboard_data = DashboardSerializer(dashboard).data
        dashboard_data["company"] = dashboard.company.name
        dashboard_data["owner"] = dashboard.owner.email
        page = Page.objects.filter(dashboard=dashboard.id).all()
        # print("DEBUG PAGE", page)
        page_data = PageSerializer(page, many=True).data
        dashboard_data["pages"] = page_data
        return dashboard_data

    def get(self, request):
        dashboards = {}

        owner_dashboards = Dashboard.objects.filter(owner=request.user.id).all()
        for dashboard in owner_dashboards:
            dashboards[dashboard.id] = self.get_dashboard_data(dashboard)

        user_level_share = Share.objects.filter(user=request.user.id)
        for share in user_level_share:
            dashboard = share.dashboard
            if dashboard.id not in dashboards:
                dashboards[dashboard.id] = self.get_dashboard_data(dashboard)

        if request.user.company:
            company_level_share = Share.objects.filter(company=request.user.company.id)
            for share in company_level_share:
                dashboard = share.dashboard
                if dashboard.id not in dashboards:
                    dashboards[dashboard.id] = self.get_dashboard_data(dashboard)

        return Response(dashboards.values(), status=status.HTTP_200_OK)


class DashboardDataSourceView(APIView):

    def get(self, request, dash_id):
        data_sources = DataSource.objects.filter(dashboard=dash_id)
        serializer = DataSourceSerializer(data_sources, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GoogleSheetView(APIView):

    def post(self, request):
        try:
            serializer = GoogleSheetSerializer(data=request.data)
            if serializer.is_valid():
                data = serializer.validated_data
                source_uri = GoogleSheet.export_file(data.get("source_uri"), data.get("dashboard"))
                if source_uri:
                    serializer.validated_data["source_uri"] = source_uri
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(
                    {"error": "Error while exporting google sheet content."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DataSourceView(APIView):

    def post(self, request):
        try:
            serializer = DataSourceSerializer(data=request.data)
            if serializer.is_valid():
                file_obj = request.data.get("file")
                source_uri = GCS.upload(file_obj, serializer.validated_data)
                if source_uri and source_uri != "exist":
                    serializer.validated_data["source_uri"] = source_uri
                    data_source = serializer.save()
                    return Response(DataSourceSerializer(data_source).data, status=status.HTTP_201_CREATED)
                elif source_uri and source_uri == "exist":
                    return Response({"file": "File with same name already exist."},
                                    status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({"error": "Facing issue while uploading file"},
                                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.exception(e)
            return Response("An error occurred.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request, pk):
        data_source = get_object_or_404(DataSource, pk=pk)
        serializer = DataSourceSerializer(data_source)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        data_source = get_object_or_404(DataSource, pk=pk)
        blob_name = data_source.source_uri.split(f"{os.getenv('BUCKET')}/")[-1]
        GCS.delete_blob(blob_name, os.getenv("BUCKET"))
        data_source.delete()
        return Response({"msg": "Data Source has been deleted successfully."}, status=status.HTTP_200_OK)


class ChartsView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, page_id):
        collections = {"Performance": "transform-london", "Opportunity": "opportunity_page", "Technical": "technical", "CLTV": "cltv", "Overview": "overview"}
        page = get_object_or_404(Page, pk=page_id)
        dashboard = get_object_or_404(Dashboard, pk=page.dashboard.id)
        company_slug = dashboard.company.slug
        if page.name == "Performance" or page.name == "Technical":
            charts = GCS.read_file(f"{page.name.lower()}/{company_slug}.json","transform-london-company")
            print("DEBUG CHARTS in bucket", charts)
        else:
            firestore = Firestore(project_id=os.getenv("PROJECT_ID"), collection=collections[page.name])
            charts = firestore.read_collection(_id=f"{company_slug}")[0]
            print("DEBUG CHARTS in firestore", charts)
        if charts:
            return Response(charts, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)


class MediaView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, dash_id):
        dashboard = get_object_or_404(Dashboard, pk=dash_id)
        company_slug = dashboard.company.slug
        firestore = Firestore(project_id=os.getenv("PROJECT_ID"), collection="media")
        media = firestore.read_collection(_id=f"{company_slug}-{dashboard.id}")
        if media:
            return Response(media[0], status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)


class PublicChartsView(APIView):
    permission_classes = ()

    @staticmethod
    def get_dashboard_content(dashboard, collection="charts"):
        company_slug = dashboard.company.slug
        firestore = Firestore(project_id=os.getenv("PROJECT_ID"), collection=collection)
        content = firestore.read_collection(_id=f"{company_slug}-{dashboard.id}")
        if content:
            return Response(content[0], status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)

    def get(self, request, dash_id):
        user = request.user
        dashboard = get_object_or_404(Dashboard, pk=dash_id)
        share_records = Share.objects.filter(dashboard=dashboard.id)
        if share_records.filter(public=True).exists():
            return self.get_dashboard_content(dashboard)
        elif share_records.exists() and user.is_authenticated:
            if user.company.id and share_records.filter(company_id=user.company.id).exists():
                return self.get_dashboard_content(dashboard)
            elif share_records.filter(user_id=user.id).exists():
                return self.get_dashboard_content(dashboard)
            elif dashboard.owner.id == user.id:
                return self.get_dashboard_content(dashboard)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)

        return Response(status=status.HTTP_404_NOT_FOUND)


class PublicMediaView(APIView):
    permission_classes = ()

    def get(self, request, dash_id):
        user = request.user
        dashboard = get_object_or_404(Dashboard, pk=dash_id)
        share_records = Share.objects.filter(dashboard=dashboard.id)
        if share_records.filter(public=True).exists():
            return PublicChartsView.get_dashboard_content(dashboard, "media")
        elif share_records.exists() and user.is_authenticated:
            if user.company.id and share_records.filter(company_id=user.company.id).exists():
                return PublicChartsView.get_dashboard_content(dashboard, "media")
            elif share_records.filter(user_id=user.id).exists():
                return PublicChartsView.get_dashboard_content(dashboard, "media")
            elif dashboard.owner.id == user.id:
                return PublicChartsView.get_dashboard_content(dashboard, "media")
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)

        return Response(status=status.HTTP_404_NOT_FOUND)


class ShowShareView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, dash_id):
        share_records = Share.objects.filter(dashboard=dash_id)
        user_share = share_records.filter(public=False, company=None)
        users = []
        if user_share.exists():
            for share in user_share:
                share_serializer = ShareSerializer(share)
                email = User.objects.get(pk=share.user.id).email
                users.append({**share_serializer.data, "user": email})
        other_share = share_records.filter(user=None)
        others = []
        if other_share.exists():
            for share in other_share:
                share_serializer = ShareSerializer(share)
                if share.company:
                    company = Company.objects.get(pk=share.company.id).name
                    others.append({**share_serializer.data, "company": company})
                else:
                    others.append(share_serializer.data)

        share = {"users": users, "others": others}
        return Response(share, status=status.HTTP_200_OK)


class ShareDashboardView(APIView):
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def _is_authorized(dashboard_id, user_id, company_id):
        if Dashboard.objects.filter(pk=dashboard_id, owner=user_id).exists():
            return True
        elif Share.objects.filter(dashboard=dashboard_id, user=user_id, role="S").exists():
            return True
        elif company_id and Share.objects.filter(dashboard=dashboard_id, company=company_id, role="S").exists():
            return True
        elif Share.objects.filter(dashboard=dashboard_id, public=True, role="S").exists():
            return True
        return False

    def post(self, request):
        serializer = ShareSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if self._is_authorized(request.data.get("dashboard"), request.user.id, request.user.company):
            share = serializer.save()
            return Response(ShareSerializer(share).data, status=status.HTTP_201_CREATED)

        return Response(status=status.HTTP_401_UNAUTHORIZED)

    def patch(self, request, share_id):
        share = get_object_or_404(Share, pk=share_id)
        serializer = ChangeRoleSerializer(share, data=request.data)
        serializer.is_valid(raise_exception=True)
        if self._is_authorized(share.dashboard_id, request.user.id, request.user.company_id):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_401_UNAUTHORIZED)

    def delete(self, request, share_id):
        share = get_object_or_404(Share, pk=share_id)
        if self._is_authorized(share.dashboard_id, request.user.id, request.user.company_id):
            share.delete()
            return Response(status=status.HTTP_200_OK)


class PublicShareView(APIView):
    permission_classes = ()

    def get(self, request, company, share_id):
        try:
            user = request.user
            share_records = Share.objects.filter(share_key=share_id)
            company = Company.objects.filter(slug=company)

            if share_records.exists() and company.exists():
                dashboard_id = share_records.first().dashboard.id
                company_id = company.first().id
                dashboard = Dashboard.objects.filter(id=dashboard_id, company_id=company_id)
                if not dashboard.exists():
                    return Response(status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)

            dashboard = dashboard.first()
            if share_records.filter(public=True).exists():
                return DashboardDetailView.get_dashboard_metadata(dashboard)
            elif share_records.exists() and user.is_authenticated:
                if user.company.id and share_records.filter(company_id=user.company.id).exists():
                    return DashboardDetailView.get_dashboard_metadata(dashboard)
                elif share_records.filter(user_id=user.id).exists():
                    return DashboardDetailView.get_dashboard_metadata(dashboard)
                elif dashboard.owner.id == user.id:
                    return DashboardDetailView.get_dashboard_metadata(dashboard)
                else:
                    return Response(status=status.HTTP_401_UNAUTHORIZED)

            return Response(status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
