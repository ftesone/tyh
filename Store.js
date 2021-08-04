class Store {
    constructor(name) {
        this.name = name
        this.sales = []
    }

    getName() {
        return this.name
    }

    addSale(sale) {
        if (!this.sales.includes(sale)) {
            this.sales.push(sale)
        }
    }

    getSales() {
        return this.sales
    }
}

module.exports = Store
