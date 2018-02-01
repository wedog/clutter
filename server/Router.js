const Layer = require('./Layer')
const parseUrl = require('parseurl');

class Router {
    constructor() {
        this.stack = []
    }

    use(fn) {
        let layer = new Layer('/', fn)
        this.stack.push(layer)
        return this
    }

    handle(req, res, out) {
        let idx = 0
        let protohost = this.getProtohost(req.url) || ''
        req.next = next
        next()

        function next() {
            let math
            let layer
            let route
            let path = this.getPathname(req)
            while (match !== true && idx < this.stack.length) {
                layer = stack[idx++];
                match = this.matchLayer(layer, path);
                route = layer.route;
                let method = req.method;
                let has_method = route._handles_method(method);
            }
        }
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
            return layer.match(path);
        } catch (err) {
            return err;
        }
    }

    appendMethods(list, addition) {
        for (let i = 0; i < addition.length; i++) {
            let method = addition[i];
            if (list.indexOf(method) === -1) {
                list.push(method);
            }
        }
    }

}

exports = module.exports = Router