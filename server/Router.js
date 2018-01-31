const Layer = require('./Layer')

class Router {
    constructor() {
        this.stack = []
    }

    use(fn) {
        let layer = new Layer('/', fn)
        this.stack.push(layer)
        return this
    }

}

exports = module.exports = Router