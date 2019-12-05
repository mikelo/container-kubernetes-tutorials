# Kubernetes Persistent Volumes tutorial
This tutorial provides the container image and the relative yaml configuration to deploy an application to Kubernetes (https://kubernetes.io/) and explore how PersistentVolumes and PersistentVolumeClaims can be used.

The tutorial builds on previous container tutorial and uses **robipozzi/rpozzi-restaurants:1.2** container image, which has been built in ![Container volumes tutorial](https://github.com/robipozzi/container-kubernetes-tutorials/tree/master/3-container_volumes); the container image is available in Docker Hub (*https://hub.docker.com/*) publicly accessible registry (see *https://hub.docker.com/r/robipozzi/rpozzi-restaurants/tags*).

## Prerequisites
Prerequisites for the execution of this tutorial are described in ![Kubernetes basics tutorial - Prerequisites](https://github.com/robipozzi/container-kubernetes-tutorials/tree/master/5-k8_basics#Prerequisites) paragraph; please have a look at the info available in *Use IBM Kubernetes Service (IKS)* section on how to create, connect and authenticate to a Kubernetes *"vanilla"* cluster and/or *Use Red Hat OpenShift (RHOCP)* section on how to create, connect and authenticate to a RedHat OpenShift environment before starting this tutorial.

## 1. Application demo scenario
The present GitHub repository provides all the configuration files and scripts needed to deploy and test the Restaurant Management application to Kubernetes, in the version previously developed in ![Container volumes tutorial](https://github.com/robipozzi/container-kubernetes-tutorials/tree/master/3-container_volumes).

1. Start a terminal in your environment
2. If you havent't done already, download the files with the following command **git clone https://github.com/robipozzi/container-kubernetes-tutorials.git**
3. cd to **container-kubernetes-tutorials/7-k8_persistent_volumes** 

### 1.1. Deploy and run application on IBM Kubernetes Service
The *restaurant-app.yaml* file, provided in this repository, defines all the configurations needed to deploy and run the application in Kubernetes cluster.

Once you have authenticated to Kubernetes cluster, as described in the *IBM Kubernetes Service authentication* section, you can just issue the following command

**kubectl apply -f restaurant-app.yaml**

Once the command has run successfully you can open a browser to **http://<PUBLIC_IP>:31116** url and test the application, where <PUBLIC_IP> is the Public IP Address of your Kubernetes cluster, that you wrote down before. If you do not know <PUBLIC_IP> of your cluster, just issue the command **kubectl get node -o wide** and take note of EXTERNAL-IP.

The command above will create all the necessary Kubernetes objects in your cluster:

### Kubernetes Deployment
A Deployment is a Kubernetes object used to describe the characteristics and the desired state of an application component.
Please refer to Kubernetes documentation *https://kubernetes.io/docs/concepts/workloads/controllers/deployment/* for more information and details.

The *restaurant-app.yaml* provided in this repository defines the Deployment for Restaurant Management application:
* The Deployment name **restaurant-pv**
* The Desired State **replicas: 1**, meaning that just one instance of the Pod must be running at all time
* The **matchLabels** section defines which Pods will be managed by this Deployment object, the labels must exactly match the ones defined in the **labels** array in *template:metadata* section 
* The container image **robipozzi/rpozzi-restaurants:1.2** the container in the Pod will be instantiated from; the image will be pulled from Docker Hub
* Notice how an environment variable named **UPLOAD_DIR** can be passed to container

[TODO] <image placeholder>

### Kubernetes Service
A Service is the abstraction through which Kubernetes manages the incoming requests, routing to the appropriate Pods; it manages this by labelling Pods and by using label selectors so that a Service knows to which Pods to route. 
Please refer to Kubernetes documentation *https://kubernetes.io/docs/concepts/services-networking/service/* for more information.

There are different types of Service in Kubernetes:
* ClusterIP - it allows communications within the cluster only
* NodePort - it exposes a port on every Worker Nodes in the cluster and allows for external communication

The *restaurant-app.yaml* provided in this repository defines a NodePort type of Service for Restaurant Management application, exposing port 31114 on the Kubernetes cluster nodes:
* The Service name **restaurant-pv-service**
* The **selector** section must exactly match the labels defined in the **labels** array in *template:metadata* section of the Deployment in order for the requests to be routed to the right Pods
* The type of Service, which is **NodePort**
* The **port** defines the port through which the Service can be accessed by other Service, internally
* The **targetPort** must match the port the container image exposes
* The **NodePort** defines the port exposed on the cluster Worker nodes to allow external communication

[TODO] <image placeholder>

### Kubernetes Ingress
An Ingress is a Kubernetes object that manages external access to the services in a cluster, typically HTTP/HTTPS. Ingress exposes HTTP and HTTPS routes from outside the cluster to services within the cluster, traffic routing is controlled by rules defined on the Ingress resource.
Please refer to Kubernetes documentation *https://kubernetes.io/docs/concepts/services-networking/ingress/* for more information.

The *restaurant-app.yaml* provided in this repository defines an Ingress for Restaurant Management 
* The Ingress name **restaurant-pv-ingress**
* The path **/restaurant** to which the Ingress responds
* **serviceName** defines which Service the Ingress should route to, the value must match the Service name as defined before(in our case, **restaurant-pv-service**)
* **servicePort** defines which port the Service shoud be contacted on, the value must match the **port** as defined before (in our case **9992**)

[TODO] <image placeholder>

**WARNING**: the IBM Kubernetes Service has a limitation and does not support Ingress, nontheless the configuration has been provided for reference

### Kubernetes ConfigMap
[TODO]

### Kubernetes Secret
[TODO]

### 1.2. Deploy and run application on Red Hat OpenShift
The *ocp-restaurant-app.yaml* file, provided in this repository, defines all the configurations needed to deploy and run the application in OpenShift cluster.

Once you have authenticated to OpenShift cluster, as described in the *Red Hat OpenShift authentication* section, you can just issue the following command

**kubectl apply -f ocp-restaurant-app.yaml**

The command above will create the Deployment and NodePort Service objects in OpenShift cluster, allowing the application to run and be accessed.

Once the command has run successfully, open a browser and do the following:
1. Open the console and select *demo* project

![](https://github.com/robipozzi/container-kubernetes-tutorials/blob/master/6-k8_environment/images/ocp-console.png)

2. Click *Applications* link in the menu on the left and have a look at *Deployments* and *Services* links

![](https://github.com/robipozzi/container-kubernetes-tutorials/blob/master/6-k8_environment/images/ocp-application.png)

3. Navigating to *restaurant-env-service* entry, notice how the service has been configured as a NodePort service, as expected

[TODO] <image placeholder>

4. Open **http://master.ibm.demo:31115** url and test the application

5. Optionally create a Route by clicking the *Create route* link, as described in the following snapshot

[TODO] <image placeholder>

6. Confirm all the defaults to create a route and associate to the NodePort Service, click on the Hostname field that has been created and test the application again

[TODO] <image placeholder>

#### Red Hat OpenShift Route
An OpenShift route is a way to expose a service by giving it an externally-reachable hostname.
Please refer to OpenShift documentation *https://docs.openshift.com/enterprise/3.0/architecture/core_concepts/routes.html* for more detailed information.

## 2. Automation scripts available for IBM Kubernetes Service
A *restaurant-app.yaml* file is provided to deploy and run the application on IKS cluster and the following scripts are available:
* *deploy.sh* - it can be launched to deploy the application by creating all the needed Kubernetes object
* *delete.sh* - it can be launched to undeploy the application by deleting all the Kubernetes object

## 3. Automation scripts available for Red Hat OpenShift
A *ocp-restaurant-app.yaml* file is provided to deploy and run the application on OpenShift cluster and the following scripts are available:
* *ocp-deploy.sh* - it can be launched to deploy the application by creating all the needed OpenShift object
* *ocp-delete.sh* - it can be launched to undeploy the application by deleting all the OpenShift object