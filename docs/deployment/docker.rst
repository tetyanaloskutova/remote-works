.. _docker-deployment:

Docker
======

You will need to install Docker first.

Then use Docker to build the image:

.. code-block:: bash

 $ docker build -t mystorefront .


Then you can run Remote-works container with the following settings:

.. code-block:: bash

 $ docker run -e SECRET_KEY=<SECRET_KEY> -e DATABASE_URL=<DATABASE_URL> -p 8000:8000 remote-works

Please refer to :ref:`settings_configuration` for more environment variable settings.
