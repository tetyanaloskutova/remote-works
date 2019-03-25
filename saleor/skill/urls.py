from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^(?P<slug>[a-z0-9-_]+?)-(?P<skill_id>[0-9]+)/$',
        views.skill_details, name='details'),
    url(r'^category/(?P<slug>[a-z0-9-_]+?)-(?P<category_id>[0-9]+)/$',
        views.category_index, name='category'),
    url(r'(?P<slug>[a-z0-9-_]+?)-(?P<skill_id>[0-9]+)/add/$',
        views.skill_add_to_cart, name='add-to-cart'),
    url(r'^collection/(?P<slug>[a-z0-9-_/]+?)-(?P<pk>[0-9]+)/$',
        views.collection_index, name='collection')]
