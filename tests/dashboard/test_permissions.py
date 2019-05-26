from django.urls import reverse

from remote_works.account.models import User


def test_staff_can_access_skill_details(
        staff_client, staff_user, permission_manage_products, product):
    assert not staff_user.has_perm('skill.manage_products')
    url = reverse('dashboard:skill-details', kwargs={'pk': product.pk})

    response = staff_client.get(url)
    assert response.status_code == 302

    staff_user.user_permissions.add(permission_manage_products)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('skill.manage_products')

    response = staff_client.post(url)
    assert response.status_code == 200


def test_staff_can_access_skill_toggle_is_published(
        staff_client, staff_user, permission_manage_products, product):
    assert not staff_user.has_perm('skill.manage_products')
    url = reverse('dashboard:skill-publish', kwargs={'pk': product.pk})

    response = staff_client.post(url)
    assert response.status_code == 302

    staff_user.user_permissions.add(permission_manage_products)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('skill.manage_products')

    response = staff_client.post(url)
    assert response.status_code == 200


def test_staff_can_access_skill_select_type(
        staff_client, staff_user, permission_manage_products):
    assert not staff_user.has_perm('skill.manage_products')
    url = reverse('dashboard:skill-add-select-type')

    response = staff_client.get(url)
    assert response.status_code == 302

    staff_user.user_permissions.add(permission_manage_products)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('skill.manage_products')

    response = staff_client.post(url)
    assert response.status_code == 200


def test_staff_can_access_skill_create(
        staff_client, staff_user, permission_manage_products, skill_type):
    assert not staff_user.has_perm('skill.manage_products')
    url = reverse('dashboard:skill-add', kwargs={'type_pk': skill_type.pk})

    response = staff_client.get(url)
    assert response.status_code == 302

    staff_user.user_permissions.add(permission_manage_products)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('skill.manage_products')

    response = staff_client.post(url)
    assert response.status_code == 200


def test_staff_can_access_skill_edit(
        staff_client, staff_user, permission_manage_products, product):
    assert not staff_user.has_perm('skill.manage_products')
    url = reverse('dashboard:skill-update', kwargs={'pk': product.pk})

    response = staff_client.get(url)
    assert response.status_code == 302

    staff_user.user_permissions.add(permission_manage_products)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('skill.manage_products')

    response = staff_client.post(url)
    assert response.status_code == 200


def test_staff_can_access_skill_delete(
        staff_client, staff_user, permission_manage_products, product):
    assert not staff_user.has_perm('skill.manage_products')
    url = reverse('dashboard:skill-delete', kwargs={'pk': product.pk})

    response = staff_client.get(url)
    assert response.status_code == 302

    staff_user.user_permissions.add(permission_manage_products)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('skill.manage_products')

    response = staff_client.get(url)
    assert response.status_code == 200


def test_staff_can_view_skill_list(
        staff_client, staff_user, permission_manage_products):
    assert not staff_user.has_perm('skill.manage_products')
    response = staff_client.get(reverse('dashboard:skill-list'))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_products)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('skill.manage_products')
    response = staff_client.get(reverse('dashboard:skill-list'))
    assert response.status_code == 200


def test_staff_can_view_category_list(
        staff_client, staff_user, permission_manage_products):
    assert not staff_user.has_perm('skill.manage_products')
    response = staff_client.get(reverse('dashboard:category-list'))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_products)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('skill.manage_products')
    response = staff_client.get(reverse('dashboard:category-list'))
    assert response.status_code == 200


def test_staff_can_view_category_add_root(
        staff_client, staff_user, permission_manage_products):
    assert not staff_user.has_perm('skill.manage_products')
    response = staff_client.get(reverse('dashboard:category-add'))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_products)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('skill.manage_products')
    response = staff_client.get(reverse('dashboard:category-add'))
    assert response.status_code == 200


def test_staff_can_view_category_add_subcategory(
        staff_client, staff_user, permission_manage_products, category):
    assert not staff_user.has_perm('skill.manage_products')
    response = staff_client.get(
        reverse('dashboard:category-add', args=[category.pk]))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_products)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('skill.manage_products')
    response = staff_client.get(
        reverse('dashboard:category-add', args=[category.pk]))
    assert response.status_code == 200


