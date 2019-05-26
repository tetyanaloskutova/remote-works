import json
from unittest.mock import MagicMock, Mock

from django.forms import HiddenInput
from django.forms.models import model_to_dict
from django.urls import reverse
from prices import Money, MoneyRange, TaxedMoney, TaxedMoneyRange

from remote_works.dashboard.skill import SkillBulkAction
from remote_works.dashboard.skill.forms import SkillForm, SkillVariantForm
from remote_works.skill.forms import VariantChoiceField
from remote_works.skill.models import (
    Attribute, AttributeValue, Collection, Skill, SkillImage, SkillType,
    SkillVariant)
from tests.utils import get_redirect_location

from ..utils import create_image


def test_view_skill_list_with_filters(admin_client, skill_list):
    url = reverse('dashboard:skill-list')
    data = {
        'price_max': [''], 'price_min': [''], 'is_featured': [''],
        'name': ['Test'], 'sort_by': [''], 'is_published': ['']}

    response = admin_client.get(url, data)

    assert response.status_code == 200
    assert list(response.context['filter_set'].qs) == skill_list


def test_view_skill_list_with_filters_sort_by(admin_client, skill_list):
    url = reverse('dashboard:skill-list')
    data = {
        'price_max': [''], 'price_min': [''], 'is_featured': [''],
        'name': ['Test'], 'sort_by': ['name'], 'is_published': ['']}

    response = admin_client.get(url, data)

    assert response.status_code == 200
    assert list(response.context['filter_set'].qs) == skill_list

    data['sort_by'] = ['-name']
    url = reverse('dashboard:skill-list')

    response = admin_client.get(url, data)

    assert response.status_code == 200
    assert list(response.context['filter_set'].qs) == skill_list[::-1]


def test_view_skill_list_with_filters_is_published(
        admin_client, skill_list, category):
    url = reverse('dashboard:skill-list')
    data = {
        'price_max': [''], 'price_min': [''], 'is_featured': [''],
        'name': ['Test'], 'sort_by': ['name'], 'category': category.pk,
        'is_published': ['1']}

    response = admin_client.get(url, data)

    assert response.status_code == 200
    result = list(response.context['filter_set'].qs)
    assert result == [skill_list[0], skill_list[2]]


def test_view_skill_list_with_filters_no_results(admin_client, skill_list):
    url = reverse('dashboard:skill-list')
    data = {
        'price_max': [''], 'price_min': [''], 'is_featured': [''],
        'name': ['BADTest'], 'sort_by': [''], 'is_published': ['']}

    response = admin_client.get(url, data)

    assert response.status_code == 200
    assert list(response.context['filter_set'].qs) == []


def test_view_skill_list_pagination(admin_client, skill_list, settings):
    settings.DASHBOARD_PAGINATE_BY = 1
    url = reverse('dashboard:skill-list')
    data = {'page': '1'}

    response = admin_client.get(url, data)

    assert response.status_code == 200
    assert not response.context['filter_set'].is_bound_unsorted

    data = {'page': '2'}

    response = admin_client.get(url, data)

    assert response.status_code == 200
    assert not response.context['filter_set'].is_bound_unsorted


def test_view_skill_list_pagination_with_filters(
        admin_client, skill_list, settings):
    settings.DASHBOARD_PAGINATE_BY = 1
    url = reverse('dashboard:skill-list')
    data = {
        'page': '1', 'price_max': [''], 'price_min': [''], 'is_featured': [''],
        'name': ['Test'], 'sort_by': ['name'], 'is_published': ['']}

    response = admin_client.get(url, data)

    assert response.status_code == 200
    assert list(response.context['skills'])[0] == skill_list[0]

    data['page'] = '2'

    response = admin_client.get(url, data)

    assert response.status_code == 200
    assert list(response.context['skills'])[0] == skill_list[1]


def test_view_skill_details(admin_client, skill):
    price = TaxedMoney(net=Money(10, 'USD'), gross=Money(10, 'USD'))
    sale_price = TaxedMoneyRange(start=price, stop=price)
    purchase_cost = MoneyRange(start=Money(1, 'USD'), stop=Money(1, 'USD'))
    url = reverse('dashboard:skill-details', kwargs={'pk': skill.pk})

    response = admin_client.get(url)

    assert response.status_code == 200
    context = response.context
    assert context['skill'] == skill
    assert context['sale_price'] == sale_price
    assert context['purchase_cost'] == purchase_cost
    assert context['margin'] == (90, 90)


