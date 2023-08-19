# syntax=docker/dockerfile:1
FROM python:3.9-slim-buster

WORKDIR /python-docker

COPY docker_entrypoint.sh docker_entrypoint.sh

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

USER nobody
CMD ./docker_entrypoint.sh