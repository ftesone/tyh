class SaleStatus {
    sale = null

    constructor(sale) {
        this.sale = sale
    }

    accept() {
        throw 'Status not allowed'
    }

    unaccept() {
        throw 'Status not allowed'
    }

    cancel() {
        throw 'Status not allowed'
    }

    deliver() {
        throw 'Status not allowed'
    }
}

// la idea era que las siguientes clases estén declaradas cada una en un archivo, pero node no acepta referencias circulares

class SaleStatusReceived extends SaleStatus {
    constructor(sale) {
        super(sale)
    }

    accept() {
        this.sale.discountStocks()

        return new SaleStatusAccepted(this.sale)
    }

    cancel() {
        return new SaleStatusCanceled(this.sale)
    }
}

class SaleStatusAccepted extends SaleStatus {
    constructor(sale) {
        super(sale)
    }

    unaccept() {
        this.sale.restoreStocks()

        return new SaleStatusReceived(this.sale)
    }

    deliver() {
        return new SaleStatusDelivered(this.sale)
    }
}

class SaleStatusCanceled extends SaleStatus {
    constructor(sale) {
        super(sale)
    }
}

class SaleStatusDelivered extends SaleStatus {
    constructor(sale) {
        super(sale)
    }
}

module.exports = {
    SaleStatus: SaleStatus,
    SaleStatusReceived: SaleStatusReceived,
    SaleStatusAccepted: SaleStatusAccepted,
    SaleStatusCanceled: SaleStatusCanceled,
    SaleStatusDelivered: SaleStatusDelivered,
}
