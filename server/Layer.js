const pathRegexp = require('path-to-regexp');
const hasOwnProperty = Symbol('hasOwnProperty')

class Layer {
    constructor(path, fn, options) {
        let opts = options || {}
        this.handle = fn
        this.name = fn.name || '<anonymous>';
        this.params = undefined;
        this.path = path;
        this.regexp = pathRegexp(path, this.keys = [], opts);
        this.regexp.fast_star = path === '*'
        this.regexp.fast_slash = path === '/' && opts.end === false
    }

    handle_request(req, res, next) {
        let fn = this.handle
        if (fn.length > 3) {
            return next();
        }
        try {
            fn(req, res, next)
        } catch (err) {
            next(err)
        }
    }

    match(path) {
        let match;
        if (path != null) {
            if (this.regexp.fast_slash) {
                this.params = {}
                this.path = ''
                return true
            }
            if (this.regexp.fast_star) {
                this.params = {'0': this.decode_param(path)}
                this.path = path
                return true
            }
            match = this.regexp.exec(path)
        }
        if (!match) {
            this.params = undefined
            this.path = undefined
            return false
        }
        this.params = {};
        this.path = match[0]
        var keys = this.keys
        var params = this.params
        for (var i = 1; i < match.length; i++) {
            var key = keys[i - 1]
            var prop = key.name
            var val = this.decode_param(match[i])
            if (val !== undefined || !(this.hasOwnProperty.call(params, prop))) {
                params[prop] = val
            }
        }
        return true
    }

    decode_param(val) {
        if (typeof val !== 'string' || val.length === 0) {
            return val;
        }
        try {
            return decodeURIComponent(val);
        } catch (err) {
            if (err instanceof URIError) {
                err.message = 'Failed to decode param \'' + val + '\'';
                err.status = err.statusCode = 400;
            }
            throw err;
        }
    }

    [hasOwnProperty]() {
        return Object.prototype.hasOwnProperty
    }
}

exports = module.exports = Layer