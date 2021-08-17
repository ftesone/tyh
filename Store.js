class Store {
    constructor(name, subscription) {
        this.name = name
        this.subscription = subscription
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

    getSubscriptionPayment() {
        return this.subscription.getPayment(this.sales.filter(s => s.isDelivered()))
    }
}

module.exports = Store
