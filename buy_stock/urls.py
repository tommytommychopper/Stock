from django.urls import path
from . import views

urlpatterns = [
    path('', views.buy_stock, name='buy_stock'),
]