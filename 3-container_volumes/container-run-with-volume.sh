source setenv.sh
echo ${cyn}Removing $CONTAINER_NAME container ...${end}
$CONTAINER_RUN_UTILITY rm -f $CONTAINER_NAME
echo ${cyn}Container removed${end}
echo
echo ${cyn}Running container ...${end}
CONTAINER_CMD_RUN="$CONTAINER_RUN_UTILITY run -it --name $CONTAINER_NAME -p $CONTAINER_PORT:8082 -v $CONFIG_DIR:$CONFIG_DIR_MOUNT -v $UPLOAD_DIR:$UPLOAD_DIR_MOUNT -e CONFIG_DIR=$CONFIG_DIR_MOUNT -e UPLOAD_DIR=$UPLOAD_DIR_MOUNT -e EXPOSED_PORT=$CONTAINER_PORT $CONTAINER_IMAGE_NAME:$CONTAINER_IMAGE_VERSION"
echo ${cyn}Running with:${end} ${grn}$CONTAINER_CMD_RUN${end}
$CONTAINER_CMD_RUN