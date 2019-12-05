# Upload manager microservice
This microservice, implemented in NodeJs, exposes 5 endpoints:
* */dir* endpoint - it calls an endpoint that shows the upload directory, as defined by UPLOAD_DIR environment variable which has been injected in the application environment
* */config* endpoint - it calls an endpoint that shows the configuration properties, as defined in *config.properties* configuration file, available in *config* subfolder
* */upload* endpoint - it allows to select files from the local filesystem and upload them to *<UPLOAD_DIR>* folder
* */list* endpoint - it calls an endpoint that shows all the files in *<UPLOAD_DIR>* folder
* */delete* endpoint - it calls an endpoint that deletes all the files in *<UPLOAD_DIR>* folder

## Prerequisites
Prerequisites are described in ![Container basics tutorial - Prerequisites](https://github.com/robipozzi/container-kubernetes-tutorials/tree/master/1-container_basics#Prerequisites) paragraph.

## 1. Microservice demo scenario
The present GitHub repository provides all the code and configuration files needed to run and test the Restaurant Management application. The application code is provided in */app* subfolder.

1. Start a terminal in your environment
2. If you haven't done already, download the files with the following command 

*git clone https://github.com/robipozzi/container-kubernetes-tutorials.git*

3. cd to *container-kubernetes-tutorials/4-container_network/rpozzi-upload-manager*
4. Run *app-run.sh* script to launch the application

You can now test the application by running *http://localhost:8083* .

### 1.1. Running microservice as a Docker container
A *Dockerfile* is provided to build and run the application as a Docker container. 
First you need to build the container image by running the *docker build* command as follows:

*docker build -t robipozzi/rpozzi-upload-manager:1.0 .*

Once the Docker image is built, it can be run with the standard Docker run command: 

*docker run -it --name upload-manager-app -p 8084:8083 -v /Users/robertopozzi/temp/upload:/tmp/upload -e UPLOAD_DIR=/tmp/upload -e KEYSTORE_PASSWORD=mycredentials -e EXPOSED_PORT=8084 robipozzi/rpozzi-upload-manager:1.0*

Once the Docker container is started, launch *http://localhost:8084/<ENDPOINT>* to test microservice behavior, where 

<ENDPOINT> is one of the 5 endpoints described above

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