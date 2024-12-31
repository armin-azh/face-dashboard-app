#!/bin/bash

# Directory where your .proto files are located
PROTO_DIR="../face-proto/src"
# Directory to output generated Python files
PY_OUT_DIR="src"


generate_proto() {
  local proto_file=$1
  local package_name=$2

  # Run protoc with the dynamic import mapping for Python
  protoc -I${PROTO_DIR} \
    --go_out=${PY_OUT_DIR} \
    --proto_path=${PROTO_DIR}/face.proto \
    --proto_path=${PROTO_DIR}/${proto_file} \
    ${PROTO_DIR}/${proto_file}
}

# Generate the required proto files
generate_proto "face.proto" "proto"
generate_proto "search_event.proto" "proto"