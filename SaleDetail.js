class SaleDetail {
    constructor(productVariant, quantity) {
        this.productVariant = productVariant
        this.setQuantity(quantity)
    }

    getProductVariant() {
        return this.productVariant
    }

    getQuantity() {
        return this.quantity
    }

    setQuantity(quantity) {
        if (quantity < 1) {
            throw "Quantity must be greater than zero"
        }

        this.quantity = quantity
    }
}

module.exports = SaleDetail
