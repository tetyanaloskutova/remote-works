from textwrap import dedent

import graphene
from django.db import transaction
from django.template.defaultfilters import slugify
from graphene.types import InputObjectType
from graphql_jwt.decorators import permission_required

from ....skill import models
from ....skill.tasks import update_variants_names
from ....skill.thumbnails import (
    create_category_background_image_thumbnails,
    create_collection_background_image_thumbnails, create_skill_thumbnails)
from ....skill.utils.attributes import get_name_from_attributes
from ...core.enums import TaxRateType
from ...core.mutations import BaseMutation, ModelDeleteMutation, ModelMutation
from ...core.scalars import Decimal, WeightScalar
from ...core.types import SeoInput, Upload
from ...core.utils import clean_seo_fields
from ..types import Category, Collection, Skill, SkillImage, SkillVariant
from ..utils import attributes_to_hstore, validate_image_file


class CategoryInput(graphene.InputObjectType):
    description = graphene.String(
        description='Category description (HTML/text).')
    description_json = graphene.JSONString(
        description='Category description (JSON).')
    name = graphene.String(description='Category name.')
    slug = graphene.String(description='Category slug.')
    seo = SeoInput(description='Search engine optimization fields.')
    background_image = Upload(description='Background image file.')
    background_image_alt = graphene.String(
        description='Alt text for an image.')


class CategoryCreate(ModelMutation):
    class Arguments:
        input = CategoryInput(
            required=True, description='Fields required to create a category.')
        parent_id = graphene.ID(
            description=dedent('''
                ID of the parent category. If empty, category will be top level
                category.'''), name='parent')

    class Meta:
        description = 'Creates a new category.'
        model = models.Category

    @classmethod
    def clean_input(cls, info, instance, input, errors):
        cleaned_input = super().clean_input(info, instance, input, errors)
        if 'slug' not in cleaned_input and 'name' in cleaned_input:
            cleaned_input['slug'] = slugify(cleaned_input['name'])
        parent_id = input['parent_id']
        if parent_id:
            parent = cls.get_node_or_error(
                info, parent_id, errors, field='parent', only_type=Category)
            cleaned_input['parent'] = parent
        if input.get('background_image'):
            image_data = info.context.FILES.get(input['background_image'])
            validate_image_file(cls, image_data, 'background_image', errors)
        clean_seo_fields(cleaned_input)
        return cleaned_input

    @classmethod
    def user_is_allowed(cls, user, input):
        return user.has_perm('skill.manage_skills')

    @classmethod
    def mutate(cls, root, info, **data):
        parent_id = data.pop('parent_id', None)
        data['input']['parent_id'] = parent_id
        return super().mutate(root, info, **data)

    @classmethod
    def save(cls, info, instance, cleaned_input):
        instance.save()
        if cleaned_input.get('background_image'):
            create_category_background_image_thumbnails.delay(instance.pk)


class CategoryUpdate(CategoryCreate):
    class Arguments:
        id = graphene.ID(
            required=True, description='ID of a category to update.')
        input = CategoryInput(
            required=True, description='Fields required to update a category.')

    class Meta:
        description = 'Updates a category.'
        model = models.Category

    @classmethod
    def save(cls, info, instance, cleaned_input):
        if cleaned_input.get('background_image'):
            create_category_background_image_thumbnails.delay(instance.pk)
        instance.save()


class CategoryDelete(ModelDeleteMutation):
    class Arguments:
        id = graphene.ID(
            required=True, description='ID of a category to delete.')

    class Meta:
        description = 'Deletes a category.'
        model = models.Category

    @classmethod
    def user_is_allowed(cls, user, input):
        return user.has_perm('skill.manage_skills')


class CollectionInput(graphene.InputObjectType):
    is_published = graphene.Boolean(
        description='Informs whether a collection is published.')
    name = graphene.String(description='Name of the collection.')
    slug = graphene.String(description='Slug of the collection.')
    description = graphene.String(
        description='Description of the collection (HTML/text).')
    description_json = graphene.JSONString(
        description='Description of the collection (JSON).')
    background_image = Upload(description='Background image file.')
    background_image_alt = graphene.String(
        description='Alt text for an image.')
    seo = SeoInput(description='Search engine optimization fields.')
    publication_date = graphene.Date(
        description='Publication date. ISO 8601 standard.')


class CollectionCreateInput(CollectionInput):
    skills = graphene.List(
        graphene.ID,
        description='List of skills to be added to the collection.',
        name='skills')