def test_staff_can_view_category_edit(
        staff_client, staff_user, permission_manage_products, category):
    assert not staff_user.has_perm('skill.manage_products')
    response = staff_client.get(
        reverse('dashboard:category-edit', args=[category.pk]))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_products)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('skill.manage_products')
    response = staff_client.get(
        reverse('dashboard:category-edit', args=[category.pk]))
    assert response.status_code == 200


def test_staff_can_view_category_delete(
        staff_client, staff_user, permission_manage_products, category):
    assert not staff_user.has_perm('skill.manage_products')
    response = staff_client.get(
        reverse('dashboard:category-delete', args=[category.pk]))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_products)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('skill.manage_products')
    response = staff_client.get(
        reverse('dashboard:category-delete', args=[category.pk]))
    assert response.status_code == 200


def test_staff_can_view_sale_list(
        staff_client, staff_user, permission_manage_discounts):
    assert not staff_user.has_perm('discount.manage_discounts')
    response = staff_client.get(reverse('dashboard:sale-list'))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_discounts)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('discount.manage_discounts')
    response = staff_client.get(reverse('dashboard:sale-list'))
    assert response.status_code == 200


def test_staff_can_view_sale_update(
        staff_client, staff_user, permission_manage_discounts, sale):
    assert not staff_user.has_perm('discount.manage_discounts')
    response = staff_client.get(
        reverse('dashboard:sale-update', args=[sale.pk]))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_discounts)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('discount.manage_discounts')
    response = staff_client.get(
        reverse('dashboard:sale-update', args=[sale.pk]))
    assert response.status_code == 200


def test_staff_can_view_sale_add(
        staff_client, staff_user, permission_manage_discounts, sale):
    assert not staff_user.has_perm('discount.manage_discounts')
    response = staff_client.get(reverse('dashboard:sale-add'))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_discounts)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('discount.manage_discounts')
    response = staff_client.get(reverse('dashboard:sale-add'))
    assert response.status_code == 200


def test_staff_can_view_sale_delete(
        staff_client, staff_user, permission_manage_discounts, sale):
    assert not staff_user.has_perm('discount.manage_discounts')
    response = staff_client.get(
        reverse('dashboard:sale-delete', args=[sale.pk]))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_discounts)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('discount.manage_discounts')
    response = staff_client.get(
        reverse('dashboard:sale-delete', args=[sale.pk]))
    assert response.status_code == 200


def test_staff_can_view_voucher_list(
        staff_client, staff_user, permission_manage_discounts):
    assert not staff_user.has_perm('discount.manage_discounts')
    response = staff_client.get(reverse('dashboard:voucher-list'))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_discounts)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('discount.manage_discounts')
    response = staff_client.get(reverse('dashboard:voucher-list'))
    assert response.status_code == 200


def test_staff_can_view_voucher_update(
        staff_client, staff_user, permission_manage_discounts, voucher):
    assert not staff_user.has_perm('discount.manage_discounts')
    response = staff_client.get(
        reverse('dashboard:voucher-update', args=[voucher.pk]))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_discounts)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('discount.manage_discounts')
    response = staff_client.get(
        reverse('dashboard:voucher-update', args=[voucher.pk]))
    assert response.status_code == 200


def test_staff_can_view_voucher_add(
        staff_client, staff_user, permission_manage_discounts):
    assert not staff_user.has_perm('discount.manage_discounts')
    response = staff_client.get(reverse('dashboard:voucher-add'))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_discounts)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('discount.manage_discounts')
    response = staff_client.get(reverse('dashboard:voucher-add'))
    assert response.status_code == 200


def test_staff_can_view_voucher_delete(
        staff_client, staff_user, permission_manage_discounts, voucher):
    assert not staff_user.has_perm('discount.manage_discounts')
    response = staff_client.get(
        reverse('dashboard:voucher-delete', args=[voucher.pk]))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_discounts)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('discount.manage_discounts')
    response = staff_client.get(
        reverse('dashboard:voucher-delete', args=[voucher.pk]))
    assert response.status_code == 200


