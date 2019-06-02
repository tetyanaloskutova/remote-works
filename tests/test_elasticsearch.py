from decimal import Decimal

import pytest
from django.urls import reverse
from elasticsearch_dsl.connections import connections

from remote_works.account.models import User
from remote_works.task.models import Task
from remote_works.product.models import Skill

MATCH_SEARCH_REQUEST = ['method', 'host', 'port', 'path']
STOREFRONT_SKILLS = {15, 56}  # same as in recorded data!
DASHBOARD_SKILLS = {58, 56}
SKILLS_INDEXED = STOREFRONT_SKILLS | DASHBOARD_SKILLS
SKILLS_TO_UNPUBLISH = {56}  # choose from SKILLS_INDEXED
PHRASE_WITH_RESULTS = 'Group'
PHRASE_WITHOUT_RESULTS = 'foo'

ES_URL = 'http://search:9200'  # make it real for communication recording


@pytest.fixture(scope='module', autouse=True)
def elasticsearch_connection():
    connections.create_connection('default', hosts=[ES_URL])


@pytest.fixture(scope='function', autouse=True)
def elasticsearch_enabled(settings):
    settings.ES_URL = ES_URL
    settings.ENABLE_SEARCH = True
    settings.SEARCH_BACKEND = 'remote_works.search.backends.elasticsearch'


@pytest.fixture(scope='function', autouse=True)
def elasticsearch_autosync_disabled(settings):
    """Prevent ES index from being refreshed every time objects are saved."""
    settings.ELASTICSEARCH_DSL_AUTO_REFRESH = False
    settings.ELASTICSEARCH_DSL_AUTOSYNC = False


@pytest.mark.vcr()
@pytest.fixture
def indexed_products(skill_type, category):
    """Skills to be found by search backend.

    We need existing objects with primary keys same as search service
    returned in response. Otherwise search view won't find anything.
    Purpose of this fixture is for integration with search service only!
    pks must be in response in appropiate recorded cassette.
    """
    def gen_skill_with_id(object_id):
        skill = Skill.objects.create(
            pk=object_id,
            name='Test skill ' + str(object_id),
            price=Decimal(10.0),
            skill_type=skill_type,
            category=category)
        return product
    return [gen_skill_with_id(prod) for prod in SKILLS_INDEXED]


def execute_search(client, phrase):
    response = client.get(reverse('search:search'), {'q': phrase})
    assert phrase == response.context['query']
    found_objs = response.context['results'].object_list
    return [prod.pk for prod, _ in found_objs]


@pytest.mark.integration
@pytest.mark.vcr(record_mode='once', match_on=MATCH_SEARCH_REQUEST)
def test_new_search_with_empty_results(db, client):
    assert 0 == len(execute_search(client, PHRASE_WITHOUT_RESULTS))


@pytest.mark.integration
@pytest.mark.vcr(record_mode='once', match_on=MATCH_SEARCH_REQUEST)
def test_new_search_with_result(db, indexed_products, client):
    found_skills = execute_search(client, PHRASE_WITH_RESULTS)
    assert STOREFRONT_SKILLS == set(found_products)


@pytest.fixture
def products_with_mixed_publishing(indexed_products):
    products_to_unpublish = Skill.objects.filter(
        pk__in=SKILLS_TO_UNPUBLISH)
    for prod in products_to_unpublish:
        prod.is_published = False
        prod.save()
    return indexed_products


@pytest.mark.integration
@pytest.mark.vcr(record_mode='once', match_on=MATCH_SEARCH_REQUEST)
def test_new_search_doesnt_show_unpublished(
        db, products_with_mixed_publishing, client):
    published_skills = STOREFRONT_SKILLS - SKILLS_TO_UNPUBLISH
    found_skills = execute_search(client, PHRASE_WITH_RESULTS)
    assert published_skills == set(found_products)


def execute_dashboard_search(client, phrase):
    response = client.get(reverse('dashboard:search'), {'q': phrase})
    assert phrase == response.context['query']
    found_prod = {p.pk for p in response.context['skills']}
    found_users = {p.pk for p in response.context['users']}
    found_orders = {p.pk for p in response.context['tasks']}
    return found_prod, found_users, found_orders


@pytest.mark.integration
@pytest.mark.vcr(record_mode='once', match_on=MATCH_SEARCH_REQUEST)
def test_dashboard_search_with_empty_results(db, admin_client):
    products, users, tasks = execute_dashboard_search(
        admin_client, PHRASE_WITHOUT_RESULTS)
    assert 0 == len(products)
    assert 0 == len(users)
    assert 0 == len(tasks)


