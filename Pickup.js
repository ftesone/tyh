const Shipment = require('./Shipment')

class Pickup extends Shipment {
    constructor(sale, estimatedDate) {
        super(sale);

        if (estimatedDate < sale.getDate()) {
            throw 'Estimated shipment date must be greater than or equal to sale date'
        }

        this.estimatedDate = estimatedDate
    }

    getCost() {
        return 0
    }
}

module.exports = Pickup
