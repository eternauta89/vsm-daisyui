import json
from datetime import datetime

from django.contrib import messages
from django.core.paginator import Paginator
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

# ---------------------------------------------------------------------------
# Mock data (mirrors the data used in the previous React version)
# ---------------------------------------------------------------------------

# A real (in-memory, process-lifetime) list instead of data regenerated per
# request, so creating/delivering a vale actually mutates shared state and
# the affected row can be moved to the front of its tab.
VALES = [
    {
        'vsm': f'#{1500 + i}',
        'tipo': 'EPP',
        'retirante': 'Juarez Bruno Tomas',
        'legajo': 'Leg. 29369',
        'solicitante': 'frodriguez',
        'almacen': 'INC',
        'facturado': 'No facturado',
        'cc': '123',
        'fecha': '24/06/2026',
        'estado': estado,
    }
    for i, estado in enumerate(
        ['Pendiente'] * 6 + ['Entregado'] * 6 + ['No autorizada'] * 6
    )
]
_next_vsm = [1500 + len(VALES)]

VALES_TABS_LABELS = [
    {'key': 'todos', 'label': 'Todos'},
    {'key': 'pendientes', 'label': 'Pendientes'},
    {'key': 'entregados', 'label': 'Entregados'},
    {'key': 'no-autorizadas', 'label': 'No autorizadas'},
]

ESTADO_POR_TAB = {
    'pendientes': 'Pendiente',
    'entregados': 'Entregado',
    'no-autorizadas': 'No autorizada',
}


def get_vales(tab):
    if tab == 'todos':
        return list(VALES)
    estado = ESTADO_POR_TAB.get(tab)
    return [v for v in VALES if v['estado'] == estado]


def vales_tabs():
    return [{**t, 'count': len(get_vales(t['key']))} for t in VALES_TABS_LABELS]


def filtra_vales(vales, busqueda):
    if not busqueda:
        return vales
    b = busqueda.lower()
    return [
        v for v in vales
        if b in v['vsm'].lower() or b in v['retirante'].lower()
        or b in v['solicitante'].lower() or b in v['cc'].lower()
    ]


REGISTROS = [
    {'vsm': '#1500', 'tipo': 'EPP', 'retirante': 'Juarez Bruno Tomas', 'legajo': 'Leg. 29369', 'solicitante': 'frodriguez', 'almacen': 'INC', 'facturado': 'No facturado', 'cc': '123', 'fecha': '24/06/2026', 'estado': 'Entregado'},
    {'vsm': '#1500', 'tipo': 'EPP', 'retirante': 'Juarez Bruno Tomas', 'legajo': 'Leg. 29369', 'solicitante': 'frodriguez', 'almacen': 'INC', 'facturado': 'No facturado', 'cc': '123', 'fecha': '24/06/2026', 'estado': 'Entregado'},
    {'vsm': '#1500', 'tipo': 'EPP', 'retirante': 'Juarez Bruno Tomas', 'legajo': 'Leg. 29369', 'solicitante': 'frodriguez', 'almacen': 'INC', 'facturado': 'No facturado', 'cc': '123', 'fecha': '24/06/2026', 'estado': 'Pendiente'},
    {'vsm': '#1500', 'tipo': 'EPP', 'retirante': 'Juarez Bruno Tomas', 'legajo': 'Leg. 29369', 'solicitante': 'frodriguez', 'almacen': 'INC', 'facturado': 'No facturado', 'cc': '123', 'fecha': '24/06/2026', 'estado': 'No autorizada'},
    {'vsm': '#1500', 'tipo': 'EPP', 'retirante': 'Juarez Bruno Tomas', 'legajo': 'Leg. 29369', 'solicitante': 'frodriguez', 'almacen': 'INC', 'facturado': 'No facturado', 'cc': '123', 'fecha': '24/06/2026', 'estado': 'Entregado'},
    {'vsm': '#1500', 'tipo': 'EPP', 'retirante': 'Juarez Bruno Tomas', 'legajo': 'Leg. 29369', 'solicitante': 'frodriguez', 'almacen': 'INC', 'facturado': 'No facturado', 'cc': '123', 'fecha': '24/06/2026', 'estado': 'Pendiente'},
]

