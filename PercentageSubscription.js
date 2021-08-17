const Subscription = require('./Subscription')

class PercentageSubscription extends Subscription {
    constructor(percentage) {
        super();

        this.percentage = percentage
    }

    getPercentage() {
        return this.percentage
    }

    getPayment(sales) {
        return sales
            .map(s => s.getTotalCost() * this.percentage / 100)
            .reduce((p1,p2) => p1 + p2, 0)
    }
}

module.exports = PercentageSubscription
