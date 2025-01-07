#!/bin/bash
# wait-for-it.sh

# Wait for the service to be available on the specified host and port
HOST=$1
PORT=$2
TIMEOUT=${3:-30}

echo "Waiting for $HOST:$PORT to be available..."
while ! nc -z $HOST $PORT; do
  sleep 1
  TIMEOUT=$((TIMEOUT-1))
  if [ $TIMEOUT -le 0 ]; then
    echo "Timeout reached. $HOST:$PORT is still not available."
    exit 1
  fi
done
echo "$HOST:$PORT is now available."
