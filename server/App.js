const http = require('http')
const Router = require('./Router')
const router = Symbol('router')
const Query = require('./middleware/Query');

class App {
    constructor(req, res, next) {
        console.log('------constructor------>')
        this.server = http.createServer((req, res) => {
            console.log('------createServer------>')
            res.statusCode = 200
            res.statusMessage = 'OK'
            res.write('1')
            res.end()
        })
        //this.handle(req, res, next)
    }

    handle(req, res, callback) {
        let router = this.$router
        router.handle(req, res, callback)
    }

    listen() {
        let server = this.server
        return server.listen.apply(server, arguments)
    }

    use(fn) {
        console.log('------use------>')
        this[router]()
        return this
    }

    [router]() {
        if (!this.$router) {
            this.$router = new Router()
            console.log('------router------>')
            this.$router.use(Query.query());
        }
    }
}

exports = module.exports = App;

