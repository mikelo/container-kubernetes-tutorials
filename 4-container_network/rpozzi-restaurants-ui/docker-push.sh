source setenv-docker.sh
docker login
docker push $CONTAINER_IMAGE_NAME:$CONTAINER_IMAGE_VERSION
