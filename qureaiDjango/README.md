# Django Server
Database: sqlite for admin management

The server hosts an app "imageClassify" which handles the requests from the React App.
Request handling code can be found in imageClassify/views.py

1. upload_file: POST reqeuest - File is uploaded in images/ . 
2. get_inference: GET request - Inference is performed on the image

Images are identified by unique hash maintained at the client.
The URL routing can be found in qureaiDjango/urls.py and imageClassify/urls.py

Using Docker to get the server up
----------------------------------------
Ensure that docker and docker-compose are setup on your system.

Note the IP of the machine on which the container will be setup (djangoIP).

Change IP in ALLOWED_HOSTS configuration under qureaiDjango/settings.py to **djangoIP**.

To start the server: run `django-compose up`.
The django server runs on **djangoIP**:8000.
