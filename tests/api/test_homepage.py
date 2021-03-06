from remote_works.task import TaskEvents

from .utils import get_graphql_content


def test_homepage_events(task_events, staff_api_client, permission_manage_orders):
    query = """
    {
        homepageEvents(first: 20) {
            edges {
                node {
                    date
                    type
                }
            }
        }
    }
    """
    response = staff_api_client.post_graphql(
        query, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    edges = content['data']['homepageEvents']['edges']
    only_types = [
        TaskEvents.PLACED, TaskEvents.PLACED_FROM_DRAFT,
        TaskEvents.ORDER_FULLY_PAID]
    only_types = {t.name for t in only_types}
    assert {edge['node']['type'] for edge in edges} == only_types
