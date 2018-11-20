# Swagger Difference Web Site #

It's simple but it works and has been handy

* "node": "10.13.0",
* "npm": "6.4.1"

## Core Library ##

Uses the excellent `swagger-diff`

https://www.npmjs.com/package/swagger-diff

## How to run on IIS with IISNODE ##

### IIS NODE ### 

Blog: https://tomasz.janczuk.org/2011/08/hosting-nodejs-applications-in-iis-on.html
GitHub: https://github.com/tjanczuk/iisnode

### Install  ### 

* A modern windows server (2014+) with IIS installed
* URL Rewrite 2 <a href="https://www.microsoft.com/en-us/download/details.aspx?id=47337" target="_blank">https://www.microsoft.com/en-us/download/details.aspx?id=47337</a> 
* GIT for Windows <a href="https://git-scm.com/download/win" target="_blank">https://git-scm.com/download/win</a>
* NODEJS for Windows <a href="https://nodejs.org/en/download/" target="_blank">https://nodejs.org/en/download/</a>
* IISNODE <a href="https://github.com/tjanczuk/iisnode/wiki/iisnode-releases" target="_blank">https://github.com/tjanczuk/iisnode/wiki/iisnode-releases</a>

### Configure ### 

1. Make an AppPool, sadly I could only get it to run correctly running as `LocalSystem`
2. Make a web site (I use an alternate port number)
- associate it to the AppPool you made 
- change the file system path to point to the root of the git folder you pulled
3. IISReset

### Use and enjoy ### 

The site should come up on http://localhost:[port]

## Dockerization using Azure Kubernetes Service (AKS) ##

### Create an AKS cluster ### 

Create an AKS cluster, see the handy video: <a href="https://www.youtube.com/watch?v=OdigLuK09NE" target="_blank">https://www.youtube.com/watch?v=OdigLuK09NE</a>

### Start Docker ### 

You will need to start docker, if you are using a container repository, login to that.

### Login to Azure ### 

```bash
az login
```

### Pull down your AKS creds ### 

```bash
pushd ~
az aks get-credentials -n $kb -g $rg
popd
```

Where ```$kb``` is the name of the K8s cluster and ```$rg``` is the resource group it is in

The reason for the pushd/popd is to make sure that your are in your ```$HOME``` directory so that the ```.kube/config``` file get created in the right place.

### Build ###

```bash
docker build -t {your repository}/swaggercompareweb .
docker push {your repository}/swaggercompareweb
```

### Run Locally ###

```bash
docker run -p 8080:8080 -d {yourname}/swaggercompareweb
```

### Deploy to your AKS ###

Deploy to Kubernetes in Azure

#### Create a deployment ####

```bash
kubectl create -f deployment.yaml
```

#### Create a service ####

```bash
kubectl create -f service.yaml
```

> You will need to wait a few minutes for AKS to provision an external IP address

#### Test your service ####

```bash
http://{external ip}:8080
```

-or-

```bash
kubectl proxy
Starting to serve on {address}:8001
```

Then browse to ```http://{address}:8001/ui``` to see the dashboard and browse to services and launch it from there.


#### Tips ####

* Shutdown the Agent VMs when not in use to save money.

## Run it on PCF ##

0 Connect to your PCF ORG and SPACE
1 do an `npm i`
2 adjust the `Manifest.yml` if you want (optional)
3 run `./pcf-it.sh`
4 Wait for push to complete and browse to the URL (route) it creates
