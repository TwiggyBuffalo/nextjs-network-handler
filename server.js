const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const port = process.env.PORT || 3000

app.prepare()
.then(() => {
  const server = express()

  server.use(function(req, res, next) {
    var err = null;
    try {
      decodeURIComponent(req.path)
    }
    catch(e) {
      err = e;
    }
    if (err) {
      console.log(err, req.url);
      return res.redirect(['http://', req.get('Host'), '/404'].join(''));    
    }
    next();
  });

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log('Express server is now running on port: ' + port)
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})