source setenv-docker.sh
echo ${cyn}Removing $CONTAINER_NAME Docker container ...${end}
docker rm -f $CONTAINER_NAME
echo ${cyn}Docker container removed${end}
echo
echo ${cyn}Running Docker container ...${end}
CONTAINER_CMD_RUN="docker run -it --name $CONTAINER_NAME -p $CONTAINER_PORT:8083 -v $UPLOAD_DIR:$UPLOAD_DIR_MOUNT -e UPLOAD_DIR=$UPLOAD_DIR_MOUNT -e KEYSTORE_PASSWORD=mycredentials -e EXPOSED_PORT=$CONTAINER_PORT $CONTAINER_IMAGE_NAME:$CONTAINER_IMAGE_VERSION"
echo ${cyn}Running with:${end} ${grn}$CONTAINER_CMD_RUN${end}
$CONTAINER_CMD_RUN