const Client = require('./Client')
const SaleDetail = require('./SaleDetail')
const SaleStatus = require('./SaleStatus')
const Shipment = require('./Shipment')

class Sale {
    constructor(client) {
        this.client = client
        this.date = new Date()
        this.saleDetails = []
        this.status = new SaleStatus.SaleStatusReceived(this)
        this.shipment = null
    }

    getClient() {
        return this.client
    }

    getDate() {
        return this.date
    }

    addProductVariant(productVariant, quantity) {
        if (!this.status instanceof SaleStatus.SaleStatusReceived) {
            throw 'Unable to add product variant'
        }

        for (let saleDetail of this.saleDetails) {
            if (saleDetail.getProductVariant() == productVariant) {
                saleDetail.setQuantity(saleDetail.getQuantity() + quantity)

                return
            }
        }

        this.saleDetails.push(new SaleDetail(productVariant, quantity))

    }

    getSaleDetails() {
        return this.saleDetails
    }

    discountStocks() {
        if (this.saleDetails.length == 0) {
            throw 'Sale has no products'
        }

        this.saleDetails.forEach(sd => sd.getProductVariant().substractStock(sd.getQuantity()))
    }

    restoreStocks() {
        if (this.saleDetails.length == 0) {
            throw 'Sale has no products'
        }

        this.saleDetails.forEach(sd => sd.getProductVariant().addStock(sd.getQuantity()))
    }

    accept() {
        if (!this.shipment) {
            throw 'Sale has no shipment'
        }

        this.status = this.status.accept()
    }

    unaccept() {
        this.status = this.status.unaccept()
    }

    cancel() {
        this.status = this.status.cancel()
    }

    deliver() {
        this.status = this.status.deliver()
    }

    setShipment(shipment) {
        if (!shipment instanceof Shipment) {
            throw 'Instance of Shipment expected'
        }

        this.shipment = shipment
    }

    getShipmentEstimatedDate() {
        if (!this.shipment) {
            return undefined
        }

        return this.shipment.getEstimatedDate()
    }

    getSubtotalCost() {
        return this.saleDetails
            .map(sd => sd.getProductVariant().getProduct().getPrice() * sd.getQuantity())
            .reduce((sd1, sd2) => sd1 + sd2, 0)
    }

    getTotalCost() {
        if (!this.shipment) {
            return undefined
        }

        return this.getSubtotalCost() + this.shipment.getCost()
    }
}

module.exports = Sale
