# grpc_todo_app
Same old todo app but with shiny new GRPC

My attempt to learn gRPC. This project uses [gRPC-Java](https://github.com/grpc/grpc-java) as backend and React + TypeScript as frontend while using [Envoy proxy](https://www.envoyproxy.io/docs/envoy/v1.21.0/) for interacting with backend. I tried using [grpc-web](https://github.com/grpc/grpc-web/) but I could not make it work with TypeScript `¯\_(ツ)_/¯` hence using one from https://github.com/improbable-eng/grpc-web.

![CI](https://github.com/infynyxx/grpc_todo_app/workflows/CI/badge.svg)

Requirements:
-----

* JDK >=11
* Maven >=3.6.x
* Docker and docker-compose
* Node and yarn

Running:
-----

First build java package from `grpc-todo` directory:

```
$ mvn package
```

This will create a local docker image of the backend app tagged as `localhost/grpc-todo-app`.

Then, from root directory, run docker-compose:

```
$ docker-compose up
```

This will start `gRPC web proxy` and java backend server.

Now, from `client` directory, start webpack server:

```
$ yarn install && yarn start
```

If everything is working as expected, yarn should start a browser window @ http://localhost:3000/ and you should see the app.

Current issues:
---

* ~~There's a weird bug while deleting a todo item. I think it's related to how protobuf message is serialized and React's diff algorithm deals with it. Probably, better to create non protobuf object for states and props.~~
* Need to write tests both on server and client sides
* Figure out how gRPC-java handles backpressure
* Instrumentation and observability are missing :|
* Retryable errors in client side. As of right now, only gRPC-java has experimental support for [retries](https://grpc.github.io/grpc-java/javadoc/io/grpc/ManagedChannelBuilder.html#enableRetry--) via [service config](https://grpc.github.io/grpc-java/javadoc/io/grpc/ManagedChannelBuilder.html#defaultServiceConfig-java.util.Map-). Check this [thread](https://gitter.im/grpc/grpc?at=5e4e9c5d89f30b12651becb7) for more information.

