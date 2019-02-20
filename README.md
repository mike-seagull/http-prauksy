http-prauksy
===
http/s proxy similar to apache or nginx
___
[![Build Status](https://travis-ci.com/mike-seagull/http-prauksy.svg?branch=master)](https://travis-ci.com/mike-seagull/http-prauksy)  
![alt text](auk.png "Auk")

The http server runs on 3080 and the https server runs on 3443 so that the app doesnt need to run as root

The server routes traffic from port 80 and 443 to this app using iptables

```iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3080```

```iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 3443```
#### To bundle into a binary
```npm run bundle```
#### To run
```node server.js```
