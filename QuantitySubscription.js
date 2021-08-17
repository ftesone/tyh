const Subscription = require('./Subscription')

class QuantitySubscription extends Subscription {
    constructor(monthlyPayment, monthlySalesLimit, additionalSalesPayment) {
        super();

        this.monthlyPayment = monthlyPayment
        this.monthlySalesLimit = monthlySalesLimit
        this.additionalSalesPayment = additionalSalesPayment
    }

    getMonthlyPayment() {
        return this.monthlyPayment
    }

    getMonthlySalesLimit() {
        return this.monthlySalesLimit
    }

    getAdditionalSalesPayment() {
        return this.additionalSalesPayment
    }

    getPayment(sales) {
        let payment = this.monthlyPayment

        if (sales.length > this.monthlySalesLimit) {
            payment += (sales.length - this.monthlySalesLimit) * this.additionalSalesPayment
        }

        return payment
    }
}

module.exports = QuantitySubscription
