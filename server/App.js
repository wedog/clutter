const http = require('http')
const Router = require('./Router')
const router = Symbol('router')
const Query = require('./middleware/Query')
const Middleware = require('./middleware/Middleware')
const compileETag = require('./utils').compileETag
const compileQueryParser = require('./utils').compileQueryParser
const compileTrust = require('./utils').compileTrust
const flatten = require('array-flatten')
const slice = Array.prototype.slice

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
        this.settings = {};
        this.handle = this.handle.bind(this)
        this.enabled = this.enabled.bind(this)
        this.use = this.use.bind(this)
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
        let offset = 0
        let path = '/'
        if (typeof fn !== 'function') {
            let arg = fn
            while (Array.isArray(arg) && arg.length !== 0) {
                arg = arg[0]
            }
            if (typeof arg !== 'function') {
                offset = 1
                path = fn
            }
        }
        var fns = flatten(slice.call(arguments, offset));
        this[router]()
        let $router = this.$router
        fns.forEach(function (fn) {
            if (!fn || !fn.handle || !fn.set) {
                return $router.use(path, fn);
            }
        }, this)
        return this
    }

    enabled(setting) {
        return Boolean(this.set(setting));
    }

    set(setting, val) {
        if (arguments.length === 1) {
            return this.settings[setting];
        }
        this.settings[setting] = val;
        switch (setting) {
            case 'etag':
                this.set('etag fn', compileETag(val));
                break;
            case 'query parser':
                this.set('query parser fn', compileQueryParser(val));
                break;
            case 'trust proxy':
                this.set('trust proxy fn', compileTrust(val));

                // trust proxy inherit back-compat
                Object.defineProperty(this.settings, trustProxyDefaultSymbol, {
                    configurable: true,
                    value: false
                });

                break;
        }

        return this;
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

