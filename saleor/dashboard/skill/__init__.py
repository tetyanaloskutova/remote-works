from django.utils.translation import pgettext_lazy


class SkillBulkAction:
    """Represents types of skill bulk actions handled in dashboard."""

    PUBLISH = 'Publish'
    UNPUBLISH = 'Unpublish'

    CHOICES = [
        (PUBLISH, pgettext_lazy('skill bulk action', 'Publish')),
        (UNPUBLISH, pgettext_lazy('skill bulk action', 'Unpublish'))]
