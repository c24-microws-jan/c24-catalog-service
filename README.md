# c24-catalog-service

[![Build Status](https://travis-ci.org/c24-microws-jan/c24-catalog-service.svg)](https://travis-ci.org/c24-microws-jan/c24-catalog-service)
[![Dependencies](https://david-dm.org/c24-microws-jan/c24-catalog-service.svg)](https://david-dm.org/badges/shields)

This is an example of a node.js microservice

## Run it on your local node.js installation

* Run `npm install` inside the root folder to restore all packages
* Run the service with `node index.js` (or `npm start`)
* Browse to [http://localhost:3000/](http://localhost:3000/) to see the output

## Build the Docker container

~~~ sh
docker build -t c24-catalog-service .
~~~

## Run the Docker container locally

~~~ sh
docker run -it -p 3000:3000 c24-catalog-service
~~~

## Push the Docker container into the private registry

~~~ sh
docker tag c24-catalog-service 46.101.193.82:5000/c24-catalog-service:1.0.0
docker push 46.101.193.82:5000/c24-catalog-service:1.0.0
~~~
