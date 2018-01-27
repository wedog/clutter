const http = require('http')
const Router = Symbol('Router')

class App {
    constructor(req, res) {
        console.log('------constructor------>')
        this.server = http.createServer((req, res) => {
            console.log('------createServer------>')
            res.statusCode = 200
            res.statusMessage = 'OK'
            res.write('1')
            res.end()
        })
    }

    listen() {
        let server = this.server
        return server.listen.apply(server, arguments)
    }

    use(fn) {
        console.log('------use------>')
        this[Router]()
        return this
    }

    [Router]() {
        console.log('------router------>')
    }
}

exports = module.exports = App;

