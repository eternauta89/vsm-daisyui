from django.urls import reverse


def nav_items(request):
    return {
        'nav_items': [
            {'key': 'inicio', 'label': 'Panel principal', 'icon': 'home', 'url': reverse('core:inicio')},
            {'key': 'vales-de-salida', 'label': 'Vales de salida', 'icon': 'file-text', 'url': reverse('core:vales-de-salida')},
            {'key': 'registros', 'label': 'Registros', 'icon': 'clock', 'url': reverse('core:registros')},
            {'key': 'control-de-stock', 'label': 'Control de stock', 'icon': 'bar-chart-3', 'url': reverse('core:control-de-stock')},
            {'key': 'permiso-de-retiro', 'label': 'Permisos de retiro', 'icon': 'shield-check', 'url': reverse('core:permiso-de-retiro')},
            {'key': 'firmas-digitales', 'label': 'Firmas digitales', 'icon': 'file-signature', 'url': reverse('core:firmas-digitales')},
        ],
    }
