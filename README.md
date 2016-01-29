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

**List Products**
----
  List all products in catalog

* **URL**

  /

* **Method:**

  `GET`

   **URL Params**

   **Required:**

		None

   **Optional:**

   `limit=[integer]`
   `offset=[integer]`
   `query=[string]`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `[{ remoteId: GUID, release: Object images: Array }]`

* **Error Response:**

  * **Code:** 400 Bad Request <br />
    **Content:** `{ error : { message: "" } }`

* **Sample Call:**

  GET /

* **Notes:**

**Add Product**
----
  Add product in catalog

* **URL**

  /

* **Method:**

  `POST`

*  **URL Params**

   **Required:**

   **Optional:**

* **Data Params**

  {
		remoteId: [guid]
	}

* **Success Response:**

  * **Code:** 201 <br />
    **Content:** `{ id: integer, remoteId: GUID, images: [Array], release: Object }`

* **Error Response:**

  * **Code:** 400 Bad Request <br />
    **Content:** `{ error : { message: "Invalid request" } }`

  * **Code:** 404 Not Found <br />
    **Content:** `{ error : { message: "Product not found" } }`

* **Sample Call:**

  POST /
  { remoteId: 'asd123' }

**DELETE Product**
----
  Delete product in catalog

* **URL**

  /:id

* **Method:**

  `DELETE`

*  **URL Params**

   **Required:**

		`id=[string]`

   **Optional:**

* **Data Params**

* **Success Response:**

  * **Code:** 204 <br />

* **Error Response:**

  * **Code:** 404 Not Found <br />
    **Content:** `{ error : { message: "Product not found" } }`

* **Sample Call:**

  DELETE /:asd123123sad