class CollectionCreate(ModelMutation):
    class Arguments:
        input = CollectionCreateInput(
            required=True,
            description='Fields required to create a collection.')

    class Meta:
        description = 'Creates a new collection.'
        model = models.Collection

    @classmethod
    def user_is_allowed(cls, user, input):
        return user.has_perm('skill.manage_skills')

    @classmethod
    def clean_input(cls, info, instance, input, errors):
        cleaned_input = super().clean_input(info, instance, input, errors)
        if 'slug' not in cleaned_input and 'name' in cleaned_input:
            cleaned_input['slug'] = slugify(cleaned_input['name'])
        if input.get('background_image'):
            image_data = info.context.FILES.get(input['background_image'])
            validate_image_file(cls, image_data, 'background_image', errors)
        clean_seo_fields(cleaned_input)
        return cleaned_input

    @classmethod
    def save(cls, info, instance, cleaned_input):
        instance.save()
        if cleaned_input.get('background_image'):
            create_collection_background_image_thumbnails.delay(instance.pk)


class CollectionUpdate(CollectionCreate):
    class Arguments:
        id = graphene.ID(
            required=True, description='ID of a collection to update.')
        input = CollectionInput(
            required=True,
            description='Fields required to update a collection.')

    class Meta:
        description = 'Updates a collection.'
        model = models.Collection

    @classmethod
    def save(cls, info, instance, cleaned_input):
        if cleaned_input.get('background_image'):
            create_collection_background_image_thumbnails.delay(instance.pk)
        instance.save()


class CollectionDelete(ModelDeleteMutation):
    class Arguments:
        id = graphene.ID(
            required=True, description='ID of a collection to delete.')

    class Meta:
        description = 'Deletes a collection.'
        model = models.Collection

    @classmethod
    def user_is_allowed(cls, user, input):
        return user.has_perm('skill.manage_skills')


class CollectionAddSkills(BaseMutation):
    collection = graphene.Field(
        Collection,
        description='Collection to which skills will be added.')

    class Arguments:
        collection_id = graphene.Argument(
            graphene.ID, required=True,
            description='ID of a collection.')
        skills = graphene.List(
            graphene.ID, required=True,
            description='List of skill IDs.')

    class Meta:
        description = 'Adds skills to a collection.'

    @classmethod
    @permission_required('skill.manage_skills')
    def mutate(cls, root, info, collection_id, skills):
        errors = []
        collection = cls.get_node_or_error(
            info, collection_id, errors, 'collectionId', only_type=Collection)
        skills = cls.get_nodes_or_error(
            skills, errors, 'skills', only_type=Skill)
        collection.skills.add(*skills)
        return CollectionAddSkills(collection=collection, errors=errors)


class CollectionRemoveSkills(BaseMutation):
    collection = graphene.Field(
        Collection,
        description='Collection from which skills will be removed.')

    class Arguments:
        collection_id = graphene.Argument(
            graphene.ID, required=True, description='ID of a collection.')
        skills = graphene.List(
            graphene.ID, required=True, description='List of skill IDs.')

    class Meta:
        description = 'Remove skills from a collection.'

    @classmethod
    @permission_required('skill.manage_skills')
    def mutate(cls, root, info, collection_id, skills):
        errors = []
        collection = cls.get_node_or_error(
            info, collection_id, errors, 'collectionId', only_type=Collection)
        skills = cls.get_nodes_or_error(
            skills, errors, 'skills', only_type=Skill)
        collection.skills.remove(*skills)
        return CollectionRemoveSkills(collection=collection, errors=errors)


class AttributeValueInput(InputObjectType):
    slug = graphene.String(
        required=True, description='Slug of an attribute.')
    value = graphene.String(
        required=True, description='Value of an attribute.')


class SkillInput(graphene.InputObjectType):
    attributes = graphene.List(
        AttributeValueInput,
        description='List of attributes.')
    publication_date = graphene.types.datetime.Date(
        description='Publication date. ISO 8601 standard.')
    category = graphene.ID(
        description='ID of the skill\'s category.', name='category')
    charge_taxes = graphene.Boolean(
        description='Determine if taxes are being charged for the skill.')
    collections = graphene.List(
        graphene.ID,
        description='List of IDs of collections that the skill belongs to.',
        name='collections')
    description = graphene.String(
        description='Skill description (HTML/text).')
    description_json = graphene.JSONString(
        description='Skill description (JSON).')
    is_published = graphene.Boolean(
        description='Determines if skill is visible to customers.')
    name = graphene.String(description='Skill name.')
    price = Decimal(description='Skill price.')
    tax_rate = TaxRateType(description='Tax rate.')
    seo = SeoInput(description='Search engine optimization fields.')
    weight = WeightScalar(
        description='Weight of the Skill.', required=False)
    sku = graphene.String(
        description=dedent("""Stock keeping unit of a skill. Note: this
        field is only used if a skill doesn't use variants."""))
    quantity = graphene.Int(
        description=dedent("""The total quantity of a skill available for
        sale. Note: this field is only used if a skill doesn't
        use variants."""))
    track_inventory = graphene.Boolean(
        description=dedent("""Determines if the inventory of this skill
        should be tracked. If false, the quantity won't change when customers
        buy this item. Note: this field is only used if a skill doesn't
        use variants."""))