def test_view_skill_toggle_publish(db, admin_client, skill):
    url = reverse('dashboard:skill-publish', kwargs={'pk': skill.pk})
    expected_response = {'success': True, 'is_published': False}

    response = admin_client.post(url)

    assert response.status_code == 200
    assert json.loads(response.content.decode('utf8')) == expected_response
    skill.refresh_from_db()
    assert not skill.is_published

    admin_client.post(url)

    skill.refresh_from_db()
    assert skill.is_published


def test_view_skill_select_type_display_modal(admin_client):
    url = reverse('dashboard:skill-add-select-type')
    response = admin_client.get(url)
    assert response.status_code == 200


def test_view_skill_select_type(admin_client, skill_type):
    url = reverse('dashboard:skill-add-select-type')
    data = {'skill_type': skill_type.pk}

    response = admin_client.post(url, data)

    assert get_redirect_location(response) == reverse(
        'dashboard:skill-add', kwargs={'type_pk': skill_type.pk})
    assert response.status_code == 302


def test_view_skill_select_type_by_ajax(admin_client, skill_type):
    url = reverse('dashboard:skill-add-select-type')
    data = {'skill_type': skill_type.pk}

    response = admin_client.post(
        url, data, HTTP_X_REQUESTED_WITH='XMLHttpRequest')

    assert response.status_code == 200
    resp_decoded = json.loads(response.content.decode('utf-8'))
    assert resp_decoded.get('redirectUrl') == reverse(
        'dashboard:skill-add', kwargs={'type_pk': skill_type.pk})


def test_view_skill_create(admin_client, skill_type, category):
    url = reverse('dashboard:skill-add', kwargs={'type_pk': skill_type.pk})
    data = {
        'name': 'Skill', 'description': 'This is skill description.',
        'price': 10, 'category': category.pk, 'variant-sku': '123',
        'variant-quantity': 2}

    response = admin_client.post(url, data)

    assert response.status_code == 302
    skill = Skill.objects.first()
    assert get_redirect_location(response) == reverse(
        'dashboard:skill-details', kwargs={'pk': skill.pk})
    assert Skill.objects.count() == 1


def test_view_skill_edit(admin_client, skill):
    url = reverse('dashboard:skill-update', kwargs={'pk': skill.pk})
    data = {
        'name': 'Skill second name', 'description': 'Skill description.',
        'price': 10, 'category': skill.category.pk, 'variant-sku': '123',
        'variant-quantity': 10}

    response = admin_client.post(url, data)

    assert response.status_code == 302
    skill.refresh_from_db()
    assert get_redirect_location(response) == reverse(
        'dashboard:skill-details', kwargs={'pk': skill.pk})
    assert skill.name == 'Skill second name'


def test_view_skill_delete(db, admin_client, skill):
    url = reverse('dashboard:skill-delete', kwargs={'pk': skill.pk})

    response = admin_client.post(url)

    assert response.status_code == 302
    assert not Skill.objects.filter(pk=skill.pk)


def test_view_skill_not_deleted_before_confirmation(
        db, admin_client, skill):
    url = reverse('dashboard:skill-delete', kwargs={'pk': skill.pk})

    response = admin_client.get(url)

    assert response.status_code == 200
    skill.refresh_from_db()


def test_view_skill_bulk_update_publish(admin_client, skill_list):
    url = reverse('dashboard:skill-bulk-update')
    skills = [skill.pk for skill in skill_list]
    data = {'action': SkillBulkAction.PUBLISH, 'skills': skills}

    response = admin_client.post(url, data)

    assert response.status_code == 302
    assert get_redirect_location(response) == reverse('dashboard:skill-list')

    for p in skill_list:
        p.refresh_from_db()
        assert p.is_published


def test_view_skill_bulk_update_unpublish(admin_client, skill_list):
    url = reverse('dashboard:skill-bulk-update')
    skills = [skill.pk for skill in skill_list]
    data = {'action': SkillBulkAction.UNPUBLISH, 'skills': skills}

    response = admin_client.post(url, data)


def test_view_ajax_skills_list(admin_client, skill):
    url = reverse('dashboard:ajax-skills')

    response = admin_client.get(url, HTTP_X_REQUESTED_WITH='XMLHttpRequest')

    assert response.status_code == 200
    resp_decoded = json.loads(response.content.decode('utf-8'))
    assert resp_decoded.get('results') == [
        {'id': skill.id, 'text': str(skill)}]


def test_view_skill_type_list(admin_client, skill_type):
    url = reverse('dashboard:skill-type-list')

    response = admin_client.get(url)

    assert response.status_code == 200
    assert len(response.context['skill_types']) == 1


def test_view_skill_type_list_with_filters(admin_client, skill_type):
    url = reverse('dashboard:skill-type-list')
    data = {'name': ['Default Ty'], 'sort_by': ['']}

    response = admin_client.get(url, data)

    assert response.status_code == 200
    assert skill_type in response.context['filter_set'].qs
    assert len(response.context['filter_set'].qs) == 1