ARTICULOS = [
    {'codigo': '151400051', 'descripcion': 'GUANTE EXAM. NITRILO T.M LIB POLVO AZUL', 'centro': '10000', 'almacen': 'G001', 'stock_sap': '148000'}
    for _ in range(6)
]

MOVIMIENTOS = [
    {'codigo': '151400051', 'descripcion': 'GUANTE EXAM. NITRILO T.M LIB POLVO AZUL', 'almacen': 'G001', 'cantidad_entregada': '47631 uds', 'fecha': '11/08/2026'}
    for _ in range(6)
]

MATERIALES_PERMISO = [
    {'codigo': '151400051', 'descripcion': 'GUANTE EXAM. NITRILO T.M LIB POLVO AZUL', 'clase_sap': 'REP. MAQ', 'centro': '10000'}
    for _ in range(6)
]

CENTROS_PERMISO = [
    {'codigo': '151400051', 'nombre': 'No Autorizado', 'materiales_asignados': 244},
    {'codigo': '151400051', 'nombre': 'Playa de Faena', 'materiales_asignados': 244},
    {'codigo': '151400051', 'nombre': 'Playa de Oreo', 'materiales_asignados': 244},
    {'codigo': '151400051', 'nombre': 'Menudencia de Cabeza', 'materiales_asignados': 244},
    {'codigo': '151400051', 'nombre': 'Mondongueria', 'materiales_asignados': 244},
    {'codigo': '151400051', 'nombre': 'Cueros', 'materiales_asignados': 244},
    {'codigo': '151400051', 'nombre': 'Depostada', 'materiales_asignados': 244},
]

SOLICITUDES_FIRMA = [
    {'vsm': '#1500', 'retirante': 'Juarez Bruno Tomas', 'legajo': 'Leg. 29369', 'solicitante': 'frodriguez', 'cc': '123', 'fecha_solicitud': '24/06/2026', 'firmado': False},
    {'vsm': '#1501', 'retirante': 'Valenzuela Alberto Javier', 'legajo': 'Leg. 2558', 'solicitante': 'frodriguez', 'cc': '123', 'fecha_solicitud': '24/06/2026', 'firmado': True},
    {'vsm': '#1502', 'retirante': 'Ledesma Jorge Omar', 'legajo': 'Leg. 4021', 'solicitante': 'pfernandez', 'cc': '640', 'fecha_solicitud': '23/06/2026', 'firmado': False},
    {'vsm': '#1503', 'retirante': 'Juarez Bruno Tomas', 'legajo': 'Leg. 29369', 'solicitante': 'frodriguez', 'cc': '123', 'fecha_solicitud': '23/06/2026', 'firmado': False},
]

PAGES = [1, 2, '…', 20, 21]

VER_MATERIALES_ITEMS = [
    {'cantidad_solicitada': 1, 'descripcion': 'Faja lumbar', 'codigo_articulo': 'EPP-6634', 'cantidad_entregada': 0},
    {'cantidad_solicitada': 2, 'descripcion': 'Arnés de altura', 'codigo_articulo': 'EPP-7702', 'cantidad_entregada': 2},
    {'cantidad_solicitada': 3, 'descripcion': 'Casco de seguridad', 'codigo_articulo': 'EPP-1842', 'cantidad_entregada': 3},
]

ENTREGA_ITEMS = [
    {'nombre': 'BOTIN NEGRO N° 42 DIELEC AQUILES-N04', 'solicitado': 2, 'entregado': 1},
    {'nombre': 'BOTIN NEGRO N° 42 DIELEC AQUILES-N04', 'solicitado': 2, 'entregado': 1},
    {'nombre': 'BOTIN NEGRO N° 42 DIELEC AQUILES-N04', 'solicitado': 2, 'entregado': 1},
]


# ---------------------------------------------------------------------------
# Views
# ---------------------------------------------------------------------------

