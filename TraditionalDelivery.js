const Shipment = require('./Shipment')

class TraditionalDelivery extends Shipment {
    constructor(sale) {
        super(sale);

        this.estimatedDate = new Date()
        this.estimatedDate.setDate(sale.getDate().getDate() + 4)
    }

    getCost() {
        return 450
    }
}

module.exports = TraditionalDelivery
