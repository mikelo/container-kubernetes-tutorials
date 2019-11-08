source setenv-docker.sh
echo ${cyn}Removing Docker image ...${end}
docker rmi -f $CONTAINER_IMAGE_NAME:$CONTAINER_IMAGE_VERSION
echo ${cyn}Docker image removed${end}
echo
echo ${cyn}Building Docker image ...${end}
CONTAINER_CMD_RUN="docker build -t $CONTAINER_IMAGE_NAME:$CONTAINER_IMAGE_VERSION ."
echo ${cyn}Running with:${end} ${grn}$CONTAINER_CMD_RUN${end}
$CONTAINER_CMD_RUN
echo ${cyn}Docker image built${end}