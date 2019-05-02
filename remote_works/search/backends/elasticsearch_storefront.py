from elasticsearch_dsl.query import MultiMatch

from ..documents import SkillDocument


def get_search_query(phrase):
    """Return matching skills for storefront views."""
    query = MultiMatch(fields=['title', 'name', 'description'], query=phrase)
    return (
        SkillDocument.search()
        .query(query)
        .source(False)
        .filter('term', is_published=True))


def search(phrase):
    return get_search_query(phrase).to_queryset()