def test_view_skill_type_create(
        admin_client, color_attribute, size_attribute):
    url = reverse('dashboard:skill-type-add')
    data = {
        'name': 'Testing Type',
        'skill_attributes': [color_attribute.pk],
        'variant_attributes': [size_attribute.pk],
        'has_variants': True,
        'weight': ['3.47']}

    response = admin_client.post(url, data)

    assert response.status_code == 302
    assert get_redirect_location(response) == reverse(
        'dashboard:skill-type-list')
    assert SkillType.objects.count() == 1


def test_view_skill_type_create_invalid(
        admin_client, color_attribute, size_attribute):
    url = reverse('dashboard:skill-type-add')
    # Don't allow same attribute in both fields
    data = {
        'name': 'Testing Type',
        'skill_attributes': [size_attribute.pk],
        'variant_attributes': [color_attribute.pk, size_attribute.pk],
        'has_variants': True,
        'weight': ['3.47']}

    response = admin_client.post(url, data)

    assert response.status_code == 200
    assert SkillType.objects.count() == 0


def test_view_skill_type_create_missing_variant_attributes(
        admin_client, color_attribute, size_attribute):
    url = reverse('dashboard:skill-type-add')
    data = {
        'name': 'Testing Type',
        'skill_attributes': [color_attribute.pk],
        'variant_attributes': [size_attribute.pk],
        'has_variants': False,
        'weight': ['3.47']}
    response = admin_client.post(url, data)

    assert response.status_code == 200
    assert SkillType.objects.count() == 0


def test_view_skill_type_create_variantless(
        admin_client, color_attribute, size_attribute):
    url = reverse('dashboard:skill-type-add')
    data = {
        'name': 'Testing Type',
        'skill_attributes': [color_attribute.pk],
        'variant_attributes': [],
        'has_variants': False,
        'weight': ['3.47']}
    response = admin_client.post(url, data)

    assert response.status_code == 302
    assert get_redirect_location(response) == reverse(
        'dashboard:skill-type-list')
    assert SkillType.objects.count() == 1


def test_view_skill_type_create_variantless_invalid(
        admin_client, color_attribute, size_attribute):
    url = reverse('dashboard:skill-type-add')
    # Don't allow variant attributes when no variants
    data = {
        'name': 'Testing Type',
        'skill_attributes': [color_attribute.pk],
        'variant_attributes': [size_attribute.pk],
        'has_variants': False,
        'weight': ['3.47']}
    response = admin_client.post(url, data)

    assert response.status_code == 200
    assert SkillType.objects.count() == 0


def test_view_skill_type_edit_to_no_variants_valid(admin_client, skill):
    skill_type = SkillType.objects.create(
        name='New skill type', has_variants=True)
    skill.skill_type = skill_type
    skill.save()

    url = reverse(
        'dashboard:skill-type-update', kwargs={'pk': skill_type.pk})
    # When all skills have only one variant you can change
    # has_variants to false
    data = {
        'name': skill_type.name,
        'skill_attributes': skill_type.skill_attributes.values_list(
            'pk', flat=True),
        'variant_attributes': skill_type.variant_attributes.values_list(
            'pk', flat=True),
        'has_variants': False,
        'weight': ['3.47']}

    response = admin_client.post(url, data)

    assert response.status_code == 302
    assert get_redirect_location(response) == url
    skill_type.refresh_from_db()
    assert not skill_type.has_variants
    assert skill.variants.count() == 1


def test_view_skill_type_edit_to_no_variants_invalid(admin_client, skill):
    skill_type = SkillType.objects.create(
        name='New skill type', has_variants=True)
    skill.skill_type = skill_type
    skill.save()

    skill.variants.create(sku='12345')

    url = reverse(
        'dashboard:skill-type-update', kwargs={'pk': skill_type.pk})
    # Test has_variants validator which prevents turning off when skill
    # has multiple variants
    data = {
        'name': skill_type.name,
        'skill_attributes': skill_type.skill_attributes.values_list(
            'pk', flat=True),
        'variant_attributes': skill_type.variant_attributes.values_list(
            'pk', flat=True),
        'has_variants': False,
        'weight': ['3.47']}

    response = admin_client.post(url, data)

    assert response.status_code == 200
    skill_type.refresh_from_db()
    assert skill_type.has_variants
    assert skill.variants.count() == 2


def test_view_skill_type_delete(db, admin_client, skill):
    skill_type = skill.skill_type
    url = reverse(
        'dashboard:skill-type-delete', kwargs={'pk': skill_type.pk})

    response = admin_client.post(url)

    assert response.status_code == 302
    assert not SkillType.objects.filter(pk=skill_type.pk)


