#!/bin/bash
set -e
mkdir -p ./src/pb_generated/todos
echo "Compiling protobuf definitions..."
protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --ts_out=service=grpc-web:./src/pb_generated/todos \
    --js_out=import_style=commonjs,binary:./src/pb_generated/todos \
    --proto_path=../proto \
    todos.proto

# https://github.com/improbable-eng/grpc-web/issues/96#issuecomment-523448731
for f in ./src/pb_generated/todos/*.js
do
    echo '/* eslint-disable */' | cat - "${f}" > temp && mv temp "${f}"
done