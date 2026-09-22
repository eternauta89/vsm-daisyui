from django.urls import path

from . import views

app_name = 'core'

urlpatterns = [
    path('', views.inicio, name='inicio'),
    path('vales-de-salida/', views.vales_de_salida, name='vales-de-salida'),
    path('vales-de-salida/nuevo/', views.crear_vale, name='crear-vale'),
    path('vales-de-salida/<str:vsm>/entregar/', views.entregar_vale, name='entregar-vale'),
    path('registros/', views.registros, name='registros'),
    path('control-de-stock/', views.control_de_stock, name='control-de-stock'),
    path('permiso-de-retiro/', views.permiso_de_retiro, name='permiso-de-retiro'),
    path('firmas-digitales/', views.firmas_digitales, name='firmas-digitales'),
    path('firmas-digitales/<str:vsm>/firmar/', views.firmar_solicitud, name='firmar-solicitud'),
]
