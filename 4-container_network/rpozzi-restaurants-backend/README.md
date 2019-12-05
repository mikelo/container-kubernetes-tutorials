# Restaurants backend microservice
This microservice, implemented in NodeJs, exposes 2 endpoints:
* */healthz* endpoint - it returns a string, testing that the application is up and healthy
* */restaurants* endpoint - it returns a list of restaurants in Json format

## Prerequisites
Prerequisites are described in ![Container basics tutorial - Prerequisites](https://github.com/robipozzi/container-kubernetes-tutorials/tree/master/1-container_basics#Prerequisites) paragraph.

## 1. Microservice demo scenario
The present GitHub repository provides all the code and configuration files needed to run and test the Restaurant Management application. The application code is provided in */app* subfolder.

1. Start a terminal in your environment
2. If you haven't done already, download the files with the following command 

*git clone https://github.com/robipozzi/container-kubernetes-tutorials.git*

3. cd to *container-kubernetes-tutorials/4-container_network/rpozzi-restaurants-backend*
4. Run *app-run.sh* script to launch the application

You can now test the application by running *http://localhost:8082/restaurants* .

### 1.1. Running microservice as a Docker container
A *Dockerfile* is provided to build and run the application as a Docker container. 
First you need to build the container image by running the *docker build* command as follows:

*docker build -t robipozzi/rpozzi-restaurants-backend:1.0 .*

Once the Docker image is built, it can be run with the standard Docker run command: 

*docker run -it --name restaurant-backend-app -p 8083:8082 -v /Users/robertopozzi/dev/robipozzi-kubernetes/container-kubernetes-tutorials/4-container_network/rpozzi-restaurants-backend/app/config:/config -e CONFIG_DIR=/config -e EXPOSED_PORT=8083 robipozzi/rpozzi-restaurants-backend:1.0*

Once the Docker container is started, launch *http://localhost:8083/restaurants* to test microservice behavior.

### 1.2. Running microservice as a cri-o container

[TODO]

## 2. Automation scripts available
A *Dockerfile* is provided to build and run the application as a container; plain standard OCI compliant commands (either Docker or Buildah/Podman) can be used to build the container image, push the container image to Docker Hub repository and run it as a container, the following scripts are provided for convenience:

### 2.1. Docker
* *docker-build.sh* - it can be launched to build the Docker image; the script removes the Docker image from the local registry and re-builds it.
* *docker-run.sh* - it can be launched to run Docker container locally; the script removes running container and runs a fresh container instance.
* *docker-push.sh* - it can be launched to push the Docker image to Docker Hub. You will need to modify *$CONTAINER_IMAGE_NAME* parameter in *setenv-docker.sh* appropriately to push to the correct Docker Hub repository.

All the relevant parameters are externalized and can be changed in *setenv-docker.sh* script.

### 2.2. Buildah / Podman

[TODO]