@pytest.mark.integration
@pytest.mark.vcr(record_mode='once', match_on=MATCH_SEARCH_REQUEST)
def test_dashboard_search_with_skill_result(
        db, indexed_products, admin_client):
    products, _, _ = execute_dashboard_search(admin_client,
                                              PHRASE_WITH_RESULTS)
    assert DASHBOARD_SKILLS == products


# data below must be aligned with recorded communication every time
EXISTING_EMAIL = 'nancy.mccoy@example.com'
NON_EXISTING_EMAIL = 'john.doe@foo.bar'
USER_EMAIL_WITH_ORDER = 'martin.montgomery@example.com'
USER_NAME_WITH_ORDER = 'Martin'
USER_EMAIL_WITH_ORDER_WITHOUT_ADDRES = 'rachel.banks@example.com'
USER_NAME_WITH_ORDER_WITHOUT_ADDRES = 'Rachel'
EXISTING_NAME = 'Rhonda'
EXISTING_NAME_FULL = 'rhonda.ayala@example.com'
EXISTING_NAME_WITHOUT_ADDRESS = 'Brett'
EXISTING_NAME_FULL_WITHOUT_ADDRESS = 'brett.hendrix@example.com'
USERS = {EXISTING_EMAIL: 109,
         NON_EXISTING_EMAIL: 870,
         USER_EMAIL_WITH_ORDER: 102,
         USER_EMAIL_WITH_ORDER_WITHOUT_ADDRES: 117,
         EXISTING_NAME_FULL: 106,
         EXISTING_NAME_FULL_WITHOUT_ADDRESS: 122}
ORDERS = {USER_EMAIL_WITH_ORDER: {11, 17},
          USER_EMAIL_WITH_ORDER_WITHOUT_ADDRES: {15}}


@pytest.fixture
def customers(db):
    for email, pk in USERS.items():
        User.objects.create_user(email, 'password', pk=pk)


@pytest.mark.integration
@pytest.mark.vcr(record_mode='once', match_on=MATCH_SEARCH_REQUEST)
def test_dashboard_search_user_by_email(db, admin_client, customers):
    _, users, _ = execute_dashboard_search(admin_client, EXISTING_EMAIL)
    assert {USERS[EXISTING_EMAIL]} == users


@pytest.mark.integration
@pytest.mark.vcr(record_mode='once', match_on=MATCH_SEARCH_REQUEST)
def test_dashboard_search_user_name(db, admin_client, customers):
    _, users, _ = execute_dashboard_search(admin_client, EXISTING_NAME)
    assert USERS[EXISTING_NAME_FULL] in users


@pytest.mark.integration
@pytest.mark.vcr(record_mode='once', match_on=MATCH_SEARCH_REQUEST)
def test_dashboard_search_user_name_without_address(db, admin_client,
                                                    customers):
    _, users, _ = execute_dashboard_search(
        admin_client, EXISTING_NAME_WITHOUT_ADDRESS)
    assert USERS[EXISTING_NAME_FULL_WITHOUT_ADDRESS] in users


@pytest.fixture
def tasks(db, address):
    all_pks = set()
    for email, pks in ORDERS.items():
        for pk in pks:
            Task.objects.create(
                billing_address=address, user_email=email, pk=pk)
        all_pks = all_pks | pks
    return all_pks


@pytest.mark.integration
@pytest.mark.vcr(record_mode='once', match_on=MATCH_SEARCH_REQUEST)
def test_dashboard_search_orders_by_user_email(db, admin_client,
                                               customers, tasks):
    _, _, tasks = execute_dashboard_search(
        admin_client, USER_EMAIL_WITH_ORDER)
    assert ORDERS[USER_EMAIL_WITH_ORDER] == tasks


@pytest.mark.integration
@pytest.mark.vcr(record_mode='once', match_on=MATCH_SEARCH_REQUEST)
def test_dashboard_search_orders_by_user_name(db, admin_client,
                                              customers, tasks):
    _, _, tasks = execute_dashboard_search(
        admin_client, USER_NAME_WITH_ORDER)
    assert ORDERS[USER_EMAIL_WITH_ORDER] == tasks


@pytest.mark.integration
@pytest.mark.vcr(record_mode='once', match_on=MATCH_SEARCH_REQUEST)
def test_dashboard_search_orders_by_user_name_without_address(db, admin_client,
                                                              customers,
                                                              tasks):
    _, _, tasks = execute_dashboard_search(
        admin_client, USER_NAME_WITH_ORDER_WITHOUT_ADDRES)
    assert ORDERS[USER_EMAIL_WITH_ORDER_WITHOUT_ADDRES] == tasks
