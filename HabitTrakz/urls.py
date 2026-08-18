from django.urls import path
from . import views
from .views import HabitDetailAPIView, HabitListCreateAPIView, HabitLogDetailAPIView
from .views import HabitListCreateAPIView, HabitLogListCreateAPIView
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)
from .views import RegisterAPIView

urlpatterns = [
    path('', views.home, name='home'),
    path('add/', views.add_habit, name='add_habit'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('api/habits/', HabitListCreateAPIView.as_view(), name='habit-api'),
    path('api/habit-logs/', HabitLogListCreateAPIView.as_view(), name='habit-log-api'),
    path('api/habit-logs/<int:pk>/',HabitLogDetailAPIView.as_view(),name='habit-log-detail'),
   path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
   path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
   path('api/register/', RegisterAPIView.as_view(), name='register-api'),
   path("api/habits/<int:pk>/", HabitDetailAPIView.as_view()),
]
