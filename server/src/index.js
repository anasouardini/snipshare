const express = require('express');
const https = require('https');
const router = require('./routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs/promises');
const fsSync = require('fs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');

const url = require('url');
const vars = require('./vars.js');

const app = express();

app.use((req, res, next)=>{
  if(vars.serverAddress){next();}
  const fullAddress = url.format({
    protocol: req.protocol,
    host: req.headers.host
  });
  console.log(fullAddress);
  vars.serverAddress = fullAddress;
});

require('dotenv').config();
const PORT = process.env.PORT || 2001;

// midleware
app.use(helmet());
app.use(
    cors({
        origin: [vars.clientAddress],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//check auth
app.use(async (req, res, next) => {
    // console.log('res.cookie', res?.cookie);
    const token = req?.cookies?.[process.env.COOKIENAME];
    if (token) {
        // console.log(token);
        try {
            const usr = jwt.verify(token, await fs.readFile(process.cwd() + '/rsa/pub.pem'));

            req.user = usr;
        } catch (e) {
            // console.log(e);
        }
    }

    next();
});

app.use('/', router);

// 404 response
app.use('*', (req, res) => {
    // console.log('bad request 404');
    res.status(404).json({err: 'nothing to see here!'});
});

// err handling
app.use((err, erq, res) => {
    console.log(err);
    res.status(500).json({err: 'something went bad'});
});

// fire up
if(process.env.PRODUCTION){
  https.createServer(
    {cert: fsSync.readFileSync(process.env.SSL_CERT), key:fsSync.readFileSync(process.env.SSL_KEY)},
    app).listen(PORT, "0.0.0.0", () => {
      console.log(`listening on port: ${PORT} from index.js`);
    }
  );
}else{
  app.listen(PORT, "0.0.0.0", () => {
      console.log(`listening on port: ${PORT} from index.js`);
  });
}
