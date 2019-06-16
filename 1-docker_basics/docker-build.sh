source setenv.sh

echo ${cyn}Removing Docker image ...${end}
docker rmi -f $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_VERSION
echo ${cyn}Docker image removed${end}
echo
echo ${cyn}Building Docker image ...${end}
docker build -t $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_VERSION .
echo ${cyn}Docker image built${end}