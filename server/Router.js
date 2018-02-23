const Layer = require('./Layer')
const parseUrl = require('parseurl')

class Router {
    constructor() {
        this.stack = []
        this.handle = this.handle.bind(this)
        this.next = this.next.bind(this)
        this.trim_prefix = this.trim_prefix.bind(this)
    }

    use(fn) {
        let layer = new Layer('/', fn)
        this.stack.push(layer)
        return this
    }

    handle(req, res, out) {
        let idx = 0
        let paramcalled = {}
        let protohost = this.getProtohost(req.url) || ''
        req.next = this.next
        this.next(req, res, out, idx, paramcalled)
    }

    next(req, res, out, idx, paramcalled, err) {
        let match
        let layer
        let route
        var layerError = err === 'route'
            ? null
            : err
        let path = this.getPathname(req)
        while (match !== true && idx < this.stack.length) {
            layer = this.stack[idx++]
            match = this.matchLayer(layer, path)
            route = layer.route
            if (!route) {
                continue
            }
            let method = req.method
            let has_method = route._handles_method(method)
        }
        if (match !== true) {
            console.log(11)
            return;
            //return done(layerError);
        }
        let trim_prefix = this.trim_prefix
        let layerPath = layer.path
        this.process_params(layer, paramcalled, req, res, function (err) {
            if (err) {
                return this.next(layerError || err)
            }
            if (route) {
                return layer.handle_request(req, res, next)
            }
            trim_prefix(layer, layerError, layerPath, path, req, res)
        })
    }

    process_params(layer, called, req, res, done) {
        // let params = this.params
        let keys = layer.keys
        if (!keys || keys.length === 0) {
            return done()
        }
    }

    trim_prefix(layer, layerError, layerPath, path, req, res) {
        layer.handle_request(req, res, this.next)
    }

    getProtohost(url) {
        if (typeof url !== 'string' || url.length === 0 || url[0] === '/') {
            return void 0
        }
        let searchIndex = url.indexOf('?')
        let pathLength = searchIndex !== -1
            ? searchIndex
            : url.length
        let fqdnIndex = url.substr(0, pathLength).indexOf('://')
        return fqdnIndex !== -1
            ? url.substr(0, url.indexOf('/', 3 + fqdnIndex))
            : void 0
    }

    getPathname(req) {
        try {
            return parseUrl(req).pathname
        } catch (err) {
            return undefined
        }
    }

    matchLayer(layer, path) {
        try {
            return layer.match(path)
        } catch (err) {
            return err
        }
    }

    appendMethods(list, addition) {
        for (let i = 0; i < addition.length; i++) {
            let method = addition[i]
            if (list.indexOf(method) === -1) {
                list.push(method)
            }
        }
    }

}

exports = module.exports = Router