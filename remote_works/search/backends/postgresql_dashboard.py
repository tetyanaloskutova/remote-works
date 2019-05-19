from django.contrib.postgres.search import (
    SearchQuery, SearchRank, SearchVector)

from ...account.models import User
from ...task.models import Task
from ...product.models import Skill


def search_products(phrase):
    """Return matching skills for dashboard views."""
    sv = (SearchVector('name', weight='A') +
          SearchVector('description', weight='B'))
    rank = SearchRank(sv, SearchQuery(phrase))
    return Skill.objects.annotate(rank=rank).filter(
        rank__gte=0.2).order_by('-rank')


def search_orders(phrase):
    """Return matching tasks for dashboard views.

    When phrase is convertable to int, no full text search is performed,
    just task with matching id is looked up.
    """
    try:
        order_id = int(phrase.strip())
        return Task.objects.filter(id=order_id)
    except ValueError:
        pass

    sv = (
        SearchVector('user__first_name', weight='B') +
        SearchVector('user__last_name', weight='B') +
        SearchVector(
            'user__default_delivery_address__first_name', weight='B') +
        SearchVector('user__default_delivery_address__last_name', weight='B') +
        SearchVector('user__email', weight='A'))
    rank = SearchRank(sv, SearchQuery(phrase))
    return Task.objects.annotate(rank=rank).filter(
        rank__gte=0.2).order_by('-rank')


def search_users(phrase):
    """Return matching users for dashboard views."""
    sv = (SearchVector('email', weight='A') +
          SearchVector('first_name', weight='B') +
          SearchVector('last_name', weight='B') +
          SearchVector('default_billing_address__first_name', weight='B') +
          SearchVector('default_billing_address__last_name', weight='B'))
    rank = SearchRank(sv, SearchQuery(phrase))
    return User.objects.annotate(rank=rank).filter(
        rank__gte=0.2).order_by('-rank')


def search(phrase):
    """Return all matching objects for dashboard views.

    Composes independent search querysets into a single dictionary.

    Args:
        phrase (str): searched phrase
    """
    return {
        'skills': search_products(phrase),
        'tasks': search_orders(phrase),
        'users': search_users(phrase)}
