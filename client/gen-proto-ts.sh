#!/bin/bash
set -e
mkdir -p ./src/pb_generated/todos
protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --ts_out=service=grpc-web:./src/pb_generated/todos \
    --js_out=import_style=commonjs,binary:./src/pb_generated/todos \
    --proto_path=../proto \
    todos.proto