def vales_de_salida(request):
    tab = request.GET.get('tab', 'pendientes')
    if tab not in ('todos', 'pendientes', 'entregados', 'no-autorizadas'):
        tab = 'pendientes'
    busqueda = request.GET.get('q', '') if 'buscar' in request.GET else ''
    vales_filtrados = filtra_vales(get_vales(tab), busqueda)

    try:
        por_pagina = int(request.GET.get('por_pagina', 8))
    except ValueError:
        por_pagina = 8
    if por_pagina not in (8, 25, 50):
        por_pagina = 8

    paginator = Paginator(vales_filtrados, por_pagina)
    page_obj = paginator.get_page(request.GET.get('page', 1))
    page_range = list(paginator.get_elided_page_range(page_obj.number, on_each_side=1, on_ends=1))

    qs_sin_page = request.GET.copy()
    qs_sin_page.pop('page', None)

    context = {
        'active_page': 'vales-de-salida',
        'tabs': vales_tabs(),
        'active_tab': tab,
        'vales': page_obj.object_list,
        'page_obj': page_obj,
        'page_range': page_range,
        'por_pagina': por_pagina,
        'qs_sin_page': qs_sin_page.urlencode(),
        'q': request.GET.get('q', ''),
        'busqueda_aplicada': busqueda,
        'columns': ['VSM', 'TIPO', 'RETIRANTE', 'SOLICITANTE', 'ALMACÉN', 'CC', 'FECHA', 'ESTADO'],
        'pages': PAGES,
        'ver_materiales_items': VER_MATERIALES_ITEMS,
        'entrega_items': ENTREGA_ITEMS,
    }
    return render(request, 'core/vales_de_salida.html', context)


def crear_vale(request):
    if request.method != 'POST':
        return HttpResponseRedirect(reverse('core:vales-de-salida'))

    tipo_entrega = request.POST.get('tipo_entrega', '')
    try:
        productos = json.loads(request.POST.get('productos', '[]'))
    except ValueError:
        productos = []

    vsm = f'#{_next_vsm[0]}'
    _next_vsm[0] += 1

    # The retirante select shows "Leg:29369 - Nombre" so it's easy to tell
    # people apart, but the table shows the legajo on its own line already.
    retirante_raw = request.POST.get('retirante', '')
    if ' - ' in retirante_raw:
        legajo_parte, nombre_retirante = retirante_raw.split(' - ', 1)
        legajo = 'Leg. ' + legajo_parte.split(':')[-1].strip()
    else:
        nombre_retirante = retirante_raw
        legajo = 'Leg. 29369'

    VALES.insert(0, {
        'vsm': vsm,
        'tipo': tipo_entrega.split('-')[0].strip() or 'EPP',
        'retirante': nombre_retirante,
        'legajo': legajo,
        'solicitante': 'frodriguez',
        'almacen': request.POST.get('almacen', ''),
        'facturado': 'No facturado',
        'cc': request.POST.get('centro_costos', ''),
        'fecha': datetime.now().strftime('%d/%m/%Y'),
        'estado': 'Pendiente',
        'productos': productos,
        'observaciones': request.POST.get('observaciones', ''),
    })

    messages.success(request, f'Vale {vsm} solicitado correctamente')
    return HttpResponseRedirect(reverse('core:vales-de-salida') + '?tab=pendientes')


def entregar_vale(request, vsm):
    if request.method != 'POST':
        return HttpResponseRedirect(reverse('core:vales-de-salida'))

    resultado = request.POST.get('resultado')
    vale = next((v for v in VALES if v['vsm'] == vsm), None)
    tab = 'pendientes'

    if vale:
        VALES.remove(vale)
        vale['estado'] = 'Entregado' if resultado == 'success' else 'No autorizada'
        VALES.insert(0, vale)
        tab = 'entregados' if resultado == 'success' else 'no-autorizadas'
        if resultado == 'success':
            messages.success(request, f'Entrega de {vsm} registrada correctamente')
        else:
            messages.error(request, f'Tarjeta rechazada para {vsm}. Vale marcado como No autorizada')

    return HttpResponseRedirect(reverse('core:vales-de-salida') + f'?tab={tab}')