def test_view_skill_type_not_deleted_before_confirmation(
        admin_client, skill):
    skill_type = skill.skill_type
    url = reverse(
        'dashboard:skill-type-delete', kwargs={'pk': skill_type.pk})

    response = admin_client.get(url)

    assert response.status_code == 200
    assert SkillType.objects.filter(pk=skill_type.pk)


def test_view_skill_variant_details(admin_client, skill):
    skill_type = skill.skill_type
    skill_type.has_variants = True
    skill_type.save()
    variant = skill.variants.get()
    url = reverse(
        'dashboard:variant-details',
        kwargs={'skill_pk': skill.pk, 'variant_pk': variant.pk})

    response = admin_client.get(url)

    assert response.status_code == 200
    context = response.context
    assert context['skill'] == skill
    assert context['variant'] == variant
    assert context['images'].count() == 0
    assert context['margin'] == 90
    assert context['discounted_price'] == variant.base_price


def test_view_skill_variant_details_redirect_to_skill(
        admin_client, skill_with_default_variant):
    skill = skill_with_default_variant
    variant = skill.variants.get()
    url = reverse(
        'dashboard:variant-details',
        kwargs={'skill_pk': skill.pk, 'variant_pk': variant.pk})

    response = admin_client.get(url)

    assert response.status_code == 302
    assert get_redirect_location(response) == reverse(
        'dashboard:skill-details', kwargs={'pk': skill.pk})


def test_view_skill_variant_create(admin_client, skill):
    skill_type = skill.skill_type
    skill_type.has_variants = True
    skill_type.save()
    url = reverse('dashboard:variant-add', kwargs={'skill_pk': skill.pk})
    data = {
        'sku': 'ABC', 'price_override': '', 'quantity': 10, 'cost_price': ''}

    response = admin_client.post(url, data)

    assert response.status_code == 302
    variant = skill.variants.last()
    assert get_redirect_location(response) == reverse(
        'dashboard:variant-details',
        kwargs={'skill_pk': skill.pk, 'variant_pk': variant.pk})
    assert skill.variants.count() == 2
    assert variant.sku == 'ABC'


def test_view_skill_variant_edit(admin_client, skill):
    variant = skill.variants.get()
    url = reverse(
        'dashboard:variant-update',
        kwargs={'skill_pk': skill.pk, 'variant_pk': variant.pk})
    data = {
        'sku': 'ABC', 'price_override': '', 'quantity': 10, 'cost_price': ''}

    response = admin_client.post(url, data)

    assert response.status_code == 302
    variant = skill.variants.last()
    assert get_redirect_location(response) == reverse(
        'dashboard:variant-details',
        kwargs={'skill_pk': skill.pk, 'variant_pk': variant.pk})
    assert variant.sku == 'ABC'


def test_view_skill_variant_delete(admin_client, skill):
    variant = skill.variants.get()
    url = reverse(
        'dashboard:variant-delete',
        kwargs={'skill_pk': skill.pk, 'variant_pk': variant.pk})

    response = admin_client.post(url)
    assert response.status_code == 302

    assert not SkillVariant.objects.filter(pk=variant.pk).exists()


def test_view_skill_variant_not_deleted_before_confirmation(
        admin_client, skill):
    variant = skill.variants.get()
    url = reverse(
        'dashboard:variant-delete',
        kwargs={'skill_pk': skill.pk, 'variant_pk': variant.pk})

    response = admin_client.get(url)

    assert response.status_code == 200
    assert SkillVariant.objects.filter(pk=variant.pk).exists()


def test_view_variant_images(admin_client, skill_with_image):
    variant = skill_with_image.variants.get()
    skill_image = skill_with_image.images.get()
    url = reverse(
        'dashboard:variant-images',
        kwargs={'skill_pk': skill_with_image.pk, 'variant_pk': variant.pk})
    data = {'images': [skill_image.pk]}

    response = admin_client.post(url, data)

    assert response.status_code == 302
    assert get_redirect_location(response) == reverse(
        'dashboard:variant-details',
        kwargs={'skill_pk': skill_with_image.pk, 'variant_pk': variant.pk})
    assert variant.variant_images.filter(image=skill_image).exists()


def test_view_ajax_available_variants_list(
        admin_client, skill, category, settings):
    unavailable_skill = Skill.objects.create(
        name='Test skill', price=Money(10, settings.DEFAULT_CURRENCY),
        skill_type=skill.skill_type,
        category=category, is_published=False)
    unavailable_skill.variants.create()
    url = reverse('dashboard:ajax-available-variants')

    response = admin_client.get(url, HTTP_X_REQUESTED_WITH='XMLHttpRequest')

    assert response.status_code == 200
    resp_decoded = json.loads(response.content.decode('utf-8'))
    variant = skill.variants.get()
    assert resp_decoded.get('results') == [
        {'id': variant.id, 'text': variant.get_ajax_label()}]


