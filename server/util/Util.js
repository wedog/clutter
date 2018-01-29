const qs = require('qs')

class Util {
    constructor() {

    }

    static merge(objA, objB) {
        if (objA && objB) {
            for (let key in objB) {
                objA[key] = objB[ke]
            }
        }
        return objA
    }

    static compileQueryParser() {
        return qs.parse(str, {
            allowPrototypes: true
        });
    }
}

exports = module.exports = Util