def test_staff_can_view_task_list(
        staff_client, staff_user, permission_manage_orders):
    assert not staff_user.has_perm('task.manage_orders')
    response = staff_client.get(reverse('dashboard:tasks'))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_orders)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('task.manage_orders')
    response = staff_client.get(reverse('dashboard:tasks'))
    assert response.status_code == 200


def test_staff_can_view_task_details(
        staff_client, staff_user, permission_manage_orders, task_with_lines):
    assert not staff_user.has_perm('task.manage_orders')
    response = staff_client.get(
        reverse('dashboard:task-details', args=[task_with_lines.pk]))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_orders)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('task.manage_orders')
    response = staff_client.get(
        reverse('dashboard:task-details', args=[task_with_lines.pk]))
    assert response.status_code == 200


def test_staff_can_view_task_add_note(
        staff_client, staff_user, permission_manage_orders, task):
    assert not staff_user.has_perm('task.manage_orders')
    response = staff_client.get(
        reverse('dashboard:task-add-note', args=[task.pk]))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_orders)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('task.manage_orders')
    response = staff_client.get(
        reverse('dashboard:task-add-note', args=[task.pk]))
    assert response.status_code == 200


def test_staff_can_view_cancel_order(
        staff_client, staff_user, permission_manage_orders, task):
    assert not staff_user.has_perm('task.manage_orders')
    response = staff_client.get(
        reverse('dashboard:task-cancel', args=[task.pk]))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_orders)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('task.manage_orders')
    response = staff_client.get(
        reverse('dashboard:task-cancel', args=[task.pk]))
    assert response.status_code == 200


def test_staff_can_view_billing_address_edit(
        staff_client, staff_user, permission_manage_orders, task):
    assert not staff_user.has_perm('task.manage_orders')
    response = staff_client.get(
        reverse('dashboard:address-edit', args=[task.pk, 'billing']))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_orders)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('task.manage_orders')
    response = staff_client.get(
        reverse('dashboard:address-edit', args=[task.pk, 'billing']))
    assert response.status_code == 200


def test_staff_can_view_customers_list(
        staff_client, staff_user, permission_manage_users):
    assert not staff_user.has_perm('account.manage_users')
    response = staff_client.get(reverse('dashboard:customers'))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_users)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('account.manage_users')
    response = staff_client.get(reverse('dashboard:customers'))
    assert response.status_code == 200


def test_staff_can_view_customer_details(
        staff_client, staff_user, permission_manage_users, customer_user,
        task_with_lines):
    assert not staff_user.has_perm('account.manage_users')
    response = staff_client.get(
        reverse('dashboard:customer-details', args=[customer_user.pk]))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_users)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('account.manage_users')
    response = staff_client.get(
        reverse('dashboard:customer-details', args=[customer_user.pk]))
    assert response.status_code == 200
    response = staff_client.get(
        reverse('dashboard:task-details', args=[task_with_lines.pk]))
    assert response.status_code == 302


def test_staff_can_view_staff_members_list(
        staff_client, staff_user, permission_manage_staff):
    assert not staff_user.has_perm('account.manage_staff')
    response = staff_client.get(reverse('dashboard:staff-list'))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_staff)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('account.manage_staff')
    response = staff_client.get(reverse('dashboard:staff-list'))
    assert response.status_code == 200


def test_staff_can_view_detail_create_and_delete_staff_members(
        staff_client, staff_user, permission_manage_staff):
    assert not staff_user.has_perm('account.manage_staff')
    response = staff_client.get(reverse('dashboard:staff-create'))
    assert response.status_code == 302
    response = staff_client.get(
        reverse('dashboard:staff-delete', args=[staff_user.pk]))
    assert response.status_code == 302
    response = staff_client.get(
        reverse('dashboard:staff-details', args=[staff_user.pk]))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_staff)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('account.manage_staff')
    response = staff_client.get(reverse('dashboard:staff-create'))
    assert response.status_code == 200
    response = staff_client.get(
        reverse('dashboard:staff-delete', args=[staff_user.pk]))
    assert response.status_code == 200
    response = staff_client.get(
        reverse('dashboard:staff-details', args=[staff_user.pk]))
    assert response.status_code == 200


