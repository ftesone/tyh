const SaleDetail = require('./SaleDetail')
const SaleStatus = require('./SaleStatus')

class Sale {
    constructor(client) {
        this.client = client
        this.date = new Date()
        this.saleDetails = []
        this.status = new SaleStatus.SaleStatusReceived(this)
    }

    getClient() {
        return this.client
    }

    getDate() {
        return this.date
    }

    addProductVariant(productVariant, quantity) {
        if (!this.status instanceof SaleStatus.SaleStatusReceived) {
            throw "Unable to add product variant"
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
            throw "Sale has no products"
        }

        for (let saleDetail of this.saleDetails) {
            saleDetail.getProductVariant().substractStock(saleDetail.getQuantity())
        }
    }

    restoreStocks() {
        if (this.saleDetails.length == 0) {
            throw "Sale has no products"
        }

        for (let saleDetail of this.saleDetails) {
            saleDetail.getProductVariant().addStock(saleDetail.getQuantity())
        }
    }

    accept() {
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
}

module.exports = Sale
