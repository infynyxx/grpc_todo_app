#!/bin/bash
set -e
mkdir -p ./src/pb_generated/todos
echo "Compiling protobuf definitions..."
./node_modules/.bin/grpc_tools_node_protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --ts_out=service=grpc-web:./src/pb_generated/todos \
    --js_out=import_style=commonjs,binary:./src/pb_generated/todos \
    --proto_path=../proto \
    todos.proto

# Convert CommonJS exports to ES modules
for f in ./src/pb_generated/todos/*.js
do
    echo '/* eslint-disable */' | cat - "${f}" > temp && mv temp "${f}"
    
    # Detect OS for sed compatibility
    if [[ "$OSTYPE" == "darwin"* ]]; then
        SED_INPLACE="sed -i ''"
    else
        SED_INPLACE="sed -i"
    fi
    
    # Convert require statements to imports
    $SED_INPLACE "s/var \([^=]*\) = require(\([^)]*\));/import * as \1 from \2;/g" "${f}"
    
    # Fix specific grpc import
    $SED_INPLACE "s/var grpc = require(\"@improbable-eng\/grpc-web\").grpc;/import { grpc } from \"@improbable-eng\/grpc-web\";/g" "${f}"

    # Handle protobuf files specifically
    if [[ "$f" == *"todos_pb.js" ]]; then
        # Replace goog.object.extend(exports, proto.todos.v1); with specific exports
        $SED_INPLACE "s/goog.object.extend(exports, proto.todos.v1);/export const Todo = proto.todos.v1.Todo;\\
export const GetTodoRequest = proto.todos.v1.GetTodoRequest;\\
export const DeleteTodoRequest = proto.todos.v1.DeleteTodoRequest;\\
export const DeleteTodoResponse = proto.todos.v1.DeleteTodoResponse;\\
export const ListTodoRequest = proto.todos.v1.ListTodoRequest;/g" "${f}"
    else
        # Convert exports.X = Y; to export { Y as X };
        $SED_INPLACE "s/exports\.\([^=]*\) = \([^;]*\);/export { \2 as \1 };/g" "${f}"
    fi
done