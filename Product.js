class Product {
    constructor(store, name, price) {
        this.store = store
        this.name = name
        this.price = price
    }

    getStore() {
        return this.store
    }

    getName() {
        return this.name
    }

    getPrice() {
        return this.price
    }
}

module.exports = Product
