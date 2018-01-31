const http = require('http')
const App = require('./App')
const app = new App()

app.use(() => {
    console.log('------>')
})

app.listen(3001);

/* http.createServer(function(request, response){
     response.statusCode = 200
     response.statusMessage = 'OK'
     response.write('1')
     response.end()
 }).listen(3000)*/
