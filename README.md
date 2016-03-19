WooDrone is a WooCommerce-powered drone, written in Node.js.

![WooDrone](https://cldup.com/2Fcf_clR_j.png)

To get it running, you need to get the drone to connect to your WIFI network by running a script on it through telnet to [configure WPA](https://github.com/daraosn/ardrone-wpa2).

Once it's connected to your WIFI network, you need to replace the `drone_ip` var in `app.js` with the IP the drone is occupying on the network.

You can now run the node app by running `node app.js` in the app's directory.