def test_staff_with_permissions_can_view_skill_types_list(
        staff_client, staff_user, permission_manage_products):
    assert not staff_user.has_perm('skill.manage_products')
    response = staff_client.get(reverse('dashboard:skill-type-list'))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_products)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('skill.manage_products')
    response = staff_client.get(reverse('dashboard:skill-type-list'))
    assert response.status_code == 200


def test_staff_with_permissions_can_edit_add_and_delete_skill_types_list(
        staff_client, staff_user, permission_manage_products, skill_type):
    assert not staff_user.has_perm('skill.manage_products')
    response = staff_client.get(
        reverse('dashboard:skill-type-update', args=[skill_type.pk]))
    assert response.status_code == 302
    response = staff_client.get(
        reverse('dashboard:skill-type-delete', args=[skill_type.pk]))
    assert response.status_code == 302
    response = staff_client.get(reverse('dashboard:skill-type-add'))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_products)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('skill.manage_products')
    response = staff_client.get(
        reverse('dashboard:skill-type-update', args=[skill_type.pk]))
    assert response.status_code == 200
    response = staff_client.get(
        reverse('dashboard:skill-type-delete', args=[skill_type.pk]))
    assert response.status_code == 200
    response = staff_client.get(reverse('dashboard:skill-type-add'))
    assert response.status_code == 200


def test_staff_can_access_variant_details(
        staff_client, staff_user, permission_manage_products, product):
    skill_type = product.skill_type
    skill_type.has_variants = True
    skill_type.save()

    variant = product.variants.get()
    assert not staff_user.has_perm('skill.manage_products')
    url = reverse(
        'dashboard:variant-details',
        kwargs={
            'skill_pk': product.pk,
            'variant_pk': variant.pk})

    response = staff_client.get(url)
    assert response.status_code == 302

    staff_user.user_permissions.add(permission_manage_products)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('skill.manage_products')

    response = staff_client.get(url)
    assert response.status_code == 200


def test_staff_can_access_variant_create(
        staff_client, staff_user, permission_manage_products, product):
    assert not staff_user.has_perm('skill.manage_products')
    url = reverse('dashboard:variant-add', kwargs={'skill_pk': product.pk})

    response = staff_client.get(url)
    assert response.status_code == 302

    staff_user.user_permissions.add(permission_manage_products)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('skill.manage_products')

    response = staff_client.get(url)
    assert response.status_code == 200


def test_staff_can_access_variant_edit(
        staff_client, staff_user, permission_manage_products, product):
    variant = product.variants.get()
    assert not staff_user.has_perm('skill.manage_products')
    url = reverse(
        'dashboard:variant-update',
        kwargs={
            'skill_pk': product.pk,
            'variant_pk': variant.pk})

    response = staff_client.get(url)
    assert response.status_code == 302

    staff_user.user_permissions.add(permission_manage_products)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('skill.manage_products')

    response = staff_client.get(url)
    assert response.status_code == 200


def test_staff_can_access_variant_delete(
        staff_client, staff_user, permission_manage_products, product):
    variant = product.variants.get()
    assert not staff_user.has_perm('skill.manage_products')
    url = reverse(
        'dashboard:variant-delete',
        kwargs={
            'skill_pk': product.pk,
            'variant_pk': variant.pk})

    response = staff_client.get(url)
    assert response.status_code == 302

    staff_user.user_permissions.add(permission_manage_products)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('skill.manage_products')

    response = staff_client.get(url)
    assert response.status_code == 200


def test_staff_can_access_variant_images(
        staff_client, staff_user, permission_manage_products, product):
    variant = product.variants.get()
    assert not staff_user.has_perm('skill.manage_products')
    url = reverse(
        'dashboard:variant-images',
        kwargs={
            'skill_pk': product.pk,
            'variant_pk': variant.pk})

    response = staff_client.get(url)
    assert response.status_code == 302

    staff_user.user_permissions.add(permission_manage_products)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('skill.manage_products')

    response = staff_client.get(url)
    assert response.status_code == 200


def test_staff_can_access_skill_image_list(
        staff_client, staff_user, permission_manage_products, product):
    assert not staff_user.has_perm('skill.manage_products')
    url = reverse(
        'dashboard:skill-image-list', kwargs={'skill_pk': product.pk})

    response = staff_client.get(url)
    assert response.status_code == 302

    staff_user.user_permissions.add(permission_manage_products)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('skill.manage_products')

    response = staff_client.get(url)
    assert response.status_code == 200


