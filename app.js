var express = require('express');
var app = express();

/**
 * Various vars
 */
var crypto       = require('crypto');
var async        = require('async');
var _json        = require(__dirname + '/lib/escaped-json');
var bodyParser = require('body-parser');

/**
 * Drone vars
 */
var drone_ip = '192.168.43.134';
var autonomy = require('ardrone-autonomy');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

/**
 * This is the endpoint WC needs to post through a webhook to,
 * when a new sale has been made.
 */
app.post('/fly', function (req, res) {
    var webhookBody      = req.body || {};
    var webhookSignature = req.headers['x-wc-webhook-signature'];

    console.log('Receiving webhook...');

    if (!webhookBody || !webhookSignature) {
        console.log('Access denied - invalid request');

        return res.send('access denied', 'invalid request', null, 403);
    }

    async.parallel([

        function (next ) {
            console.log('thread 1... could do stuff like turn on lights/music');
            return next();
        }

    ], function (err) {

        console.log('thread 2... doing the drone stuff');

        var secret    = 'drone'
        var data      = _json.stringify(webhookBody);
        var signature = crypto.createHmac('sha256', secret).update(data).digest('base64');

        // Check the webhook signature
        if (webhookSignature !== signature) {
            console.log('Access denied - invalid signature');

            return res.send('access denied', 'invalid signature', null, 403);
        }

        console.log(webhookBody);
        console.log('Webhook received successfully!');

        var line_items = webhookBody.order.line_items;
        var item1 = line_items[0];

        /**
         * Determine product position based on name.
         * At the moment, position is how far RIGHT it should go.
         * Alternatively the product could have some meta for it's coordinates.
         */
        var item_position;
        switch(item1.name) {
            case "Indiana Jones":
                item_position = 1;
                break;
            case "Jaws":
                item_position = 2;
                break;
            case "Mario":
            default:
                item_position = 3;
                break;
        }

      /**
       * Determine the customer location by country.
       */
      var country_position;
      switch(webhookBody.order.billing_address.country) {
          case "AU":
            country_position = 4;
            break;
          case "US":
            country_position = 5;
            break;
          case "ZA":
          default:
            country_position = 6;
            break;
      }

      console.log('Drone taking off in 2.5 seconds...');
        setTimeout(function() {
            /**
             * Plan the mission. Take flight. Go!
             */
            var mission  = autonomy.createMission({
                ip: drone_ip
            });

            mission.takeoff()
                .zero()
                .wait(2500)

            /**
             * The drone can go too fast and not very accurate if
             * given a large meter distance to travel, so we try
             * split it up into actions of 1m.
             *
             * After going to the item, it will wait for a couple seconds
             * and then land. The drone will wait there for 10 seconds,
             * before taking off again and going to the customer.
             */
            var i;
            for (i=0; i < item_position; i++) {
                mission.right(1);
            }
            mission.hover(2000)
                .land()
                .wait(10000)
                .takeoff()
                .zero()

            /**
             * We determine customer location by country above,
             * and go back that way. This could alternatively
             * be determined by coordinates.
             */
            var o;
            for (o=0; o < country_position; o++) {
                mission.left(1);
            }

            mission.hover(2000)
                .land();

            // mission go!
            mission.run(function (err, result) {
                if (err) {
                    console.trace("Oops, something bad happened: %s", err.message);
                    mission.client().stop();
                    mission.client().land();
                } else {
                    console.log("Mission success!");
                    process.exit(0);
                }
            });
        }, 2500);

        return res.json({
            success: true
        });
    });
});

/**
 * Home page.
 */
app.get('/', function (req, res) {
    res.send("Bryce is flying!");
});

/**
 * Start the server.
 */
var server = app.listen(80, function () {
  var host = '127.0.0.1';
  var port = '80';

  console.log('WooDrone listening at http://%s:%s', host, port);
});