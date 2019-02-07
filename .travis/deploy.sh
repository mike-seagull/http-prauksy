#!/usr/bin/env bash
# stop the service
ssh -o LogLevel=quiet ${REMOTE_USER}@${REMOTE_SERVER} "/usr/bin/sudo systemctl stop http-proxy"
# scp the binary
scp -o LogLevel=quiet ./bin/http-proxy ${REMOTE_USER}@${REMOTE_SERVER}:/usr/local/bin/http-proxy
ssh -o LogLevel=quiet ${REMOTE_USER}@${REMOTE_SERVER} "/bin/chmod +x /usr/local/bin/http-proxy"
# start the service
ssh -o LogLevel=quiet ${REMOTE_USER}@${REMOTE_SERVER} "/usr/bin/sudo systemctl start http-proxy"