def test_view_skill_images(admin_client, skill_with_image):
    skill_image = skill_with_image.images.get()
    url = reverse(
        'dashboard:skill-image-list',
        kwargs={'skill_pk': skill_with_image.pk})

    response = admin_client.get(url)

    assert response.status_code == 200
    assert response.context['skill'] == skill_with_image
    assert not response.context['is_empty']
    images = response.context['images']
    assert len(images) == 1
    assert skill_image in images


def test_view_skill_image_create(
        monkeypatch, admin_client, skill_with_image):
    mock_create_thumbnails = Mock(return_value=None)
    monkeypatch.setattr(
        'remote_works.dashboard.skill.forms.create_skill_thumbnails.delay',
        mock_create_thumbnails)
    url = reverse(
        'dashboard:skill-image-add',
        kwargs={'skill_pk': skill_with_image.pk})

    response = admin_client.get(url)

    assert response.status_code == 200

    image, image_name = create_image()
    data = {'image_0': image, 'alt': ['description']}

    response = admin_client.post(url, data, follow=True)

    assert response.status_code == 200
    assert SkillImage.objects.count() == 2
    skill_with_image.refresh_from_db()
    images = skill_with_image.images.all()
    assert len(images) == 2
    assert image_name in images[1].image.name
    assert images[1].alt == 'description'
    mock_create_thumbnails.assert_called_once_with(images[1].pk)


def test_view_skill_image_edit_same_image_add_description(
        monkeypatch, admin_client, skill_with_image):
    mock_create_thumbnails = Mock(return_value=None)
    monkeypatch.setattr(
        'remote_works.dashboard.skill.forms.create_skill_thumbnails.delay',
        mock_create_thumbnails)
    skill_image = skill_with_image.images.all()[0]
    url = reverse(
        'dashboard:skill-image-update',
        kwargs={
            'img_pk': skill_image.pk,
            'skill_pk': skill_with_image.pk})
    data = {'image_1': ['0.49x0.59'], 'alt': ['description']}

    response = admin_client.get(url)

    assert response.status_code == 200

    response = admin_client.post(url, data, follow=True)

    assert response.status_code == 200
    assert skill_with_image.images.count() == 1
    skill_image.refresh_from_db()
    assert skill_image.alt == 'description'
    mock_create_thumbnails.assert_called_once_with(skill_image.pk)


def test_view_skill_image_edit_new_image(
        monkeypatch, admin_client, skill_with_image):
    mock_create_thumbnails = Mock(return_value=None)
    monkeypatch.setattr(
        'remote_works.dashboard.skill.forms.create_skill_thumbnails.delay',
        mock_create_thumbnails)
    skill_image = skill_with_image.images.all()[0]
    url = reverse(
        'dashboard:skill-image-update',
        kwargs={
            'img_pk': skill_image.pk,
            'skill_pk': skill_with_image.pk})

    response = admin_client.get(url)

    assert response.status_code == 200

    image, image_name = create_image()
    data = {'image_0': image, 'alt': ['description']}

    response = admin_client.post(url, data, follow=True)

    assert response.status_code == 200
    assert skill_with_image.images.count() == 1
    skill_image.refresh_from_db()
    assert image_name in skill_image.image.name
    assert skill_image.alt == 'description'
    mock_create_thumbnails.assert_called_once_with(skill_image.pk)


def test_view_skill_image_delete(admin_client, skill_with_image):
    skill_image = skill_with_image.images.all()[0]
    url = reverse(
        'dashboard:skill-image-delete',
        kwargs={
            'img_pk': skill_image.pk,
            'skill_pk': skill_with_image.pk})

    response = admin_client.post(url)

    assert response.status_code == 302
    assert not SkillImage.objects.filter(pk=skill_image.pk)


def test_view_skill_image_not_deleted_before_confirmation(
        admin_client, skill_with_image):
    skill_image = skill_with_image.images.all()[0]
    url = reverse(
        'dashboard:skill-image-delete',
        kwargs={
            'img_pk': skill_image.pk,
            'skill_pk': skill_with_image.pk})

    response = admin_client.get(url)

    assert response.status_code == 200
    assert SkillImage.objects.filter(pk=skill_image.pk).count()


def test_view_ajax_retask_skill_images(admin_client, skill_with_images):
    task_before = [img.pk for img in skill_with_images.images.all()]
    ordered_images = list(reversed(task_before))
    url = reverse(
        'dashboard:skill-images-reorder',
        kwargs={'skill_pk': skill_with_images.pk})
    data = {'ordered_images': ordered_images}

    response = admin_client.post(
        url, data, HTTP_X_REQUESTED_WITH='XMLHttpRequest')

    assert response.status_code == 200
    task_after = [img.pk for img in skill_with_images.images.all()]
    assert task_after == ordered_images


