#!/bin/bash

# Directory where your .proto files are located
PROTO_DIR="../face-proto/src"
# Directory to output generated Go files
GO_OUT_DIR="src/proto"
# Dynamic Go package prefix for your project
GO_PACKAGE_PREFIX="face.com/gateway/src/proto"


# Check if the directory exists, and create it if it doesn't
if [ ! -d "$GO_OUT_DIR" ]; then
  mkdir -p "$GO_OUT_DIR"
  echo "Directory $GO_OUT_DIR created."
else
  echo "Directory $GO_OUT_DIR already exists."
fi

generate_file_proto() {
  local proto_file=$1
  local package_name=$2

  # Run protoc with the dynamic import mapping
  protoc -I${PROTO_DIR} \
    --go_out=${GO_OUT_DIR} \
    --go_opt=paths=source_relative \
    --go_opt=M${proto_file}=${GO_PACKAGE_PREFIX}/${package_name} \
    ${PROTO_DIR}/${proto_file}
}

generate_file_proto "enrollment.proto" "proto"