def registros(request):
    q = request.GET.get('q', '')
    estado = request.GET.get('estado', 'todos')
    tipo = request.GET.get('tipo', 'todos')
    fecha_desde = request.GET.get('desde', '')
    fecha_hasta = request.GET.get('hasta', '')
    buscado = 'buscar' in request.GET

    registros_filtrados = REGISTROS
    if estado != 'todos':
        registros_filtrados = [r for r in registros_filtrados if r['estado'] == estado]
    if buscado:
        if q:
            b = q.lower()
            registros_filtrados = [
                r for r in registros_filtrados
                if b in r['vsm'].lower() or b in r['retirante'].lower()
                or b in r['solicitante'].lower() or b in r['cc'].lower()
            ]
        if tipo != 'todos':
            registros_filtrados = [r for r in registros_filtrados if r['tipo'] == tipo]

    estado_tabs = [
        {'key': 'todos', 'label': 'Todos'},
        {'key': 'Pendiente', 'label': 'Pendientes'},
        {'key': 'Entregado', 'label': 'Entregados'},
        {'key': 'No autorizada', 'label': 'No autorizadas'},
    ]
    for t in estado_tabs:
        t['count'] = len(REGISTROS) if t['key'] == 'todos' else len([r for r in REGISTROS if r['estado'] == t['key']])

    def sin_params(*claves):
        qs = request.GET.copy()
        for clave in claves:
            qs.pop(clave, None)
        return qs.urlencode()

    def dia_mes_anio(fecha_iso):
        try:
            return datetime.strptime(fecha_iso, '%Y-%m-%d').strftime('%d/%m/%Y')
        except ValueError:
            return fecha_iso

    filtros_aplicados = []
    if buscado:
        if tipo != 'todos':
            filtros_aplicados.append({'label': f'Tipo: {tipo}', 'quitar_url': sin_params('tipo')})
        if fecha_desde:
            filtros_aplicados.append({'label': f'Desde: {dia_mes_anio(fecha_desde)}', 'quitar_url': sin_params('desde')})
        if fecha_hasta:
            filtros_aplicados.append({'label': f'Hasta: {dia_mes_anio(fecha_hasta)}', 'quitar_url': sin_params('hasta')})

    context = {
        'active_page': 'registros',
        'registros': registros_filtrados,
        'columns': ['VSM', 'TIPO', 'RETIRANTE', 'SOLICITANTE', 'ALMACÉN', 'CC', 'FECHA', 'ESTADO'],
        'q': q,
        'estado': estado,
        'estado_tabs': estado_tabs,
        'tipo': tipo,
        'filtros_aplicados': filtros_aplicados,
        'quitar_todos_url': sin_params('tipo', 'desde', 'hasta') if filtros_aplicados else '',
        'desde': fecha_desde,
        'hasta': fecha_hasta,
        'busqueda_aplicada': q if buscado else '',
        'pages': PAGES,
        'ver_materiales_items': VER_MATERIALES_ITEMS,
    }
    return render(request, 'core/registros.html', context)