class SkillCreateInput(SkillInput):
    skill_type = graphene.ID(
        description='ID of the type that skill belongs to.',
        name='skillType', required=True)


class SkillCreate(ModelMutation):
    class Arguments:
        input = SkillCreateInput(
            required=True, description='Fields required to create a skill.')

    class Meta:
        description = 'Creates a new skill.'
        model = models.Skill

    @classmethod
    def clean_input(cls, info, instance, input, errors):
        cleaned_input = super().clean_input(info, instance, input, errors)
        # Attributes are provided as list of `AttributeValueInput` objects.
        # We need to transform them into the format they're stored in the
        # `Skill` model, which is HStore field that maps attribute's PK to
        # the value's PK.

        attributes = cleaned_input.pop('attributes', [])
        skill_type = (
            instance.skill_type
            if instance.pk else cleaned_input.get('skill_type'))

        if attributes and skill_type:
            qs = skill_type.skill_attributes.prefetch_related('values')
            try:
                attributes = attributes_to_hstore(attributes, qs)
            except ValueError as e:
                cls.add_error(errors, 'attributes', str(e))
            else:
                cleaned_input['attributes'] = attributes
        clean_seo_fields(cleaned_input)
        cls.clean_sku(skill_type, cleaned_input, errors)
        return cleaned_input

    @classmethod
    def clean_sku(cls, skill_type, cleaned_input, errors):
        """Validate SKU input field.

        When creating skills that don't use variants, SKU is required in
        the input in order to create the default variant underneath.
        See the documentation for `has_variants` field for details:
        http://docs.getsaleor.com/en/latest/architecture/skills.html#skill-types
        """
        if not skill_type.has_variants:
            input_sku = cleaned_input.get('sku')
            if not input_sku:
                cls.add_error(errors, 'sku', 'This field cannot be blank.')
            elif models.SkillVariant.objects.filter(sku=input_sku).exists():
                cls.add_error(
                    errors, 'sku', 'Skill with this SKU already exists.')

    @classmethod
    @transaction.atomic
    def save(cls, info, instance, cleaned_input):
        instance.save()
        if not instance.skill_type.has_variants:
            site_settings = info.context.site.settings
            track_inventory = cleaned_input.get(
                'track_inventory', site_settings.track_inventory_by_default)
            quantity = cleaned_input.get('quantity', 0)
            sku = cleaned_input.get('sku')
            models.SkillVariant.objects.create(
                skill=instance, track_inventory=track_inventory,
                sku=sku, quantity=quantity)

    @classmethod
    def _save_m2m(cls, info, instance, cleaned_data):
        collections = cleaned_data.get('collections', None)
        if collections is not None:
            instance.collections.set(collections)

    @classmethod
    def user_is_allowed(cls, user, input):
        return user.has_perm('skill.manage_skills')


class SkillUpdate(SkillCreate):
    class Arguments:
        id = graphene.ID(
            required=True, description='ID of a skill to update.')
        input = SkillInput(
            required=True, description='Fields required to update a skill.')

    class Meta:
        description = 'Updates an existing skill.'
        model = models.Skill

    @classmethod
    def clean_sku(cls, skill_type, cleaned_input, errors):
        input_sku = cleaned_input.get('sku')
        if (not skill_type.has_variants and
                input_sku and
                models.SkillVariant.objects.filter(sku=input_sku).exists()):
            cls.add_error(
                errors, 'sku', 'Skill with this SKU already exists.')

    @classmethod
    @transaction.atomic
    def save(cls, info, instance, cleaned_input):
        instance.save()
        if not instance.skill_type.has_variants:
            variant = instance.variants.first()
            update_fields = []
            if 'track_inventory' in cleaned_input:
                variant.track_inventory = cleaned_input['track_inventory']
                update_fields.append('track_inventory')
            if 'quantity' in cleaned_input:
                variant.quantity = cleaned_input['quantity']
                update_fields.append('quantity')
            if 'sku' in cleaned_input:
                variant.sku = cleaned_input['sku']
                update_fields.append('sku')
            if update_fields:
                variant.save(update_fields=update_fields)


class SkillDelete(ModelDeleteMutation):
    class Arguments:
        id = graphene.ID(
            required=True, description='ID of a skill to delete.')

    class Meta:
        description = 'Deletes a skill.'
        model = models.Skill

    @classmethod
    def user_is_allowed(cls, user, input):
        return user.has_perm('skill.manage_skills')


class SkillVariantInput(graphene.InputObjectType):
    attributes = graphene.List(
        AttributeValueInput, required=False,
        description='List of attributes specific to this variant.')
    cost_price = Decimal(description='Cost price of the variant.')
    price_override = Decimal(
        description='Special price of the particular variant.')
    sku = graphene.String(description='Stock keeping unit.')
    quantity = graphene.Int(
        description='The total quantity of this variant available for sale.')
    track_inventory = graphene.Boolean(
        description=dedent("""Determines if the inventory of this variant should
        be tracked. If false, the quantity won't change when customers
        buy this item."""))
    weight = WeightScalar(
        description='Weight of the Skill Variant.', required=False)


class SkillVariantCreateInput(SkillVariantInput):
    attributes = graphene.List(
        AttributeValueInput, required=True,
        description='List of attributes specific to this variant.')
    skill = graphene.ID(
        description='Skill ID of which type is the variant.',
        name='skill', required=True)


class SkillVariantCreate(ModelMutation):
    class Arguments:
        input = SkillVariantCreateInput(
            required=True,
            description='Fields required to create a skill variant.')

    class Meta:
        description = 'Creates a new variant for a skill'
        model = models.SkillVariant

    @classmethod
    def clean_skill_type_attributes(
            cls, attributes_qs, attributes_input, errors):
        # transform attributes_input list to a dict of slug:value pairs
        attributes_input = {
            item['slug']: item['value'] for item in attributes_input}

        for attr in attributes_qs:
            value = attributes_input.get(attr.slug, None)
            if not value:
                fieldname = 'attributes:%s' % attr.slug
                cls.add_error(errors, fieldname, 'This field cannot be blank.')

    @classmethod
    def clean_input(cls, info, instance, input, errors):
        cleaned_input = super().clean_input(info, instance, input, errors)

        # Attributes are provided as list of `AttributeValueInput` objects.
        # We need to transform them into the format they're stored in the
        # `Skill` model, which is HStore field that maps attribute's PK to
        # the value's PK.

        if 'attributes' in input:
            attributes_input = cleaned_input.pop('attributes')
            skill = instance.skill if instance.pk else cleaned_input.get(
                'skill')
            skill_type = skill.skill_type
            variant_attrs = skill_type.variant_attributes.prefetch_related(
                'values')
            try:
                cls.clean_skill_type_attributes(
                    variant_attrs, attributes_input, errors)
                attributes = attributes_to_hstore(
                    attributes_input, variant_attrs)
            except ValueError as e:
                cls.add_error(errors, 'attributes', str(e))
            else:
                cleaned_input['attributes'] = attributes
        return cleaned_input

    @classmethod
    def save(cls, info, instance, cleaned_input):
        attributes = instance.skill.skill_type.variant_attributes.all()
        instance.name = get_name_from_attributes(instance, attributes)
        instance.save()

    @classmethod
    def user_is_allowed(cls, user, input):
        return user.has_perm('skill.manage_skills')


class SkillVariantUpdate(SkillVariantCreate):
    class Arguments:
        id = graphene.ID(
            required=True, description='ID of a skill variant to update.')
        input = SkillVariantInput(
            required=True,
            description='Fields required to update a skill variant.')

    class Meta:
        description = 'Updates an existing variant for skill'
        model = models.SkillVariant


class SkillVariantDelete(ModelDeleteMutation):
    class Arguments:
        id = graphene.ID(
            required=True, description='ID of a skill variant to delete.')

    class Meta:
        description = 'Deletes a skill variant.'
        model = models.SkillVariant

    @classmethod
    def user_is_allowed(cls, user, input):
        return user.has_perm('skill.manage_skills')


