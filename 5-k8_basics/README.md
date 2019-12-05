# Kubernetes basics tutorial
This tutorial provides the container image and the relative yaml configuration to deploy an application to Kubernetes (https://kubernetes.io/) and explore its basic capabilities, such as Deployments and Services.

The tutorial builds on previous container tutorial and uses **robipozzi/rpozzi-restaurants:1.0** container image, which has been built in ![Container basics tutorial](https://github.com/robipozzi/container-kubernetes-tutorials/tree/master/1-container_basics); the container image is available in Docker Hub (*https://hub.docker.com/*) publicly accessible registry (see *https://hub.docker.com/r/robipozzi/rpozzi-restaurants/tags*).

## Prerequisites
To follow the instructions in this tutorial you will need either a Kubernetes and/or a Red Hat OpenShift installation; this tutorial has been developed and tested on the following two environments, for which detailed instructions on how to instantiate and operate with are provided:
* *IBM Kubernetes Service* - IBM Cloud (*https://cloud.ibm.com/*) provides a managed Kubernetes service, with a free cluster tier available.
* *Red Hat OpenShift* on IBM Bluedemos environment - IBM provides a free demo environment, available at the following URL  *https://bluedemos.com/show/2459* where a full functional Red Hat OpenShift 3.11 installation can be used for demo and test purposes.

Every Kubernetes and Red Hat OpenShift installation (either installed on-premises or instantiated on a Cloud Provider) should work but have not been tested during the development of this tutorial. 
Please refer to the specific Cloud Provider documentation for instructions on how to instantiate, authenticate and operate with Kubernetes and/or Red Hat OpenShift environments provided.

### Use IBM Kubernetes Service (IKS)
You can have access to a Kubernetes cluster installation on IBM Cloud, here following you will find the instructions to instantiate one:
1. Access IBM Cloud at *https://cloud.ibm.com/*, if you do not have an account you can create one for free
2. Go to Catalog and click *Containers* link in the menu on the left 

![](https://github.com/robipozzi/container-kubernetes-tutorials/blob/master/5-k8_basics/images/catalog.png)

3. Click on Kubernetes Service tile and then click *Create* button

![](https://github.com/robipozzi/container-kubernetes-tutorials/blob/master/5-k8_basics/images/create-button.png)

4. Select the Free plan (you will be able to experiment with full functional Kubernetes cluster at no charge for 1 month), leave all the defaults and then click *Create cluster* button; this tutorial has been tested with version 1.14.7 

![](https://github.com/robipozzi/container-kubernetes-tutorials/blob/master/5-k8_basics/images/create-cluster.png)

5. Once the cluster has been created (it usually takes 10 minutes or more) go to *Access* section that will give you all the instructions to download, install and configure the command lines needed to interact with Kubernetes

![](https://github.com/robipozzi/container-kubernetes-tutorials/blob/master/5-k8_basics/images/cluster-access.png)

6. Go to *Worker Nodes* section and take not of *Public IP*, you will need it to access the application, once deployed

![](https://github.com/robipozzi/container-kubernetes-tutorials/blob/master/5-k8_basics/images/public-ip.png)

#### IBM Kubernetes Service authentication
The *Access* section of your cluster describes how to connect and authenticate to your cluster; you basically need to:
1. Start a terminal and authenticate to IBM Cloud with the following **ibmcloud login -a cloud.ibm.com -r <YOUR_CLUSTER_REGION> -g <YOUR_CLUSTER_GROUP>**
2. Authenticate to the Kubernetes cluster with the following **ibmcloud ks cluster config --cluster <YOUR_CLUSTER_ID>**
3. Export the **KUBECONFIG** environment variable as described in the *Access* section of your cluster

The specific commands, with the correct values for your cluster are in the *Access* section of your cluster.

From now on you can use **kubectl** commands to interact with the cluster.

### Use Red Hat OpenShift (RHOCP)
You can have access to a Red Hat OpenShift cluster installation on IBM Bluedemos environment, here following you will find the instructions to instantiate one:
1. Access IBM Bluedemos at *https://bluedemos.com/show/2459*, you will need an IBM id, if you do not have it you can create one for free by clicking the *Create and IBM id* link at the bottom of the page, as you can see in the following snapshot

![](https://github.com/robipozzi/container-kubernetes-tutorials/blob/master/5-k8_basics/images/ibm-login.png)

2. Instantiate the environment by clicking the *Reserve a demo* button (the environment can be booked for a maximum of 350 consecutive hours, then you will need to create another instance), you will receive an email with URL and password to access the environment once it will be ready

![](https://github.com/robipozzi/container-kubernetes-tutorials/blob/master/5-k8_basics/images/bluedemos.png)

3. Once the environment is ready, access to it and start all the VMs by clicking the button as shown in the snapshot below

![](https://github.com/robipozzi/container-kubernetes-tutorials/blob/master/5-k8_basics/images/start.png)

4. Once the VMs are all started, access the one named *Workstation* by just clicking on its tile.

All usernames and passwords that you will eventually need to work within the environment are available in *Lab01 Guide* that you can find in *https://bluedemos.com/show/2459* Home Page.

#### Red Hat OpenShift authentication
1. Open a Terminal and login to OpenShift cluster with the command **oc login -u admin -p Passw0rd!**
2. Switch to *default* namespace (which, in OpenShift terms, is a *project*) with the command **oc project default**

From now on you can use either **oc** or **kubectl** commands to interact with the OpenShift cluster.

## 1. Application demo scenario
The present GitHub repository provides all the configuration files and scripts needed to deploy and test the Restaurant Management application to Kubernetes, in the version previously developed in ![Container basics tutorial](https://github.com/robipozzi/container-kubernetes-tutorials/tree/master/1-container_basics).

1. Start a terminal in your environment
2. Download the files with the following command **git clone https://github.com/robipozzi/container-kubernetes-tutorials.git**
3. cd to **container-kubernetes-tutorials/5-k8_basics**

### 1.1. Deploy and run application on IBM Kubernetes Service
The *restaurant-app.yaml* file, provided in this repository, defines all the configurations needed to deploy and run the application in Kubernetes cluster.

Once you have authenticated to Kubernetes cluster, as described in the *IBM Kubernetes Service authentication* section, you can just issue the following command

**kubectl apply -f restaurant-app.yaml**

Once the command has run successfully you can open a browser to **http://<PUBLIC_IP>:31114** url and test the application, where <PUBLIC_IP> is the Public IP Address of your Kubernetes cluster, that you wrote down before. If you do not know <PUBLIC_IP> of your cluster, just issue the command **kubectl get node -o wide** and take note of EXTERNAL-IP.

The command above will create all the necessary Kubernetes objects in your cluster:

### Deployment
A Deployment is a Kubernetes object used to describe the characteristics and the desired state of an application component.
Please refer to Kubernetes documentation *https://kubernetes.io/docs/concepts/workloads/controllers/deployment/* for more information and details.

The *restaurant-app.yaml* provided in this repository defines the Deployment for Restaurant Management application:
* The Deployment name **restaurant-basic**
* The Desired State **replicas: 1**, meaning that just one instance of the Pod must be running at all time
* The **matchLabels** section defines which Pods will be managed by this Deployment object, the labels must exactly match the ones defined in the **labels** array in *template:metadata* section 
* The container image **robipozzi/rpozzi-restaurants:1.0** the container in the Pod will be instantiated from; the image will be pulled from Docker Hub

![](https://github.com/robipozzi/container-kubernetes-tutorials/blob/master/5-k8_basics/images/k8-deployment.png)

### Service
A Service is the abstraction through which Kubernetes manages the incoming requests, routing to the appropriate Pods; it manages this by labelling Pods and by using label selectors so that a Service knows to which Pods to route. 
Please refer to Kubernetes documentation *https://kubernetes.io/docs/concepts/services-networking/service/* for more information.

There are different types of Service in Kubernetes:
* ClusterIP - it allows communications within the cluster only
* NodePort - it exposes a port on every Worker Nodes in the cluster and allows for external communication

The *restaurant-app.yaml* provided in this repository defines a NodePort type of Service for Restaurant Management application, exposing port 31114 on the Kubernetes cluster nodes:
* The Service name **restaurant-basic-service**
* The **selector** section must exactly match the labels defined in the **labels** array in *template:metadata* section of the Deployment in order for the requests to be routed to the right Pods
* The type of Service, which is **NodePort**
* The **port** defines the port through which the Service can be accessed by other Service, internally
* The **targetPort** must match the port the container image exposes
* The **NodePort** defines the port exposed on the cluster Worker nodes to allow external communication

![](https://github.com/robipozzi/container-kubernetes-tutorials/blob/master/5-k8_basics/images/k8-service.png)

### Ingress
An Ingress is a Kubernetes object that manages external access to the services in a cluster, typically HTTP/HTTPS. Ingress exposes HTTP and HTTPS routes from outside the cluster to services within the cluster, traffic routing is controlled by rules defined on the Ingress resource.
Please refer to Kubernetes documentation *https://kubernetes.io/docs/concepts/services-networking/ingress/* for more information.

The *restaurant-app.yaml* provided in this repository defines an Ingress for Restaurant Management 
* The Ingress name **restaurant-basic-ingress**
* The path **/restaurant** to which the Ingress responds
* **serviceName** defines which Service the Ingress should route to, the value must match the Service name as defined before(in our case, **restaurant-basic-service**)
* **servicePort** defines which port the Service shoud be contacted on, the value must match the **port** as defined before (in our case **9990**)

![](https://github.com/robipozzi/container-kubernetes-tutorials/blob/master/5-k8_basics/images/k8-ingress.png)

**WARNING**: the IBM Kubernetes Service has a limitation and does not support Ingress, nontheless the configuration has been provided for reference

### 1.2. Deploy and run application on Red Hat OpenShift
The *ocp-restaurant-app.yaml* file, provided in this repository, defines all the configurations needed to deploy and run the application in OpenShift cluster.

Once you have authenticated to OpenShift cluster, as described in the *Red Hat OpenShift authentication* section, you can just issue the following command

**kubectl apply -f ocp-restaurant-app.yaml**

The command above will create the Deployment (see ![Kubernetes Deployment section](https://github.com/robipozzi/container-kubernetes-tutorials/tree/master/5-k8_basics#Deployment) for more details) and NodePort Service (see ![Kubernetes Service section](https://github.com/robipozzi/container-kubernetes-tutorials/tree/master/5-k8_basics#Service) for more details) objects in OpenShift cluster, allowing the application to run and be accessed.

Once the command has run successfully, open a browser and do the following:
1. Open the console and select *default* project

![](https://github.com/robipozzi/container-kubernetes-tutorials/blob/master/5-k8_basics/images/ocp-console.png)

2. Click *Applications* link in the menu on the left and have a look at *Deployments* and *Services* links

![](https://github.com/robipozzi/container-kubernetes-tutorials/blob/master/5-k8_basics/images/ocp-application.png)

3. Navigating to *restaurant-basic-service* entry, notice how the service has been configured as a NodePort service, as expected

![](https://github.com/robipozzi/container-kubernetes-tutorials/blob/master/5-k8_basics/images/ocp-service.png)

4. Open **http://master.ibm.demo:31114** url and test the application

5. Optionally create a Route by clicking the *Create route* link, as described in the following snapshot

![](https://github.com/robipozzi/container-kubernetes-tutorials/blob/master/5-k8_basics/images/ocp-service2.png)

6. Confirm all the defaults to create a route and associate to the NodePort Service, click on the Hostname field that has been created and test the application again

![](https://github.com/robipozzi/container-kubernetes-tutorials/blob/master/5-k8_basics/images/ocp-route.png)

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