.. _elasticsearch:

Elasticsearch
=============


Installation
------------

Elasticsearch search backend requires an Elasticsearch server. For the installation guide, please refer to `the official documentation <https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html>`.

Integration can be configured with set of environment variables.
When you're deploying on Heroku - you can use add-on that provides Elasticsearch as a service.
By default Remote-works uses Elasticsearch 6.3.

If you're deploying somewhere else, you can use one of following services:

 - http://www.searchly.com/
 - https://www.elastic.co/cloud


Environment variables
---------------------

``ELASTICSEARCH_URL`` or ``BONSAI_URL`` or ``SEARCHBOX_URL``
  URL to elasticsearch engine. If it's empty - search will be not available.

  **Example:** ``https://user:password@my-3rdparty-es.com:9200``


Data indexing
-------------

Remote-works uses `Django Elasticsearch DSL <https://github.com/sabricot/django-elasticsearch-dsl>`_ as a wrapper for `Elasticsearch DSL <https://github.com/elastic/elasticsearch-dsl-py>`_ to enable automatic indexing and sync. Indexes are defined in `documents <https://github.com/remote-works/remote-works/search/documents.py>`_ file. Please refer to documentation of above projects for further help.

Initial search index can be created with following command:

.. code-block:: bash

    $ python manage.py search_index --rebuild

By default all indexed objects (products, users, tasks) are reindexed every time they are changed.


Search integration architecture
-------------------------------

Search backends use `Elasticsearch DSL <https://github.com/elastic/elasticsearch-dsl-py>`_ for query definition in remote-works/search/backends.

There are two backends defined for elasticsearch integration, `storefront <https://github.com/mirumee/remote-works/blob/master/remote-works/search/backends/elasticsearch_storefront.py>`_ and `dashboard <https://github.com/mirumee/remote-works/blob/master/remote-works/search/backends/elasticsearch_dashboard.py>`_. Storefront search uses only storefront index for skill only search, dashboard backend does additional searches in users and tasks indexes as well.


Testing
-------

There are two levels of testing for search functionality. Syntax of Elasticsearch queries is ensured by unit tests for backend, `integration <https://github.com/remote-works/remote-works/tests/test_search.py>`_ testing is done using `VCR.py <https://github.com/kevin1024/vcrpy>`_ to mock external communication. If search logic is modified, make sure to record new communication and align test fixtures accordingly! Pytest will run VCR in never-recording mode on CI to make sure no attempts of communication are made, so make sure most recent
cassettes are always included in your repository.
