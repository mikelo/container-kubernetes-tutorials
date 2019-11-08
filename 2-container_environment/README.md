# Container environment variables tutorial
This tutorial provides code to test and understand how environment variables can be used to externalize and inject configuration in container based applications.

It builds on ![Container basics tutorial](https://github.com/robipozzi/container-kubernetes-tutorials/tree/master/1-container_basics) by extending Node.Js based web application which serves an HTML page and exposes the following 4 endpoints:
* */healthz* endpoint - it returns a string, testing that the application is up and healthy
* */restaurants* endpoint - it returns a list of restaurants in Json format
* */dir* endpoint - it calls an endpoint that shows the upload directory, as defined by UPLOAD_DIR environment variable which has been injected in the application environment
* */config* endpoint - it calls an endpoint that shows the configuration properties, as defined in *config.properties* configuration file, available in *config* subfolder

## Prerequisites
Prerequisites are described in ![Container basics tutorial - Prerequisites](https://github.com/robipozzi/container-kubernetes-tutorials/tree/master/1-container_basics#Prerequisites) paragraph.

## 1. Application demo scenario
The present GitHub repository provides all the code and configuration files needed to run and test the Restaurant Management application. The application code is provided in */app* subfolder.

1. Start a terminal in your environment
2. If you haven't done already, download the files with the following command **git clone https://github.com/robipozzi/container-kubernetes-tutorials.git**
3. cd to **container-kubernetes-tutorials/2-container_environment**
4. Run *app-run.sh* script to launch the application

You can now test the application by running *http://localhost:8082* .

The application requires 2 environment variables, as it can be seen in the following code snippet from *app.js* file

![](https://github.com/robipozzi/container-kubernetes-tutorials/blob/master/2-container_environment/images/code-snippet1.png)

* one is called *UPLOAD_DIR*, and must be passed to the application by launching it with the following construct:

**UPLOAD_DIR="/Users/robertopozzi/temp/upload" npm start**

* the other is called *EXPOSED_PORT* but it is not mandatory.

The *app-run.sh* script, available in the repository root folder, is provided to automate application launch with the appropriate configuration.

### 1.1. Running application as a Docker container
A *Dockerfile* is provided to build and run the application as a Docker container. 
First you need to build the container image by running the *docker build* command as follows:

**docker build -t robipozzi/rpozzi-restaurants:1.1 .**

Once the Docker image is built, it can be run with the standard Docker run command: 

**docker run -it --name restaurant-app -p 8083:8082 -e UPLOAD_DIR=<YOUR_UPLOAD_DIR> -e EXPOSED_PORT=8083 robipozzi/rpozzi-restaurants:1.1**

As it can be seen, an environment variable can be injected into a container with the following Docker construct:

**-e <ENV_VARIABLE_KEY>=<ENV_VARIABLE_VALUE>**

Once the Docker container is started, launch *http://localhost:8083/dir* endpoint which will return the upload directory used by application, as shown in the following snapshot:

![](https://github.com/robipozzi/container-kubernetes-tutorials/blob/master/2-container_environment/images/dir_endpoint.png)

You can restart Docker container by changing *<YOUR_UPLOAD_DIR>* in *-e UPLOAD_DIR=<YOUR_UPLOAD_DIR>* and see how environment variable change affects the application.

### 1.2. Running application as a cri-o container
The same *Dockerfile* can be used to build and run the application as a cri-o container. 
First you need to build the container image by running the *buildah bud* command as follows:

**buildah bud -t robipozzi/rpozzi-restaurants:1.1 .**

Once the container image is built, it can be run with the standard *podman run* command, as follows: 

**podman run -it --name restaurant-app -p 8083:8082 -e UPLOAD_DIR=<YOUR_UPLOAD_DIR> -e EXPOSED_PORT=8083 robipozzi/rpozzi-restaurants:1.1**

As it can be seen, the same exact construct used with Docker can be applied by using Buildah and Podman.

## 2. Automation scripts available
A *Dockerfile* is provided to build and run the application as a container; plain standard OCI compliant commands (either Docker or Buildah/Podman) can be used to build the container image, push the container image to Docker Hub repository and run it as a container, the following scripts are provided for convenience:

### 2.1. Docker
* *docker-build.sh* - it can be launched to build the Docker image; the script removes the Docker image from the local registry and re-builds it.
* *docker-run.sh* - it can be launched to run Docker container locally; the script removes running container and runs a fresh container instance.
* *docker-push.sh* - it can be launched to push the Docker image to Docker Hub. You will need to modify *$CONTAINER_IMAGE_NAME* parameter in *setenv-docker.sh* appropriately to push to the correct Docker Hub repository.

All the relevant parameters are externalized and can be changed in *setenv-docker.sh* script.

### 2.2. Buildah / Podman
* *container-build.sh* - it can be launched to build the container image using Buildah utility; the script removes the container image from the local registry and re-builds it.
* *container-run.sh* - it can be launched to run container locally using Podman utility; the script removes running container and runs a fresh container instance.
* *container-push.sh* - it can be launched to push the container image to Docker Hub. You will need to modify *$CONTAINER_IMAGE_NAME* parameter in *setenv.sh* appropriately to push to the correct Docker Hub repository.

All the relevant parameters are externalized and can be changed in *setenv.sh* script.