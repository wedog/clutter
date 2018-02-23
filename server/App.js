const http = require('http')
const Router = require('./Router')
const router = Symbol('router')
const Query = require('./middleware/Query');
const Middleware = require('./middleware/Middleware');

class App {
    constructor(req, res, next) {
        console.log('------constructor------>')
        /*this.server = http.createServer((req, res) => {
            console.log('------createServer------>')
            res.statusCode = 200
            res.statusMessage = 'OK'
            res.write('1')
            res.end()
        })*/
        this.handle = this.handle.bind(this)
    }

    handle(req, res, callback) {
        let router = this.$router
        if (!router) {
            console.log('----no match router----->')
            return
        }
        router.handle(req, res, callback)
    }

    listen() {
        // let server = this.server
        let server = http.createServer(this.handle)
        //server.$router = this.$router
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
            this.$router.use(Middleware.init(this));
        }
    }
}

exports = module.exports = App;

