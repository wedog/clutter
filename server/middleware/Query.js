const Util = require('../util/Util')
const qs = require('qs')
const parseUrl = require('parseurl');

class Query {
    constructor(options) {

    }

    static query(options) {
        let opts = Util.merge({}, options)
        var queryParse = qs.parse;

        if (typeof options === 'function') {
            queryParse = options
            opts = void 0
        }
        return function query(req, res, next) {
            if (!req.query) {
                let val = parseUrl(req).query
                req.query = queryParse(val, opts)
            }
            next()
        };
    }
}

exports = module.exports = Query