def test_view_ajax_retask_skill_images_invalid(
        admin_client, skill_with_images):
    task_before = [img.pk for img in skill_with_images.images.all()]
    ordered_images = list(reversed(task_before)).append(3)
    url = reverse(
        'dashboard:skill-images-reorder',
        kwargs={'skill_pk': skill_with_images.pk})
    data = {'ordered_images': ordered_images}

    response = admin_client.post(
        url, data, HTTP_X_REQUESTED_WITH='XMLHttpRequest')

    assert response.status_code == 400
    resp_decoded = json.loads(response.content.decode('utf-8'))
    assert 'error' in resp_decoded
    assert 'ordered_images' in resp_decoded['error']


def test_view_ajax_upload_image(monkeypatch, admin_client, skill_with_image):
    mock_create_thumbnails = Mock(return_value=None)
    monkeypatch.setattr(
        'remote_works.dashboard.skill.forms.create_skill_thumbnails.delay',
        mock_create_thumbnails)
    skill = skill_with_image
    url = reverse(
        'dashboard:skill-images-upload', kwargs={'skill_pk': skill.pk})
    image, image_name = create_image()
    data = {'image_0': image, 'alt': ['description']}

    response = admin_client.post(
        url, data, HTTP_X_REQUESTED_WITH='XMLHttpRequest')

    assert response.status_code == 200
    assert SkillImage.objects.count() == 2
    skill_with_image.refresh_from_db()
    images = skill_with_image.images.all()
    assert len(images) == 2
    assert image_name in images[1].image.name
    mock_create_thumbnails.assert_called_once_with(images[1].pk)


def test_view_attribute_list_no_results(admin_client):
    url = reverse('dashboard:attributes')
    response = admin_client.get(url)
    assert response.status_code == 200
    assert response.context['attributes'].object_list == []


def test_view_attribute_list(db, admin_client, color_attribute):
    url = reverse('dashboard:attributes')

    response = admin_client.get(url)

    assert response.status_code == 200
    result = response.context['attributes'].object_list
    assert len(result) == 1
    assert result[0][0] == color_attribute.pk
    assert result[0][1] == color_attribute.name
    assert len(result[0][3]) == 2
    assert not response.context['is_empty']


def test_view_attribute_details(admin_client, color_attribute):
    url = reverse(
        'dashboard:attribute-details',
        kwargs={'pk': color_attribute.pk})

    response = admin_client.get(url)

    assert response.status_code == 200
    assert response.context['attribute'] == color_attribute


def test_view_attribute_details_no_choices(admin_client):
    attribute = Attribute.objects.create(slug='size', name='Size')
    url = reverse(
        'dashboard:attribute-details', kwargs={'pk': attribute.pk})

    response = admin_client.get(url)

    assert response.status_code == 200
    assert response.context['attribute'] == attribute


def test_view_attribute_create(admin_client, color_attribute):
    url = reverse('dashboard:attribute-add')
    data = {'name': 'test', 'slug': 'test'}

    response = admin_client.post(url, data, follow=True)

    assert response.status_code == 200
    assert Attribute.objects.count() == 2


def test_view_attribute_create_not_valid(admin_client, color_attribute):
    url = reverse('dashboard:attribute-add')
    data = {}

    response = admin_client.post(url, data, follow=True)

    assert response.status_code == 200
    assert Attribute.objects.count() == 1


def test_view_attribute_edit(color_attribute, admin_client):
    url = reverse(
        'dashboard:attribute-update',
        kwargs={'pk': color_attribute.pk})
    data = {'name': 'new_name', 'slug': 'new_slug'}

    response = admin_client.post(url, data, follow=True)

    assert response.status_code == 200
    assert Attribute.objects.count() == 1
    color_attribute.refresh_from_db()
    assert color_attribute.name == 'new_name'
    assert color_attribute.slug == 'new_slug'


def test_view_attribute_delete(admin_client, color_attribute):
    url = reverse(
        'dashboard:attribute-delete',
        kwargs={'pk': color_attribute.pk})

    response = admin_client.post(url)

    assert response.status_code == 302
    assert not Attribute.objects.filter(pk=color_attribute.pk).exists()


def test_view_attribute_not_deleted_before_confirmation(
        admin_client, color_attribute):
    url = reverse(
        'dashboard:attribute-delete',
        kwargs={'pk': color_attribute.pk})

    response = admin_client.get(url)

    assert response.status_code == 200
    assert Attribute.objects.filter(pk=color_attribute.pk)


