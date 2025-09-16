# Bull MQ Image Processing

This is a Node.js project that uses Bull MQ, a distributed job queue, to process images uploaded to the server. It is a simple example of how to use Bull MQ to offload tasks from the main thread of an application.

## Features

* Image uploading with Multer
* Image processing with Bull MQ
* Support for multiple image sizes (thumb, medium, large)
* Support for multiple image formats (jpg, png, webp)
* Error handling with Bull MQ's built-in retry mechanism
* Integration with Redis for storing job data

## How it works

1. A user uploads an image to the server using Multer.
2. The image is saved to a temporary directory and a job is created to process the image.
3. The job is added to a Bull MQ queue and a worker is triggered to process the image.
4. The worker processes the image and saves it to the processed directory.
5. The worker updates the job data in Redis to reflect the status of the job.
6. If the job fails, Bull MQ's retry mechanism is triggered and the job is retried after a set amount of time.

## Configuration

The project uses a `.env` file to configure the Bull MQ connection and the Redis connection. The file should contain the following variables:

* `MONGO_DB_URI`: The connection string for the MongoDB database.
* `REDIS_HOST`: The hostname of the Redis server.
* `REDIS_PORT`: The port number of the Redis server.

## Installation

To install the project, run the following commands:

