"""finance URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from portfolio import views as portfolio_views
from cash import views as cash_views
from buy_stock import views as buy_stock_views 


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', portfolio_views.portfolio, name='portfolio'),
    path('', include('users.urls')),
    path('add/', cash_views.add_cash, name='add_cash'), 
    path('buy/', buy_stock_views.buy_stock, name='buy_stock'),
]