def test_view_attribute_value_create(color_attribute, admin_client):
    values = AttributeValue.objects.filter(attribute=color_attribute.pk)
    assert values.count() == 2
    url = reverse(
        'dashboard:attribute-value-add',
        kwargs={'attribute_pk': color_attribute.pk})
    data = {'name': 'Pink', 'attribute': color_attribute.pk}

    response = admin_client.post(url, data, follow=True)

    assert response.status_code == 200
    values = AttributeValue.objects.filter(attribute=color_attribute.pk)
    assert values.count() == 3


def test_view_attribute_value_create_invalid(
        color_attribute, admin_client):
    values = AttributeValue.objects.filter(attribute=color_attribute.pk)
    assert values.count() == 2
    url = reverse(
        'dashboard:attribute-value-add',
        kwargs={'attribute_pk': color_attribute.pk})
    data = {}

    response = admin_client.post(url, data, follow=True)

    assert response.status_code == 200
    values = AttributeValue.objects.filter(attribute=color_attribute.pk)
    assert values.count() == 2


def test_view_attribute_value_edit(color_attribute, admin_client):
    values = AttributeValue.objects.filter(attribute=color_attribute.pk)
    assert values.count() == 2
    url = reverse(
        'dashboard:attribute-value-update',
        kwargs={'attribute_pk': color_attribute.pk, 'value_pk': values[0].pk})
    data = {'name': 'Pink', 'attribute': color_attribute.pk}

    response = admin_client.post(url, data, follow=True)

    assert response.status_code == 200
    values = AttributeValue.objects.filter(
        attribute=color_attribute.pk, name='Pink')
    assert len(values) == 1
    assert values[0].name == 'Pink'


def test_view_attribute_value_delete(color_attribute, admin_client):
    values = AttributeValue.objects.filter(attribute=color_attribute.pk)
    assert values.count() == 2
    deleted_value = values[0]
    url = reverse(
        'dashboard:attribute-value-delete',
        kwargs={
            'attribute_pk': color_attribute.pk, 'value_pk': deleted_value.pk})

    response = admin_client.post(url, follow=True)

    assert response.status_code == 200
    values = AttributeValue.objects.filter(attribute=color_attribute.pk)
    assert len(values) == 1
    assert deleted_value not in values


def test_view_ajax_retask_attribute_values(
        admin_client, color_attribute):
    task_before = [val.pk for val in color_attribute.values.all()]
    ordered_values = list(reversed(task_before))
    url = reverse(
        'dashboard:attribute-values-reorder',
        kwargs={'attribute_pk': color_attribute.pk})
    data = {'ordered_values': ordered_values}
    response = admin_client.post(
        url, data, HTTP_X_REQUESTED_WITH='XMLHttpRequest')
    task_after = [val.pk for val in color_attribute.values.all()]
    assert response.status_code == 200
    assert task_after == ordered_values


def test_view_ajax_retask_attribute_values_invalid(
        admin_client, color_attribute):
    task_before = [val.pk for val in color_attribute.values.all()]
    ordered_values = list(reversed(task_before)).append(3)
    url = reverse(
        'dashboard:attribute-values-reorder',
        kwargs={'attribute_pk': color_attribute.pk})
    data = {'ordered_values': ordered_values}
    response = admin_client.post(
        url, data, HTTP_X_REQUESTED_WITH='XMLHttpRequest')
    assert response.status_code == 400
    resp_decoded = json.loads(response.content.decode('utf-8'))
    assert 'error' in resp_decoded
    assert 'ordered_values' in resp_decoded['error']


def test_get_formfield_name_with_unicode_characters(db):
    text_attribute = Attribute.objects.create(
        slug='ąęαβδηθλμπ', name='ąęαβδηθλμπ')
    assert text_attribute.get_formfield_name() == 'attribute-ąęαβδηθλμπ-{}'.format(
        text_attribute.pk)


def test_skill_variant_form(skill, size_attribute):
    variant = skill.variants.first()
    variant.name = ''
    variant.save()

    example_size = 'Small Size'
    data = {
        'attribute-{}-{}'.format(
            size_attribute.slug, size_attribute.pk): example_size,
        'sku': '1111', 'quantity': 2}

    form = SkillVariantForm(data, instance=variant)
    assert form.is_valid()

    form.save()
    variant.refresh_from_db()
    assert variant.name == example_size


def test_hide_field_in_variant_choice_field_form():
    form = VariantChoiceField(Mock())
    variants, cart = MagicMock(), MagicMock()
    variants.count.return_value = variants.all().count.return_value = 1
    variants.all()[0].pk = 'test'

    form.update_field_data(variants, discounts=None, taxes=None)

    assert isinstance(form.widget, HiddenInput)
    assert form.widget.attrs.get('value') == 'test'


