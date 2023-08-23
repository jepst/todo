#!/bin/sh

set -ex

# Wait for database to start
sleep 10

# Start the web app
exec flask --app app run --debug --host 0.0.0.0 --port 5000 --without-threads
