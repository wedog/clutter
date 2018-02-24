const etag = require('etag')
const querystring = require('querystring')
const proxyaddr = require('proxy-addr');

class Utils {
    constructor() {

    }

    compileETag(val) {
        var fn;

        if (typeof val === 'function') {
            return val;
        }

        switch (val) {
            case true:
                fn = exports.wetag;
                break;
            case false:
                break;
            case 'strong':
                fn = exports.etag;
                break;
            case 'weak':
                fn = exports.wetag;
                break;
            default:
                throw new TypeError('unknown value for etag function: ' + val);
        }

        return fn;
    }

    compileQueryParser(val) {
        var fn;

        if (typeof val === 'function') {
            return val;
        }

        switch (val) {
            case true:
                fn = querystring.parse;
                break;
            case false:
                fn = newObject;
                break;
            case 'extended':
                fn = parseExtendedQueryString;
                break;
            case 'simple':
                fn = querystring.parse;
                break;
            default:
                throw new TypeError('unknown value for query parser function: ' + val);
        }

        return fn;
    }

    compileTrust(val) {
        if (typeof val === 'function') return val;

        if (val === true) {
            return function () {
                return true
            };
        }

        if (typeof val === 'number') {
            return function (a, i) {
                return i < val
            };
        }

        if (typeof val === 'string') {
            val = val.split(/ *, */);
        }

        return proxyaddr.compile(val || []);
    }
}

function parseExtendedQueryString(str) {
    return qs.parse(str, {
        allowPrototypes: true
    });
}

function newObject() {
    return {};
}

function createETagGenerator(options) {
    return function generateETag(body, encoding) {
        var buf = !Buffer.isBuffer(body)
            ? Buffer.from(body, encoding)
            : body

        return etag(buf, options)
    }
}

exports.wetag = createETagGenerator({weak: true})

exports.etag = createETagGenerator({weak: false})

exports = module.exports = Utils