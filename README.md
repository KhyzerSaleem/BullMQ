# Bull MQ Image Processing

This repository demonstrates a complete backend setup using Node.js and BullMQ for managing background jobs, including job queues, delayed jobs, retries, and dead-letter queues (DLQs). It is designed for developers who want to learn how to handle asynchronous tasks in Node.js efficiently.

Table of Contents

Introduction

- Technologies Used
- Project Features
- Getting Started
- Understanding BullMQ
- Job Lifecycle
- Dead-Letter Queue (DLQ)
- Example Usage
- Future Improvements

Introduction
In modern backend development, handling long-running or resource-intensive tasks synchronously can block the main thread and slow down your application.
This project demonstrates how to offload such tasks into queues using BullMQ, a robust Redis-based job queue for Node.js.

Key use-cases:

- Sending emails asynchronously
- Image processing
- Data importing/exporting
- Any long-running task

Technologies Used

- Node.js – JavaScript runtime
- Express.js – Backend API framework
- BullMQ – Queue library for Node.js using Redis
- Redis – In-memory data store (required for BullMQ)
- Nodemon – Development tool for auto-restarting server

## Features

- Job Queues: Add tasks to a queue for background processing.
- Job Processing: Process jobs asynchronously without blocking the main thread.
- Retries: Automatic retries if a job fails.
- Delayed Jobs: Schedule jobs to run after a delay.
- Dead-Letter Queue (DLQ): Capture failed jobs for inspection and reprocessing.
- Job Event Handling: Track job progress, completion, or failure in real-time.
- Error Logging: Store failed jobs with error details.

## How it works

1. A user uploads an image to the server using Multer.
2. The image is saved to a temporary directory and a job is created to process the image.
3. The job is added to a Bull MQ queue and a worker is triggered to process the image.
4. The worker processes the image and saves it to the processed directory.
5. The worker updates the job data in Redis to reflect the status of the job.
6. If the job fails, Bull MQ's retry mechanism is triggered and the job is retried after a set amount of time.

## Configuration

The project uses a `.env` file to configure the Bull MQ connection and the Redis connection. The file should contain the following variables:

- `MONGO_DB_URI`: The connection string for the MongoDB database.
- `REDIS_HOST`: The hostname of the Redis server.
- `REDIS_PORT`: The port number of the Redis server.

## Installation

To install the project, run the following commands:
