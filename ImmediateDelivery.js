const Shipment = require('./Shipment')

class ImmediateDelivery extends Shipment {
    constructor(sale) {
        super(sale);

        this.estimatedDate = new Date()
        this.estimatedDate.setDate(sale.getDate().getDate() + 1)
    }

    getCost() {
        return 700
    }
}

module.exports = ImmediateDelivery
