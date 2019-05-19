from django.conf.urls import url

from . import views
from .views.discount import remove_voucher_view

checkout_urlpatterns = [
    url(r'^$', views.checkout_index, name='index'),
    url(r'^delivery-address/', views.checkout_delivery_address,
        name='delivery-address'),
    url(r'^delivery-method/', views.checkout_delivery_method,
        name='delivery-method'),
    url(r'^summary/', views.checkout_summary, name='summary'),
    url(r'^remove_voucher/', remove_voucher_view,
        name='remove-voucher'),
    url(r'^login/', views.checkout_login, name='login')]


cart_urlpatterns = [
    url(r'^$', views.cart_index, name='index'),
    url(r'^update/(?P<variant_id>\d+)/$',
        views.update_cart_line, name='update-line'),
    url(r'^clear-cart/$', views.clear_cart, name='clear-cart'),
    url(r'^summary/$', views.cart_summary, name='summary'),
    url(r'^delivery-options/$', views.cart_delivery_options,
        name='delivery-options')]
