const setPrototypeOf = require('setprototypeof')

class Middleware {
    constructor() {

    }

    static init(app) {
        return function clutterInit(req, res, next) {
            if (app.enabled('x-powered-by')) res.setHeader('X-Powered-By', 'Clutter');
            req.res = res;
            res.req = req;
            req.next = next;
            //setPrototypeOf(req, app.request)
            //setPrototypeOf(res, app.response)
            res.locals = res.locals || Object.create(null);
            next(req, res);
        };
    }
}

exports = module.exports = Middleware