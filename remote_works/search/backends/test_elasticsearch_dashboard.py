from . import elasticsearch_dashboard

PHRASE = 'You can go to the west'
TYPE_QUERY = {
    '_source': False,
    'query': {
        'multi_match': {
            'fields': ['name', 'title', 'description'],
            'query': PHRASE,
            'type': 'cross_fields'}},
    'sort': ['_score']}
TASKS_QUERY = {
    '_source': False,
    'query': {
        'multi_match': {
            'fields': ['user', 'first_name', 'last_name', 'discount_name'],
            'query': PHRASE}}}
USERS_QUERY = {
    '_source': False,
    'query': {
        'multi_match': {
            'fields': ['user', 'email', 'first_name', 'last_name'],
            'operator': 'and',
            'query': PHRASE,
            'type': 'cross_fields'}}}


def test_dashboard_search_query_syntax():
    ''' Check if generated ES queries have desired syntax '''
    searches = elasticsearch_dashboard.get_search_queries(PHRASE)
    assert TYPE_QUERY == searches['skills'].to_dict()
    assert TASKS_QUERY == searches['tasks'].to_dict()
    assert USERS_QUERY == searches['users'].to_dict()
