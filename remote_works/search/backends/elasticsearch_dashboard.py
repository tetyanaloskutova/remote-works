from elasticsearch_dsl.query import MultiMatch

from ..documents import TaskDocument, SkillDocument, UserDocument


def _search_skills(phrase):
    prod_query = MultiMatch(
        fields=['name', 'title', 'description'],
        query=phrase,
        type='cross_fields')
    return SkillDocument.search().query(prod_query).sort('_score').source(
        False)


def _search_users(phrase):
    user_query = MultiMatch(
        fields=['user', 'email', 'first_name', 'last_name'],
        query=phrase,
        type='cross_fields',
        operator='and')
    return UserDocument.search().query(user_query).source(False)


def _search_orders(phrase):
    task_query = MultiMatch(
        fields=['user', 'first_name', 'last_name', 'discount_name'],
        query=phrase)
    return TaskDocument.search().query(task_query).source(False)


def get_search_queries(phrase):
    """Return querysets to lookup different types of objects.

    Args:
        phrase (str): searched phrase
    """
    return {
        'skills': _search_skills(phrase),
        'users': _search_users(phrase),
        'tasks': _search_orders(phrase)}


def search(phrase):
    """Return all matching objects for dashboard views.

    Composes independent search querysets into a single dictionary.

    Args:
        phrase (str): searched phrase
    """
    return {k: s.to_queryset() for k, s in get_search_queries(phrase).items()}
