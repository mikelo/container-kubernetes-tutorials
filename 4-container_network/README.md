# Container networking tutorial
This tutorial provides code to test and understand how container networking works.

The tutorial builds on previous ![Container volumes tutorial](https://github.com/robipozzi/container-kubernetes-tutorials/tree/master/3-container_volumes) by splitting the Restaurant Management web application in 3 different microservices, each one deployed as a separate container:
* ![*Restaurants UI* microservice](https://github.com/robipozzi/container-kubernetes-tutorials/tree/master/4-container_network/rpozzi-restaurants-ui) - it provides the UI capabilities, implemented as an Angular application.
* ![*Restaurants backend* microservice](https://github.com/robipozzi/container-kubernetes-tutorials/tree/master/4-container_network/rpozzi-restaurants-backend) - it provides a NodeJs implementation for */restaurants* API.
* ![*Upload manager* microservice](https://github.com/robipozzi/container-kubernetes-tutorials/tree/master/4-container_network/rpozzi-upload-manager) - it provides a NodeJs implementation for the remaining APIs exposed by the application.

These are the 6 endpoints exposed by the application:
* */healthz* endpoint - it returns a string, testing that the application is up and healthy
* */restaurants* endpoint - it returns a list of restaurants in Json format
* */dir* endpoint - it calls an endpoint that shows the upload directory, as defined by UPLOAD_DIR environment variable which has been injected in the application environment
* */upload* endpoint - it allows to select files from the local filesystem and upload them to *<UPLOAD_DIR>* folder
* */list* endpoint - it calls an endpoint that shows all the files in *<UPLOAD_DIR>* folder
* */delete* endpoint - it calls an endpoint that deletes all the files in *<UPLOAD_DIR>* folder

As described before, the different endpoints are implemented by different microservices; such an architecture allows to test how different containers interact with one another from a network access perspective.

## Prerequisites
Prerequisites are described in ![Container basics tutorial - Prerequisites](https://github.com/robipozzi/container-kubernetes-tutorials/tree/master/1-container_basics#Prerequisites) paragraph.

## Application demo scenario
The present GitHub repository provides all the code and configuration files needed to run and test the Restaurant Management application.

1. Start a terminal in your environment
2. If you haven't done already, download the files with the following command 

*git clone https://github.com/robipozzi/container-kubernetes-tutorials.git*

3. cd to *container-kubernetes-tutorials/4-container_network*
[TODO]

## Automation scripts available
The following scripts are provided for convenience:
* *docker-run-no-netwrok.sh* - it can be launched to run all 3 Docker containers locally with no Docker network attached.
* *docker-run-with-volume.sh* - it can be launched to run all 3 Docker containers locally, attached to the same Docker network.
* *docker-container-remove.sh* - it can be launched to remove all 3 Docker containers and Docker network.

All the relevant parameters are externalized and can be changed in *setenv.sh* script.