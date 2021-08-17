class Subscription {
    constructor() {
    }

    getPayment(sales) {
        throw 'Subscription not allowed'
    }
}

module.exports = Subscription
