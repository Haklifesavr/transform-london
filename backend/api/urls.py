from django.urls import path
from . import views

urlpatterns = [

    # ========== Dashboard Endpoints ========== #
    path("dashboards/", views.DashboardView.as_view()),
    path("dashboards/<int:dash_id>", views.DashboardView.as_view()),
    path("dashboards/details/<int:dash_id>", views.DashboardDetailView.as_view()),

    path("dashboards/users/", views.UserDashboardView.as_view()),

    # ========== Data Source Endpoints ========== #
    path("dashboards/<int:dash_id>/datasources/", views.DashboardDataSourceView.as_view()),

    # For datasource creation
    path("datasources/", views.DataSourceView.as_view()),
    # For datasource update
    path("datasources/<int:pk>", views.DataSourceView.as_view()),
    # For google sheet data source
    path("datasources/googlesheet/", views.GoogleSheetView.as_view()),

    # For datasource view and delete
    path("datasources/<int:pk>", views.DataSourceView.as_view()),

    # ========== Charts Endpoints ========== #
    path("dashboards/<int:page_id>/charts/", views.ChartsView.as_view()),

    # ========== Media Endpoints ========== #
    path("dashboards/<int:dash_id>/media/", views.MediaView.as_view()),

    # ========== Dashboard Share Endpoints ========== #

    # View dashboards share participant
    path("dashboards/<int:dash_id>/share/", views.ShowShareView.as_view()),

    # Share dashboard
    path("dashboards/share/", views.ShareDashboardView.as_view()),

    # Delete share access and update role
    path("dashboards/sharer/<int:share_id>", views.ShareDashboardView.as_view()),

    # Access public share
    path("company/<str:company>/link/<str:share_id>", views.PublicShareView.as_view()),
    path("public/dashboards/<int:dash_id>/charts/", views.PublicChartsView.as_view()),
    path("public/dashboards/<int:dash_id>/media/", views.PublicMediaView.as_view()),
]


