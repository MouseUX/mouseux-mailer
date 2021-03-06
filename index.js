var nodemailer = require('nodemailer');
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/contact-form', function emailSender(req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  
  if (req.body.subject) {
    return res.status(403).end('Spambot Detected');
  }
  
  if (!req.body.name || !req.body.email) {
    return res.status(500).end('אנא מלא את כל השדות הדרושים');
  }
  
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)) {
    return res.status(500).end('אימייל לא תקיו');
  }
  
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.USERNAME,
      pass: process.env.PASSWORD,
    },
  });

  var mailOptions = {
    from: process.env.USERNAME,
    to: 'info@mouseux.com',
    subject: `הודעה חדשה מ: ${req.body['first-name']}`,
    text: `שם מלא: ${req.body['first-name']}\nחברה: ${req.body.company}\nאימייל: ${req.body.email}\nהודעה: ${req.body.message}`,
    html: `<h2 style="text-align: center">הודעה חדשה מ: ${req.body['first-name']}</h2>
<p style="direction: rtl"><b>חברה:</b> ${req.body.company}<br/>
<b>אימייל:</b> ${req.body.email}<br/>
<b>הודעה:</b> ${req.body.message}</p>
<br/>
<p style="text-align: center"><b>זוהי הודעה אוטמטית, נא לא להשיב למייל זה</b></p>
<p style="text-align: center; color: red;"><b>יש להשיב למייל המצויין בהודעה</b></p>`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Error in sedning email');
      console.dir(error);
      console.dir(info);
      return res.status(500).end('שליחת הפרטים נכשלה, אנא נסה מאוחר יותר או צור איתנו קשר באמצעי אחר, תודה!');
    }
    else {
      console.log('Successful in sedning email');
      console.dir(info);
      res.status(200).end('פרטיך נשלחו בהצלחה, נציגינו יחזור אליך בהקדם, תודה!');
    };
  });
});

var server = http.createServer(app);
var PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log('\x1b[1m\x1b[32m');
  console.log('Server listening on port: ', PORT, '\x1b[39m');
});
