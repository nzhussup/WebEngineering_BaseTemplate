# Playground 4 - Theory answers

## Task 1: Set up the API workspace

Node uses an **event loop** to handle many requests without creating a new thread for each one. It runs JavaScript tasks one after another on the main thread.

A slow synchronous task blocks that thread. While it is running, Node cannot handle another request, timer, or callback. This means one expensive loop or synchronous file operation can delay every user.

Async I/O works differently. Node starts the operation, such as reading a file or waiting for a database, and continues handling other requests. When the operation finishes, its callback is placed back in the event loop. Async I/O does not make the external operation faster; it keeps the server free while waiting.

A **health endpoint** is a small route that reports whether the service is running. Our `GET /health` returns the status, API version, and process uptime. Docker, deployment platforms, load balancers, monitoring systems, and developers can call it. They use it to decide whether the service should receive traffic or needs to be restarted.
