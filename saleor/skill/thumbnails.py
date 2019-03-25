from celery import shared_task

from ..core.utils import create_thumbnails
from .models import Category, Collection, SkillImage


@shared_task
def create_skill_thumbnails(image_id):
    """Takes a SkillImage model, and creates thumbnails for it."""
    create_thumbnails(pk=image_id, model=SkillImage, size_set='skills')


@shared_task
def create_category_background_image_thumbnails(category_id):
    """Takes a Skill model,
    and creates the background image thumbnails for it."""
    create_thumbnails(
        pk=category_id, model=Category,
        size_set='background_images', image_attr='background_image')


@shared_task
def create_collection_background_image_thumbnails(collection_id):
    """Takes a Collection model,
    and creates the background image thumbnails for it."""
    create_thumbnails(
        pk=collection_id, model=Collection,
        size_set='background_images', image_attr='background_image')
