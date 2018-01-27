const http = require('http')
const App = require('./App')
const app = new App()

app.listen(3001);

app.use(() => {
     console.log('------>')
})

/* http.createServer(function(request, response){
     response.statusCode = 200
     response.statusMessage = 'OK'
     response.write('1')
     response.end()
 }).listen(3000)*/
