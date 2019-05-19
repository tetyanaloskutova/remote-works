from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.delivery_zone_list, name='delivery-zone-list'),
    url(r'^add/$', views.delivery_zone_add, name='delivery-zone-add'),
    url(r'^(?P<pk>\d+)/update/$', views.delivery_zone_edit,
        name='delivery-zone-update'),
    url(r'^(?P<pk>\d+)/$', views.delivery_zone_details,
        name='delivery-zone-details'),
    url(r'^(?P<pk>\d+)/delete/$',
        views.delivery_zone_delete, name='delivery-zone-delete'),

    url(r'^(?P<delivery_zone_pk>\d+)/delivery/add/(?P<type>price|weight)/$',
        views.delivery_method_add, name='delivery-method-add'),
    url(r'^(?P<delivery_zone_pk>\d+)/delivery/(?P<delivery_method_pk>\d+)/update/$',  # noqa
        views.delivery_method_edit, name='delivery-method-edit'),
    url(r'^(?P<delivery_zone_pk>\d+)/delivery/(?P<delivery_method_pk>\d+)/delete/$',  # noqa
        views.delivery_method_delete, name='delivery-method-delete')]
