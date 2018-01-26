 const http = require('http')
 const bodyParser = require('body-parser')

 http.createServer(function(request, response){
     response.statusCode = 200;
     response.statusMessage = 'OK';
     response.write('1');
     response.end();
 }).listen(3000);