def test_staff_can_access_skill_image_add(
        staff_client, staff_user, permission_manage_products, skill):
    assert not staff_user.has_perm('skill.manage_products')
    url = reverse(
        'dashboard:skill-image-add', kwargs={'skill_pk': skill.pk})

    response = staff_client.get(url)
    assert response.status_code == 302

    staff_user.user_permissions.add(permission_manage_products)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('skill.manage_products')

    response = staff_client.get(url)
    assert response.status_code == 200


def test_staff_can_access_skill_image_update(
        staff_client, staff_user, permission_manage_products, skill_with_image):
    skill_image = skill_with_image.images.get()
    assert not staff_user.has_perm('skill.manage_products')
    url = reverse(
        'dashboard:skill-image-update',
        kwargs={
            'skill_pk': skill_with_image.pk,
            'img_pk': skill_image.pk})

    response = staff_client.get(url)
    assert response.status_code == 302

    staff_user.user_permissions.add(permission_manage_products)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('skill.manage_products')

    response = staff_client.get(url)
    assert response.status_code == 200


def test_staff_can_access_skill_image_delete(
        staff_client, staff_user, permission_manage_products, skill_with_image):
    skill_image = skill_with_image.images.get()
    assert not staff_user.has_perm('skill.manage_products')
    url = reverse(
        'dashboard:skill-image-delete',
        kwargs={
            'skill_pk': skill_with_image.pk,
            'img_pk': skill_image.pk})

    response = staff_client.get(url)
    assert response.status_code == 302

    staff_user.user_permissions.add(permission_manage_products)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('skill.manage_products')

    response = staff_client.get(url)
    assert response.status_code == 200


def test_staff_with_permissions_can_view_products_attributes_list(
        staff_client, staff_user, permission_manage_products, color_attribute):
    assert not staff_user.has_perm('skill.manage_products')
    response = staff_client.get(reverse('dashboard:attributes'))
    assert response.status_code == 302
    response = staff_client.get(
        reverse(
            'dashboard:attribute-details', args=[color_attribute.pk]))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_products)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('skill.manage_products')
    response = staff_client.get(reverse('dashboard:attributes'))
    assert response.status_code == 200
    response = staff_client.get(
        reverse(
            'dashboard:attribute-details', args=[color_attribute.pk]))
    assert response.status_code == 200


def test_staff_with_permissions_can_update_add_and_delete_products_attributes(
        staff_client, staff_user, permission_manage_products, color_attribute):
    assert not staff_user.has_perm('skill.manage_products')
    response = staff_client.get(
        reverse(
            'dashboard:attribute-update', args=[color_attribute.pk]))
    assert response.status_code == 302
    response = staff_client.get(
        reverse(
            'dashboard:attribute-delete', args=[color_attribute.pk]))
    assert response.status_code == 302
    response = staff_client.get(reverse('dashboard:attribute-add'))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_products)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('skill.manage_products')
    response = staff_client.get(
        reverse(
            'dashboard:attribute-update', args=[color_attribute.pk]))
    assert response.status_code == 200
    response = staff_client.get(
        reverse(
            'dashboard:attribute-delete', args=[color_attribute.pk]))
    assert response.status_code == 200
    response = staff_client.get(reverse('dashboard:attribute-add'))
    assert response.status_code == 200


def test_staff_can_access_attribute_create(
        staff_client, staff_user, permission_manage_products, color_attribute):
    assert not staff_user.has_perm('skill.manage_products')
    url = reverse(
        'dashboard:attribute-value-add',
        kwargs={'attribute_pk': color_attribute.pk})

    response = staff_client.get(url)
    assert response.status_code == 302

    staff_user.user_permissions.add(permission_manage_products)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('skill.manage_products')

    response = staff_client.get(url)
    assert response.status_code == 200


