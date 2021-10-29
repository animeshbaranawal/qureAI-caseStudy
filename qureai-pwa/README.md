# React App
Axios is used to connect the frontend with the backend.

Code for frontend is present in src/App.js
Code for axios configuration is present in src/services/http-common.js
Code for axios connections is present in src/services/uploadFiles.js

The layout of frontend is as follows:
1. Browse: to browse and select the image to be pushed
2. Upload: to upload the image to server. There is an upload bar present to show the upload progress.
3. Image: Shows the image which was selected
4. Display: Shows the inference data as horizontal bar chart.

Using Docker to get the react app up
----------------------------------------
Ensure that docker and docker-compose are setup on your system. 

Note the IP of the machine (machineIP) on which the frontend is hosted. 

Also, note the IP of the machine on which the django server is running (djangoIP). 
Change baseURL in src/services/http-common.js to the **djangoIP**.

To start the react app: run `django-compose up`
The app runs on **machineIP**:3001.
