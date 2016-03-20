WooDrone is a WooCommerce-powered drone, written in Node.js.

![WooDrone](https://cldup.com/2Fcf_clR_j.png)

To get it running, you need to get the drone to connect to your WIFI network by running a script on it through telnet to [configure WPA](https://github.com/daraosn/ardrone-wpa2).

1. Connect to drone's wifi network.
2. Run the `script/install` script for wpa2.
3. Run the `script/connect` script for wpa2.
4. DO NOT have any extra connections to the drone.
5. Run `node app.js`.
6. Finch (or other software to expose local server online) forward the node.js app.
7. Update the `order.created` webhook URL in the WC install if different.
8. Success.

Once it's connected to your WIFI network, you need to replace the `drone_ip` var in `app.js` with the IP the drone is occupying on the network.

You can now run the node app by running `node app.js` in the app's directory.

## Notes

* Calibrate before use using `node-ar-drone` client.
* AndroidAP IP is `192.168.42.1-254` or `192.168.43.1-254`.
* Might need to run NMAP to figure out drone IP… `nap -sn 192.168.43.0/24` or **Network Discovery** app.
* After nmap was: 192.168.43.134
* If using local WIFI, check router settings for Drone IP.