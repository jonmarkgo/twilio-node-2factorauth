/*jslint unparam: true, node: true, sloppy: true, nomen: true, maxerr: 50, indent: 2 */
var io = require('socket.io'), express = require('express'), util = require('util'), app = express.createServer(), connect = require('express/node_modules/connect'), parseCookie = connect.utils.parseCookie, MemoryStore = connect.middleware.session.MemoryStore, store, TwilioClient = require('twilio').Client, Twiml = require('twilio').Twiml;

var client = new TwilioClient(process.env.account_sid,process.env.auth_token, process.env.twilio_hostname); //Enter your credentials and hostname here
var phone = client.getPhoneNumber(process.env.phone_number); //Enter your outgoing phone # here

app.configure(function () {
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.cookieParser());
  app.use("/bootstrap", express['static'](__dirname + '/bootstrap'));
  app.use(express.session({
    secret: 'secret',
    key: 'express.sid',
    store: store = new MemoryStore()
  }));
});

app.get('/', function (req, res) {
  res.render('index', {username: req.session.username, password: req.session.password, phonenumber: req.session.phonenumber});
});

app.listen(8080);

io.listen(app).set('authorization', function (data, accept) {
  if (!data.headers.cookie) {
    return accept('No cookie transmitted.', false);
  }
  data.cookie = parseCookie(data.headers.cookie);
  data.sessionID = data.cookie['express.sid'];

  store.load(data.sessionID, function (err, session) {
    if (err || !session) {
      return accept('Error', false);
    }
    data.session = session;
    return accept(null, true);
  });
}).sockets.on('connection', function (socket) {
  var sess = socket.handshake.session;
  socket.log.info('a socket with sessionID', socket.handshake.sessionID, 'connected');
  socket.on('set username', function (val) {
    sess.reload(function () {
      sess.username = val;
      sess.touch().save();
    });
  });
  socket.on('set password', function (val) {
    sess.reload(function () {
      sess.password = val;
      sess.touch().save();
    });
  });
  function getDigit(num, verify) {
    var getDigits = new Twiml.Gather(null, {numDigits: 1});
    getDigits.on('gathered', function (reqParams, resp) {
      if (reqParams.Digits === String(verify).charAt(num)) {
        socket.emit('correct code', num);
        if (num < (String(verify).length - 1)) {
          resp.append(getDigit(num + 1, verify));
        } else {
          socket.emit('verified', 1);
          resp.append(new Twiml.Say('Thank you, good bye!'));
        }
      } else {
        resp.append(new Twiml.Say('You have entered the wrong code, please try logging in again.')).append(new Twiml.Hangup());
        socket.emit('wrong code', num);
      }
      resp.send();
    });
    return getDigits;
  }

  socket.on('init phone', function (val) {
    sess.reload(function () {
      sess.phonenumber = val;
      var codelength = 4; //# of digits in the verification code
      sess.verify = Math.floor(Math.random() * (Math.pow(10, (codelength - 1)) * 9)) + Math.pow(10, (codelength - 1));
      sess.touch().save();
      socket.emit('newcode', sess.verify);
      phone.setup(function () {
        phone.makeCall(val, null, function (call) {
          call.on('answered', function (reqParams, res) {
            console.log('Call answered');
            var intro = new Twiml.Say('Hello, ' + sess.username + '. Please enter your ' + String(sess.verify).length + ' digit verification code!');
            res.append(getDigit(0, sess.verify).append(intro));
            res.send();
          });

          call.on('ended', function (reqParams) {
            console.log('Call ended');
          });
        });
      });
    });
  });
});