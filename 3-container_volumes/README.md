# Container volumes tutorial
This tutorial provides code to test and understand how persistence can be managed in container based applications.

Containers are, by nature, inherently volatile, which means they do not persist state between subsequent runs of the container. Since persistence is mandatory for any non trivial application, container technologies obviously provide technical mechanisms to manage persistence through the usage of volumes (see, as an example, Docker official documentation https://docs.docker.com/storage/volumes/).

The tutorial builds on previous ![Container environment variables tutorial](https://github.com/robipozzi/container-kubernetes-tutorials/tree/master/2-container_environment) by further extending NodeJs based web application to serve an HTML page and expose 7 endpoints:
* */healthz* endpoint - it returns a string, testing that the application is up and healthy
* */restaurants* endpoint - it returns a list of restaurants in Json format
* */dir* endpoint - it calls an endpoint that shows the upload directory, as defined by UPLOAD_DIR environment variable which has been injected in the application environment
* */config* endpoint - it calls an endpoint that shows the configuration properties, as defined in *config.properties* configuration file, available in *config* subfolder
* */upload* endpoint - it allows to select files from the local filesystem and upload them to *<UPLOAD_DIR>* folder
* */list* endpoint - it calls an endpoint that shows all the files in *<UPLOAD_DIR>* folder
* */delete* endpoint - it calls an endpoint that deletes all the files in *<UPLOAD_DIR>* folder

## Prerequisites
Prerequisites are described in ![Container basics tutorial - Prerequisites](https://github.com/robipozzi/container-kubernetes-tutorials/tree/master/1-container_basics#Prerequisites) paragraph.

## 1. Application demo scenario
The present GitHub repository provides all the code and configuration files needed to run and test the Restaurant Management application. The application code is provided in */app* subfolder.

1. Start a terminal in your environment
2. If you haven't done already, download the files with the following command 

*git clone https://github.com/robipozzi/container-kubernetes-tutorials.git*

3. cd to *container-kubernetes-tutorials/3-container_volumes*
4. Run *app-run.sh* script to launch the application

You can now test the application by running *http://localhost:8082* .

### 1.1. Running application as a Docker container
A *Dockerfile* is provided to build and run the application as a Docker container. 
First you need to build the container image by running the *docker build* command as follows:

*docker build -t robipozzi/rpozzi-restaurants:1.2 .*

#### 1.1.1 Running Docker with no volume attached
Once the container image is built, run the container with the following standard Docker run command, where */tmp/upload* is a folder inside the container filesystem (*docker-run-no-volume.sh* script is provided to automate this task avoiding errors): 

*docker run -it --name restaurant-app -p 8083:8082 -e UPLOAD_DIR=/tmp/upload -e EXPOSED_PORT=8083 robipozzi/rpozzi-restaurants:1.2*

Explore application behavior by opening a web browser with URL *http://localhost:8083* and doing the following steps:
1. upload some files from your local filesystem to *<UPLOAD_DIR>* folder by using the *Browse* and then *Upload your files* buttons
2. call *http://localhost:8083/list* endpoint that will show the content of *<UPLOAD_DIR>* folder: you will see the files you uploaded in the step before
3. stop the container by issuing CTRL+C in the terminal windows
4. run the container again, with the same docker run command as before (or run *docker-run-no-volume.sh* script)
5. call *http://localhost:8083/list* endpoint: since the container has been launched without any volume, the container filesystem is ephemeral and you will not see any file listed
6. stop the container by issuing CTRL+C in the terminal windows

#### 1.1.2. Running Docker with volumes
To test how Docker can manage persistence through the usage of volumes, run a Docker container with the following standard Docker run command (change */Users/robertopozzi/temp/upload* to a folder available on your workstation), where */tmp/upload* is a folder inside the Docker container filesystem (*docker-run-with-volume.sh* script is provided to automate this task avoiding errors): 

*docker run -it --name restaurant-app -p 8083:8082 -v /Users/robertopozzi/dev/robipozzi-kubernetes/container-kubernetes-tutorials/3-container_volumes/app/config:/config -v /Users/robertopozzi/temp/upload:/tmp/upload -e CONFIG_DIR=/config -e UPLOAD_DIR=/tmp/upload -e EXPOSED_PORT=8083 robipozzi/rpozzi-restaurants:1.2*

Now run again the following steps:
1. upload some files from your local filesystem to *<UPLOAD_DIR>* folder by using the *Browse* and then *Upload your files* buttons
2. call *http://localhost:8083/list* endpoint that will show the content of *<UPLOAD_DIR>* folder: you will see the files you uploaded in the step before
3. stop the container by issuing CTRL+C in the terminal windows
4. run the container again, with the same docker run command as before (or run *docker-run-with-volume.sh* script)
5. call *http://localhost:8083/list* endpoint: since the container now uses a volume and mounts a local folder to the container filesystem you will now see the files previously uploaded
6. stop the container by issuing CTRL+C in the terminal windows

### 1.2. Running application as a cri-o container
The same *Dockerfile* can be used to build and run the application as a cri-o container. 
First you need to build the container image by running the *buildah bud* command as follows:

*buildah bud -t robipozzi/rpozzi-restaurants:1.2 .*

#### 1.2.1. Running cri-o containers with no volume attached
Once the container image is built, the same exact scenarios as described in the Docker paragraph can be tested by starting container with the standard *podman run* command, as follows (this command will run the container with no volumes attached): 

*podman run -it --name restaurant-app -p 8083:8082 -e UPLOAD_DIR=/tmp/upload -e EXPOSED_PORT=8083 robipozzi/rpozzi-restaurants:1.2*

#### 1.2.2 Running cri-o containers with volumes
Once you have finished the tests, stop the container by issuing CTRL+C in the terminal windows and then issue the following command to run the container with volumes attached:

*podman run -it --name restaurant-app -p 8083:8082 -v /Users/robertopozzi/dev/robipozzi-kubernetes/container-kubernetes-tutorials/3-container_volumes/app/config:/config -v /Users/robertopozzi/temp/upload:/tmp/upload -e CONFIG_DIR=/config -e UPLOAD_DIR=/tmp/upload -e EXPOSED_PORT=8083 robipozzi/rpozzi-restaurants:1.2*

As it can be seen, the same exact construct used with Docker can be applied by using Buildah and Podman.

## 2. Automation scripts available
A *Dockerfile* is provided to build and run the application as a container; plain standard OCI compliant commands (either Docker or Buildah/Podman) can be used to build the container image, push the container image to Docker Hub repository and run it as a container, the following scripts are provided for convenience:

### 2.1 Docker
* *docker-build.sh* - it can be launched to build the Docker image; the script removes the Docker image from the local registry and re-builds it.
* *docker-run-no-volume.sh* - it can be launched to run Docker container locally with no Docker volumes attached.
* *docker-run-with-volume.sh* - it can be launched to run Docker container locally with Docker volumes attached. 
* *docker-push.sh* - it can be launched to push the Docker image to Docker Hub. You will need to modify *$DOCKER_IMAGE* parameter in *setenv.sh* appropriately to push to the correct Docker Hub repository.

All the relevant parameters are externalized and can be changed in *setenv-docker.sh* script.

### 2.2 Buildah / Podman
* *container-build.sh* - it can be launched to build the container image using Buildah utility; the script removes the container image from the local registry and re-builds it.
* *container-run-no-volume.sh* - it can be launched to run container locally with no volumes attached, using Podman utility; the script removes running container and runs a fresh container instance.
* *docker-run-with-volume.sh* - it can be launched to run container locally with volumes attached, using Podman utility; the script removes running container and runs a fresh container instance.
* *container-push.sh* - it can be launched to push the container image to Docker Hub. You will need to modify *$CONTAINER_IMAGE_NAME* parameter in *setenv.sh* appropriately to push to the correct Docker Hub repository.

All the relevant parameters are externalized and can be changed in *setenv.sh* script.