def test_staff_can_access_attribute_edit(
        staff_client, staff_user, permission_manage_products, color_attribute):
    value = color_attribute.values.first()
    assert not staff_user.has_perm('skill.manage_products')
    url = reverse(
        'dashboard:attribute-value-update',
        kwargs={
            'attribute_pk': color_attribute.pk,
            'value_pk': value.pk})

    response = staff_client.get(url)
    assert response.status_code == 302

    staff_user.user_permissions.add(permission_manage_products)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('skill.manage_products')

    response = staff_client.get(url)
    assert response.status_code == 200


def test_staff_can_access_attribute_delete(
        staff_client, staff_user, permission_manage_products, color_attribute):
    value = color_attribute.values.first()
    assert not staff_user.has_perm('skill.manage_products')
    url = reverse(
        'dashboard:attribute-value-delete',
        kwargs={
            'attribute_pk': color_attribute.pk,
            'value_pk': value.pk})

    response = staff_client.get(url)
    assert response.status_code == 302

    staff_user.user_permissions.add(permission_manage_products)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('skill.manage_products')

    response = staff_client.get(url)
    assert response.status_code == 200


def test_staff_with_permissions_can_view_delivery_methods_and_details(
        staff_client, staff_user, permission_manage_delivery, delivery_zone):
    assert not staff_user.has_perm('delivery.manage_delivery')
    response = staff_client.get(reverse('dashboard:delivery-zone-list'))
    assert response.status_code == 302
    response = staff_client.get(
        reverse(
            'dashboard:delivery-zone-details', args=[delivery_zone.pk]))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_delivery)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('delivery.manage_delivery')
    response = staff_client.get(reverse('dashboard:delivery-zone-list'))
    assert response.status_code == 200
    response = staff_client.get(
        reverse(
            'dashboard:delivery-zone-details', args=[delivery_zone.pk]))
    assert response.status_code == 200


def test_staff_with_permissions_can_update_add_and_delete_delivery_zone(
        staff_client, staff_user, permission_manage_delivery, delivery_zone):
    assert not staff_user.has_perm('delivery.manage_delivery')
    response = staff_client.get(
        reverse('dashboard:delivery-zone-update', args=[delivery_zone.pk]))
    assert response.status_code == 302
    response = staff_client.get(
        reverse('dashboard:delivery-zone-delete', args=[delivery_zone.pk]))
    assert response.status_code == 302
    response = staff_client.get(reverse('dashboard:delivery-zone-add'))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_delivery)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('delivery.manage_delivery')
    response = staff_client.get(
        reverse('dashboard:delivery-zone-update', args=[delivery_zone.pk]))
    assert response.status_code == 200
    response = staff_client.get(
        reverse('dashboard:delivery-zone-delete', args=[delivery_zone.pk]))
    assert response.status_code == 200
    response = staff_client.get(reverse('dashboard:delivery-zone-add'))
    assert response.status_code == 200


def test_staff_with_permissions_can_edit_customer(
        staff_client, customer_user, staff_user, permission_manage_users):
    assert customer_user.email == 'test@example.com'
    response = staff_client.get(
        reverse('dashboard:customer-update', args=[customer_user.pk]))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_users)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('account.manage_users')
    response = staff_client.get(
        reverse('dashboard:customer-update', args=[customer_user.pk]))
    assert response.status_code == 200
    url = reverse('dashboard:customer-update', args=[customer_user.pk])
    data = {'email': 'newemail@example.com', 'is_active': True}
    staff_client.post(url, data)
    customer_user = User.objects.get(pk=customer_user.pk)
    assert customer_user.email == 'newemail@example.com'
    assert customer_user.is_active


def test_staff_with_permissions_can_add_customer(
        staff_client, staff_user, permission_manage_users):
    response = staff_client.get(reverse('dashboard:customer-create'))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_users)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('account.manage_users')
    response = staff_client.get(reverse('dashboard:customer-create'))
    assert response.status_code == 200
    url = reverse('dashboard:customer-create')
    data = {'email': 'newcustomer@example.com', 'is_active': True}
    staff_client.post(url, data)
    customer = User.objects.get(email='newcustomer@example.com')
    assert customer.is_active


def test_staff_can_view_and_edit_site_settings(
        staff_client, staff_user, site_settings, permission_manage_settings):
    assert not staff_user.has_perm('site.manage_settings')
    response = staff_client.get(
        reverse('dashboard:site-update', args=[site_settings.pk]))
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_settings)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('site.manage_settings')
    response = staff_client.get(
        reverse('dashboard:site-update', args=[site_settings.pk]))
    assert response.status_code == 200


