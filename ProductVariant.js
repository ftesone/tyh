class ProductVariant {
    constructor(product, stock, size, color) {
        this.product = product
        this.stock = stock
        this.size = size
        this.color = color
    }

    getProduct() {
        return this.product
    }

    getStock() {
        return this.stock
    }

    getSize() {
        return this.size
    }

    getColor() {
        return this.color
    }

    discountStock(stock) {
        if (stock > this.stock) {
            throw "Insufficient stock"
        }

        this.stock -= stock
    }
}

module.exports = ProductVariant
