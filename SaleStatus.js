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

class Received extends SaleStatus {
    constructor(sale) {
        super(sale)
    }

    accept() {
        this.sale.discountStocks()

        return new Accepted(this.sale)
    }

    cancel() {
        return new Canceled(this.sale)
    }
}

class Accepted extends SaleStatus {
    constructor(sale) {
        super(sale)
    }

    unaccept() {
        this.sale.restoreStocks()

        return new Received(this.sale)
    }

    deliver() {
        return new Delivered(this.sale)
    }
}

class Canceled extends SaleStatus {
    constructor(sale) {
        super(sale)
    }
}

class Delivered extends SaleStatus {
    constructor(sale) {
        super(sale)
    }
}

module.exports = {
    SaleStatus: SaleStatus,
    Received: Received,
    Accepted: Accepted,
    Canceled: Canceled,
    Delivered: Delivered,
}