class SkillTypeInput(graphene.InputObjectType):
    name = graphene.String(description='Name of the skill type.')
    has_variants = graphene.Boolean(
        description=dedent("""Determines if skill of this type has multiple
        variants. This option mainly simplifies skill management
        in the dashboard. There is always at least one variant created under
        the hood."""))
    skill_attributes = graphene.List(
        graphene.ID,
        description='List of attributes shared among all skill variants.',
        name='skillAttributes')
    variant_attributes = graphene.List(
        graphene.ID,
        description=dedent("""List of attributes used to distinguish between
        different variants of a skill."""),
        name='variantAttributes')
    is_shipping_required = graphene.Boolean(
        description=dedent("""Determines if shipping is required for skills
        of this variant."""))
    weight = WeightScalar(description='Weight of the SkillType items.')
    tax_rate = TaxRateType(description='A type of goods.')


class SkillTypeCreate(ModelMutation):
    class Arguments:
        input = SkillTypeInput(
            required=True,
            description='Fields required to create a skill type.')

    class Meta:
        description = 'Creates a new skill type.'
        model = models.SkillType

    @classmethod
    def user_is_allowed(cls, user, input):
        return user.has_perm('skill.manage_skills')

    @classmethod
    def _save_m2m(cls, info, instance, cleaned_data):
        super()._save_m2m(info, instance, cleaned_data)
        if 'skill_attributes' in cleaned_data:
            instance.skill_attributes.set(cleaned_data['skill_attributes'])
        if 'variant_attributes' in cleaned_data:
            instance.variant_attributes.set(cleaned_data['variant_attributes'])


class SkillTypeUpdate(SkillTypeCreate):
    class Arguments:
        id = graphene.ID(
            required=True, description='ID of a skill type to update.')
        input = SkillTypeInput(
            required=True,
            description='Fields required to update a skill type.')

    class Meta:
        description = 'Updates an existing skill type.'
        model = models.SkillType

    @classmethod
    def save(cls, info, instance, cleaned_input):
        variant_attr = cleaned_input.get('variant_attributes')
        if variant_attr:
            variant_attr = set(variant_attr)
            variant_attr_ids = [attr.pk for attr in variant_attr]
            update_variants_names.delay(instance.pk, variant_attr_ids)
        super().save(info, instance, cleaned_input)


class SkillTypeDelete(ModelDeleteMutation):
    class Arguments:
        id = graphene.ID(
            required=True, description='ID of a skill type to delete.')

    class Meta:
        description = 'Deletes a skill type.'
        model = models.SkillType

    @classmethod
    def user_is_allowed(cls, user, input):
        return user.has_perm('skill.manage_skills')


class SkillImageCreateInput(graphene.InputObjectType):
    alt = graphene.String(description='Alt text for an image.')
    image = Upload(
        required=True,
        description='Represents an image file in a multipart request.')
    skill = graphene.ID(
        required=True, description='ID of an skill.', name='skill')


class SkillImageCreate(BaseMutation):
    skill = graphene.Field(Skill)
    image = graphene.Field(SkillImage)

    class Arguments:
        input = SkillImageCreateInput(
            required=True,
            description='Fields required to create a skill image.')

    class Meta:
        description = dedent('''Create a skill image. This mutation must be
        sent as a `multipart` request. More detailed specs of the upload format
        can be found here:
        https://github.com/jaydenseric/graphql-multipart-request-spec''')

    @classmethod
    @permission_required('skill.manage_skills')
    def mutate(cls, root, info, input):
        errors = []
        skill = cls.get_node_or_error(
            info, input['skill'], errors, 'skill', only_type=Skill)
        image_data = info.context.FILES.get(input['image'])
        validate_image_file(cls, image_data, 'image', errors)
        image = None
        if not errors:
            image = skill.images.create(
                image=image_data, alt=input.get('alt', ''))
            create_skill_thumbnails.delay(image.pk)
        return SkillImageCreate(skill=skill, image=image, errors=errors)


class SkillImageUpdateInput(graphene.InputObjectType):
    alt = graphene.String(description='Alt text for an image.')


class SkillImageUpdate(BaseMutation):
    skill = graphene.Field(Skill)
    image = graphene.Field(SkillImage)

    class Arguments:
        id = graphene.ID(
            required=True, description='ID of a skill image to update.')
        input = SkillImageUpdateInput(
            required=True,
            description='Fields required to update a skill image.')

    class Meta:
        description = 'Updates a skill image.'

    @classmethod
    @permission_required('skill.manage_skills')
    def mutate(cls, root, info, id, input):
        errors = []
        image = cls.get_node_or_error(
            info, id, errors, 'id', only_type=SkillImage)
        skill = image.skill
        if not errors:
            alt = input.get('alt')
            if alt is not None:
                image.alt = alt
                image.save(update_fields=['alt'])
        return SkillImageUpdate(skill=skill, image=image, errors=errors)


