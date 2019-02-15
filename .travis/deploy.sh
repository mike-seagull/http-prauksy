#!/usr/bin/env bash
# stop the service
ssh -o LogLevel=quiet ${REMOTE_USER}@${REMOTE_SERVER} "/usr/bin/sudo systemctl stop http-prauksy"
# scp the binary
scp -o LogLevel=quiet ./bin/http-prauksy ${REMOTE_USER}@${REMOTE_SERVER}:/usr/local/bin/http-prauksy
ssh -o LogLevel=quiet ${REMOTE_USER}@${REMOTE_SERVER} "/bin/chmod +x /usr/local/bin/http-prauksy"
# start the service
ssh -o LogLevel=quiet ${REMOTE_USER}@${REMOTE_SERVER} "/usr/bin/sudo systemctl start http-prauksy"