def test_skill_form_change_attributes(db, skill, color_attribute):
    skill_type = skill.skill_type
    text_attribute = Attribute.objects.create(
        slug='author', name='Author')
    skill_type.skill_attributes.add(text_attribute)
    color_value = color_attribute.values.first()
    new_author = 'Main Tester'
    data = {
        'name': skill.name,
        'price': skill.price.amount,
        'category': skill.category.pk,
        'description': 'description',
        'attribute-{}-{}'.format(
            text_attribute.slug, text_attribute.pk): new_author,
        'attribute-{}-{}'.format(
            color_attribute.slug, color_attribute.pk): color_value.pk}

    form = SkillForm(data, instance=skill)
    assert form.is_valid()

    skill = form.save()
    assert skill.attributes[str(color_attribute.pk)] == str(color_value.pk)

    # Check that new attribute was created for author
    author_value = AttributeValue.objects.get(name=new_author)
    assert skill.attributes[str(text_attribute.pk)] == str(author_value.pk)


def test_skill_form_assign_collection_to_skill(skill):
    collection = Collection.objects.create(name='test_collections')
    data = {
        'name': skill.name,
        'price': skill.price.amount,
        'category': skill.category.pk,
        'description': 'description',
        'collections': [collection.pk]}

    form = SkillForm(data, instance=skill)
    assert form.is_valid()

    form.save()
    assert skill.collections.first().name == 'test_collections'
    assert collection.skills.first().name == skill.name


def test_skill_form_sanitize_skill_description(
        skill_type, category, settings):
    skill = Skill.objects.create(
        name='Test Skill', price=Money(10, settings.DEFAULT_CURRENCY),
        description='', pk=10, skill_type=skill_type, category=category)
    data = model_to_dict(skill)
    data['description'] = (
        '<b>bold</b><p><i>italic</i></p><h2>Header</h2><h3>subheader</h3>'
        '<blockquote>quote</blockquote>'
        '<p><a href="www.mirumee.com">link</a></p>'
        '<p>an <script>evil()</script>example</p>')
    data['price'] = 20

    form = SkillForm(data, instance=skill)
    assert form.is_valid()

    form.save()
    assert skill.description == (
        '<b>bold</b><p><i>italic</i></p><h2>Header</h2><h3>subheader</h3>'
        '<blockquote>quote</blockquote>'
        '<p><a href="www.mirumee.com">link</a></p>'
        '<p>an &lt;script&gt;evil()&lt;/script&gt;example</p>')
    assert skill.seo_description == (
        'bolditalicHeadersubheaderquotelinkan evil()example')


def test_skill_form_seo_description(unavailable_skill):
    seo_description = (
        'This is a dummy skill. '
        'HTML <b>shouldn\'t be removed</b> since it\'s a simple text field.')
    data = model_to_dict(unavailable_skill)
    data['price'] = 20
    data['description'] = 'a description'
    data['seo_description'] = seo_description

    form = SkillForm(data, instance=unavailable_skill)
    assert form.is_valid()

    form.save()
    assert unavailable_skill.seo_description == seo_description


def test_skill_form_seo_description_too_long(unavailable_skill):
    description = (
        'Saying it fourth made saw light bring beginning kind over herb '
        'won\'t creepeth multiply dry rule divided fish herb cattle greater '
        'fly divided midst, gathering can\'t moveth seed greater subdue. '
        'Lesser meat living fowl called. Dry don\'t wherein. Doesn\'t above '
        'form sixth. Image moving earth without forth light whales. Seas '
        'were first form fruit that form they\'re, shall air. And. Good of'
        'signs darkness be place. Was. Is form it. Whose. Herb signs stars '
        'fill own fruit wherein. '
        'Don\'t set man face living fifth Thing the whales were. '
        'You fish kind. '
        'Them, his under wherein place first you night gathering.')

    data = model_to_dict(unavailable_skill)
    data['price'] = 20
    data['description'] = description

    form = SkillForm(data, instance=unavailable_skill)
    assert form.is_valid()

    form.save()
    new_seo_description = unavailable_skill.seo_description
    assert len(new_seo_description) <= 300
    assert new_seo_description.startswith(
        'Saying it fourth made saw light bring beginning kind over herb '
        'won\'t creepeth multiply dry rule divided fish herb cattle greater '
        'fly divided midst, gathering can\'t moveth seed greater subdue. '
        'Lesser meat living fowl called. Dry don\'t wherein. Doesn\'t above '
        'form sixth. Image moving earth without')
    assert (
        new_seo_description.endswith('...') or new_seo_description[-1] == '…')