def test_staff_can_view_and_edit_taxes_settings(
        staff_client, staff_user, site_settings, permission_manage_settings):
    assert not staff_user.has_perm('site.manage_settings')
    url = reverse('dashboard:configure-taxes')
    response = staff_client.get(url)
    assert response.status_code == 302
    staff_user.user_permissions.add(permission_manage_settings)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('site.manage_settings')
    response = staff_client.get(url)


def test_staff_can_view_menus_and_details(
        staff_client, staff_user, permission_manage_menus, menu_item):
    menu_list_url = reverse('dashboard:menu-list')
    menu_details_url = reverse(
        'dashboard:menu-details', args=[menu_item.menu.pk])
    menu_item_details_url = reverse(
        'dashboard:menu-item-details', args=[menu_item.menu.pk, menu_item.pk])

    assert not staff_user.has_perm('menu.manage_menus')
    response = staff_client.get(menu_list_url)
    assert response.status_code == 302
    response = staff_client.get(menu_details_url)
    assert response.status_code == 302
    response = staff_client.get(menu_item_details_url)
    assert response.status_code == 302

    staff_user.user_permissions.add(permission_manage_menus)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('menu.manage_menus')

    response = staff_client.get(menu_list_url)
    assert response.status_code == 200
    response = staff_client.get(menu_details_url)
    assert response.status_code == 200
    response = staff_client.get(menu_item_details_url)
    assert response.status_code == 200


def test_staff_can_manage_menuss(
        staff_client, staff_user, permission_manage_menus, menu_item):
    menu_add_url = reverse('dashboard:menu-add')
    menu_edit_url = reverse('dashboard:menu-edit', args=[menu_item.menu.pk])
    menu_delete_url = reverse(
        'dashboard:menu-delete', args=[menu_item.menu.pk])

    assert not staff_user.has_perm('menu.manage_menus')
    response = staff_client.get(menu_add_url)
    assert response.status_code == 302
    response = staff_client.get(menu_edit_url)
    assert response.status_code == 302
    response = staff_client.get(menu_delete_url)
    assert response.status_code == 302

    staff_user.user_permissions.add(permission_manage_menus)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('menu.manage_menus')

    response = staff_client.get(menu_add_url)
    assert response.status_code == 200
    response = staff_client.get(menu_edit_url)
    assert response.status_code == 200
    response = staff_client.get(menu_delete_url)
    assert response.status_code == 200


def test_staff_can_manage_menus_items(
        staff_client, staff_user, permission_manage_menus, menu_item):
    menu_item_add_url = reverse(
        'dashboard:menu-item-add', args=[menu_item.menu.pk, menu_item.pk])
    menu_item_edit_url = reverse(
        'dashboard:menu-item-edit', args=[menu_item.menu.pk, menu_item.pk])
    menu_item_delete_url = reverse(
        'dashboard:menu-item-delete', args=[menu_item.menu.pk, menu_item.pk])

    assert not staff_user.has_perm('menu.manage_menus')
    response = staff_client.get(menu_item_add_url)
    assert response.status_code == 302
    response = staff_client.get(menu_item_edit_url)
    assert response.status_code == 302
    response = staff_client.get(menu_item_delete_url)
    assert response.status_code == 302

    staff_user.user_permissions.add(permission_manage_menus)
    staff_user = User.objects.get(pk=staff_user.pk)
    assert staff_user.has_perm('menu.manage_menus')

    response = staff_client.get(menu_item_add_url)
    assert response.status_code == 200
    response = staff_client.get(menu_item_edit_url)
    assert response.status_code == 200
    response = staff_client.get(menu_item_delete_url)
    assert response.status_code == 200


def test_staff_can_remove_user(staff_client, staff_user, permission_manage_users):
    url = reverse('dashboard:customer-delete', args=[staff_user.pk])

    response = staff_client.get(url)
    assert response.status_code == 302

    staff_user.user_permissions.add(permission_manage_users)
    staff_user = User.objects.get(pk=staff_user.pk)

    response = staff_client.get(url)
    assert response.status_code == 200
