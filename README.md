[![Build Status](https://travis-ci.com/mike-seagull/http-prauksy.svg?branch=master)](https://travis-ci.com/mike-seagull/http-prauksy)  
<p>http/s proxy similar to apache or nginx</p>
<p>The http server runs on 3080 and the https server runs on 3443 so that the app doesnt need to run as root</p>
<p>The server routes traffic from port 80 and 443 to this app using iptables</p>
<p><code>iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3080</code></p>
<p><code>iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 3443</code></p>
<h4>To bundle into a binary</h4>
<code>npm run bundle</code>
<h4>To run</h4>
<code>node server.js</code>
