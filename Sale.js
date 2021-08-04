const SaleDetail = require('./SaleDetail')

class Sale {
    constructor(client) {
        this.client = client
        this.date = new Date()
        this.saleDetails = []
    }

    getClient() {
        return this.client
    }

    getDate() {
        return this.date
    }

    addProductVariant(productVariant, quantity) {
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
}

module.exports = Sale
