const Sale = require('./Sale')

class Shipment {
    constructor(sale) {
        this.sale = sale
        this.estimatedDate = null
    }

    getCost() {
        throw 'Shipment cost undefined'
    }

    getEstimatedDate() {
        return this.estimatedDate
    }
}

module.exports = Shipment