class SkillImageReorder(BaseMutation):
    skill = graphene.Field(Skill)
    images = graphene.List(SkillImage)

    class Arguments:
        skill_id = graphene.ID(
            required=True,
            description='Id of skill that images order will be altered.')
        images_ids = graphene.List(
            graphene.ID, required=True,
            description='IDs of a skill images in the desired order.')

    class Meta:
        description = 'Changes ordering of the skill image.'

    @classmethod
    @permission_required('skill.manage_skills')
    def mutate(cls, root, info, skill_id, images_ids):
        errors = []
        skill = cls.get_node_or_error(
            info, skill_id, errors, 'skillId', Skill)
        if len(images_ids) != skill.images.count():
            cls.add_error(
                errors, 'order', 'Incorrect number of image IDs provided.')
        images = []
        for image_id in images_ids:
            image = cls.get_node_or_error(
                info, image_id, errors, 'order', only_type=SkillImage)
            if image and image.skill != skill:
                cls.add_error(
                    errors, 'order',
                    "Image with id %r does not belong to skill %r" % (
                        image_id, skill_id))
            images.append(image)
        if not errors:
            for order, image in enumerate(images):
                image.sort_order = order
                image.save(update_fields=['sort_order'])
        return SkillImageReorder(
            skill=skill, images=images, errors=errors)


class SkillImageDelete(BaseMutation):
    skill = graphene.Field(Skill)
    image = graphene.Field(SkillImage)

    class Arguments:
        id = graphene.ID(
            required=True, description='ID of a skill image to delete.')

    class Meta:
        description = 'Deletes a skill image.'

    @classmethod
    @permission_required('skill.manage_skills')
    def mutate(cls, root, info, id):
        errors = []
        image = cls.get_node_or_error(
            info, id, errors, 'id', only_type=SkillImage)
        image_id = image.id
        if not errors:
            image.delete()
        image.id = image_id
        return SkillImageDelete(
            skill=image.skill, image=image, errors=errors)


class VariantImageAssign(BaseMutation):
    skill_variant = graphene.Field(SkillVariant)
    image = graphene.Field(SkillImage)

    class Arguments:
        image_id = graphene.ID(
            required=True,
            description='ID of a skill image to assign to a variant.')
        variant_id = graphene.ID(
            required=True,
            description='ID of a skill variant.')

    class Meta:
        description = 'Assign an image to a skill variant'

    @classmethod
    @permission_required('skill.manage_skills')
    def mutate(cls, root, info, image_id, variant_id):
        errors = []
        image = cls.get_node_or_error(
            info, image_id, errors, 'imageId', SkillImage)
        variant = cls.get_node_or_error(
            info, variant_id, errors, 'variantId', SkillVariant)
        if image and variant:
            # check if the given image and variant can be matched together
            image_belongs_to_skill = variant.skill.images.filter(
                pk=image.pk).first()
            if image_belongs_to_skill:
                image.variant_images.create(variant=variant)
            else:
                cls.add_error(
                    errors, 'imageId', 'Image must be for this skill')
        return VariantImageAssign(
            skill_variant=variant, image=image, errors=errors)


class VariantImageUnassign(BaseMutation):
    skill_variant = graphene.Field(SkillVariant)
    image = graphene.Field(SkillImage)

    class Arguments:
        image_id = graphene.ID(
            required=True,
            description='ID of a skill image to unassign from a variant.')
        variant_id = graphene.ID(
            required=True, description='ID of a skill variant.')

    class Meta:
        description = 'Unassign an image from a skill variant'

    @classmethod
    @permission_required('skill.manage_skills')
    def mutate(cls, root, info, image_id, variant_id):
        errors = []
        image = cls.get_node_or_error(
            info, image_id, errors, 'imageId', SkillImage)
        variant = cls.get_node_or_error(
            info, variant_id, errors, 'variantId', SkillVariant)
        if not errors:
            if image and variant:
                try:
                    variant_image = models.VariantImage.objects.get(
                        image=image, variant=variant)
                except models.VariantImage.DoesNotExist:
                    cls.add_error(
                        errors, 'imageId',
                        'Image is not assigned to this variant.')
                else:
                    variant_image.delete()
        return VariantImageUnassign(
            skill_variant=variant, image=image, errors=errors)
