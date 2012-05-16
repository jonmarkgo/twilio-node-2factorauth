# Twilio + node.js Two-factor auth demo

This app demonstrates how to implement responsive two-factor auth with Twilio and Node.js

If you are interested in an in-depth tutorial on how to build this functionality, please read my blog post: http://www.twilio.com/blog/2012/04/two-factor-authentication-with-node-js-and-twilio.html

To run, just clone and run the following commands:
- npm install
- export account_sid='YOUR_ACCOUNT_SID'
- export auth_token='YOUR_AUTH_TOKEN'
- export phone_number='+18881234567'
- export twilio_hostname='yourdomain.com'
- node app.js
- It will be running at http://yourdomain.com:8080/ - you can change the length of the verification code by modifying the 'codelength' variable

# License

Twilio+Node Demo Copyright (c) 2012 Jonathan Gottfried <jonmarkgo@gmail.com>

Copyright (c) 2012 Daniel Baulig <daniel.baulig@gmx.de>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.