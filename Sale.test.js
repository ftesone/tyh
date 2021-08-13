const Sale = require('./Sale')
const ProductVariant = require('./ProductVariant')
const SaleStatus = require('./SaleStatus')

const PRODUCT_VARIANT_1_INITIAL_STOCK = 10, PRODUCT_VARIANT_2_INITIAL_STOCK = 20
let sale, productVariant1, productVariant2

beforeEach(() => {
    sale = new Sale('client')
    productVariant1 = new ProductVariant('product1', PRODUCT_VARIANT_1_INITIAL_STOCK, 'M', 'black')
    productVariant2 = new ProductVariant('product2', PRODUCT_VARIANT_2_INITIAL_STOCK, 'L', 'white')
})

test('Add product variants to sale', () => {
    sale.addProductVariant(productVariant1, 1)
    sale.addProductVariant(productVariant2, 2)
    sale.addProductVariant(productVariant1, 2)

    let hasProductVariants = 0
    let totalProducts = 0
    for (let saleDetail of sale.getSaleDetails()) {
        if (saleDetail.getProductVariant() == productVariant1 || saleDetail.getProductVariant() == productVariant2) {
            hasProductVariants += 1

            if (saleDetail.getProductVariant() == productVariant1) {
                expect(saleDetail.getQuantity()).toBe(3)
            } else if (saleDetail.getProductVariant() == productVariant2) {
                expect(saleDetail.getQuantity()).toBe(2)
            }
        }

        totalProducts += saleDetail.getQuantity()
    }

    expect(hasProductVariants).toBe(2)
    expect(totalProducts).toBe(5)
})

test('Error on adding zero product variant', () => {
    expect(() => { sale.addProductVariant('productVariant', 0) }).toThrow('Quantity must be greater than zero')
})

test('Error accepting/unaccepting empty sale', () => {
    expect(() => { sale.accept() }).toThrow('Sale has no products')
    sale.status = new SaleStatus.SaleStatusAccepted(sale)
    expect(() => { sale.unaccept() }).toThrow('Sale has no products')
})

test('Accept and unaccept sale', () => {
    sale.addProductVariant(productVariant1, 1)
    expect(sale.status).toBeInstanceOf(SaleStatus.SaleStatusReceived)
    sale.accept()
    expect(sale.status).toBeInstanceOf(SaleStatus.SaleStatusAccepted)
    sale.unaccept()
    expect(sale.status).toBeInstanceOf(SaleStatus.SaleStatusReceived)
})

test('Cancel Sale', () => {
    sale.addProductVariant(productVariant1, 1)
    sale.cancel()
    expect(sale.status).toBeInstanceOf(SaleStatus.SaleStatusCanceled)
})

test('Deliver Sale', () => {
    sale.addProductVariant(productVariant1, 1)
    sale.accept()
    sale.deliver()
    expect(sale.status).toBeInstanceOf(SaleStatus.SaleStatusDelivered)
})

test('Error on not allowed statuses for received sale', () => {
    sale.addProductVariant(productVariant1, 1)
    expect(() => { sale.deliver() }).toThrow('Status not allowed')
})

test('Error on not allowed statuses for accepted sale', () => {
    sale.addProductVariant(productVariant1, 1)
    sale.accept()
    expect(() => { sale.cancel() }).toThrow('Status not allowed')
})

test('Error on not allowed statuses for canceled sale', () => {
    sale.addProductVariant(productVariant1, 1)
    sale.cancel()
    expect(() => { sale.unaccept() }).toThrow('Status not allowed')
    expect(() => { sale.accept() }).toThrow('Status not allowed')
    expect(() => { sale.deliver() }).toThrow('Status not allowed')
})

test('Error on not allowed statuses for delivered sale', () => {
    sale.addProductVariant(productVariant1, 1)
    sale.accept()
    sale.deliver()
    expect(() => { sale.unaccept() }).toThrow('Status not allowed')
    expect(() => { sale.accept() }).toThrow('Status not allowed')
    expect(() => { sale.cancel() }).toThrow('Status not allowed')
})

test('Discount and restore stock on status change from/to received/accepted', () => {
    sale.addProductVariant(productVariant1, 1)
    sale.addProductVariant(productVariant2, 2)

    expect(productVariant1.getStock()).toBe(PRODUCT_VARIANT_1_INITIAL_STOCK)
    expect(productVariant2.getStock()).toBe(PRODUCT_VARIANT_2_INITIAL_STOCK)

    sale.accept()

    expect(productVariant1.getStock()).toBe(PRODUCT_VARIANT_1_INITIAL_STOCK - 1)
    expect(productVariant2.getStock()).toBe(PRODUCT_VARIANT_2_INITIAL_STOCK - 2)
})
