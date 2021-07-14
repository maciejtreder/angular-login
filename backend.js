const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const join = require('path').join;
 
const privateKey = fs.readFileSync(path.join(__dirname,'private.key'));
const publicKey = fs.readFileSync(path.join(__dirname,'public.key'));
 
const app = express();
 
app.use(cors({
   origin: 'http://localhost:4200',
   credentials: true
}));

app.use(express.json());

function generateAuthToken() {
    return jwt.sign({
        name: "Foo Bar",
        privileges: ["see_secret"]
    }, privateKey, {algorithm: 'RS256'});
 }
  
 app.post('/login', (req, res) => {
     if (req.body.login ==='foo') {
        res.send({authToken: generateAuthToken()});
     } else {
         res.sendStatus(401);
     }
 });
  
 app.get('/secret', (req, res) => {
    const token = req.headers.auth;
    if (!!token) {
        let decoded = jwt.verify(token, publicKey);
        if (decoded.privileges.indexOf('see_secret') >= 0) {
            res.send({data: "Reactive forms are awesome!"});
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(401);
    }
 });
 
 const distFolder = join(
    process.cwd(),
    'dist/angular-login'
 );
  app.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
 );
  app.use('/', express.static(distFolder));
 app.use('/**', express.static(distFolder));
  
 const port = process.env.PORT || 8080;
app.listen(port, () => {
 console.log(
   `Backend is runing on: http://localhost:${port}`
 );
});

 