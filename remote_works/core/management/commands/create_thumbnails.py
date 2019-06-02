import logging

from django.core.management.base import BaseCommand
from versatileimagefield.image_warmer import VersatileImageFieldWarmer

from ....skill.models import SkillImage

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Generate thumbnails for all images'

    def handle(self, *args, **options):
        self.warm_skills()

    def warm_skills(self):
        self.stdout.write('Skills thumbnails generation:')
        warmer = VersatileImageFieldWarmer(
            instance_or_queryset=SkillImage.objects.all(),
            rendition_key_set='skills', image_attr='image', verbose=True)
        num_created, failed_to_create = warmer.warm()
        self.log_failed_images(failed_to_create)

    def log_failed_images(self, failed_to_create):
        if failed_to_create:
            self.stderr.write('Failed to generate thumbnails:')
            for patch in failed_to_create:
                self.stderr.write(patch)