def control_de_stock(request):
    tab = request.GET.get('tab', 'por-fecha')
    q = request.GET.get('q', '')
    almacen = request.GET.get('almacen', 'todos')
    solo_con_stock = request.GET.get('solo_con_stock') == 'on'
    fecha_desde = request.GET.get('desde', '')
    fecha_hasta = request.GET.get('hasta', '')
    buscado = 'consultar' in request.GET

    consultado_por_fecha = tab == 'por-fecha' and buscado and fecha_desde and fecha_hasta

    movimientos = MOVIMIENTOS if consultado_por_fecha else []
    articulos = ARTICULOS
    if consultado_por_fecha and q:
        b = q.lower()
        movimientos = [m for m in movimientos if b in m['codigo'].lower() or b in m['descripcion'].lower()]
    if buscado and tab == 'existencia-sap' and q:
        b = q.lower()
        articulos = [a for a in articulos if b in a['codigo'].lower() or b in a['descripcion'].lower()]
    if buscado and tab == 'existencia-sap':
        if almacen != 'todos':
            articulos = [a for a in articulos if a['almacen'] == almacen]
        if solo_con_stock:
            articulos = [a for a in articulos if int(a['stock_sap']) > 0]

    context = {
        'active_page': 'control-de-stock',
        'active_tab': tab,
        'q': q,
        'almacen': almacen,
        'solo_con_stock': solo_con_stock,
        'desde': fecha_desde,
        'hasta': fecha_hasta,
        'busqueda_aplicada': q if buscado else '',
        'consultado_por_fecha': consultado_por_fecha,
        'falta_rango_fechas': tab == 'por-fecha' and buscado and not (fecha_desde and fecha_hasta),
        'movimientos': movimientos,
        'articulos': articulos,
        'columns_por_fecha': ['CÓDIGO', 'DESCRIPCIÓN', 'ALMACÉN', 'CANTIDAD ENTREGADA', 'FECHA'],
        'columns_existencia': ['CÓDIGO', 'DESCRIPCIÓN', 'CENTRO', 'ALMACÉN', 'STOCK SAP'],
        'presets': [
            {'key': 'hoy', 'label': 'Hoy'},
            {'key': 'semana', 'label': 'Última semana'},
            {'key': 'mes', 'label': 'Último mes'},
        ],
        'pages': PAGES,
    }
    return render(request, 'core/control_de_stock.html', context)


def permiso_de_retiro(request):
    tab = request.GET.get('tab', 'sin-permiso')
    q = request.GET.get('q', '') if 'buscar' in request.GET else ''

    materiales = MATERIALES_PERMISO
    centros = CENTROS_PERMISO
    if q:
        b = q.lower()
        materiales = [m for m in materiales if b in m['codigo'].lower() or b in m['descripcion'].lower()]
        centros = [c for c in centros if b in c['codigo'].lower() or b in c['nombre'].lower()]

    copy = {
        'sin-permiso': {
            'title': 'Materiales sin centro de costos',
            'description': 'Centros de costo sin materiales asignados. Asigná qué materiales pueden retirarse en cada uno.',
        },
        'con-permiso': {
            'title': 'Materiales con centro de costo asignado',
            'description': 'Centros con materiales habilitados. Editá qué puede retirarse en cada centro.',
        },
        'por-centro': {
            'title': 'Permisos por Centro de Costo',
            'description': 'Listado completo de centros de costo. Elegí un centro para editar los materiales que se pueden retirar.',
        },
    }[tab if tab in ('sin-permiso', 'con-permiso', 'por-centro') else 'sin-permiso']

    context = {
        'active_page': 'permiso-de-retiro',
        'active_tab': tab,
        'copy': copy,
        'q': request.GET.get('q', ''),
        'busqueda_aplicada': q,
        'materiales': materiales,
        'centros': centros,
        'pages': PAGES,
    }
    return render(request, 'core/permiso_de_retiro.html', context)


def firmas_digitales(request):
    busqueda = request.GET.get('q', '') if 'buscar' in request.GET else ''
    solicitudes = SOLICITUDES_FIRMA
    if busqueda:
        b = busqueda.lower()
        solicitudes = [
            s for s in solicitudes
            if b in s['vsm'].lower() or b in s['retirante'].lower()
            or b in s['solicitante'].lower() or b in s['cc'].lower()
        ]
    context = {
        'active_page': 'firmas-digitales',
        'solicitudes': solicitudes,
        'columns': ['ID', 'RETIRANTE', 'SOLICITANTE', 'CC', 'FECHA DE SOLICITUD', 'ESTADO'],
        'q': request.GET.get('q', ''),
        'busqueda_aplicada': busqueda,
        'pages': PAGES,
    }
    return render(request, 'core/firmas_digitales.html', context)


def firmar_solicitud(request, vsm):
    for s in SOLICITUDES_FIRMA:
        if s['vsm'] == vsm:
            s['firmado'] = True
            messages.success(request, f'Firma de {s["retirante"]} capturada correctamente')
    return HttpResponseRedirect(reverse('core:firmas-digitales'))
