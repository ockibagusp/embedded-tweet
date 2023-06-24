const express = require('express')
const path = require('path')

const app = express()

// this * route is to serve project on different page routes except root `/`
app.get('/embedded-tweet', function (request, response) {
  response.sendFile(__dirname + '/dist/index.html')
})

app.use(express.static(__dirname + '/dist'))

app.get('/embedded-tweet/assets/:index', function (request, response) {
  let index = request.params['index']
  response.sendFile(__dirname + '/dist/assets/' + index)
})

const port = process.env.PORT || 3000
app.listen(port)
console.log(`app is listening on port: ${port}`)