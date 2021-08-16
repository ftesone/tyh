const Sale = require('./Sale')
const Client = require('./Client')
const Store = require('./Store')
const Product = require('./Product')
const ProductVariant = require('./ProductVariant')
const SaleStatus = require('./SaleStatus')
const Shipment = require('./Shipment')
const Pickup = require('./Pickup')
const TraditionalDelivery = require('./TraditionalDelivery')
const ImmediateDelivery = require('./ImmediateDelivery')

Date.prototype.toISODateString = function () {
    return this.toISOString().slice(0, 10)
}

const PRODUCT_VARIANT_1_INITIAL_STOCK = 10, PRODUCT_VARIANT_2_INITIAL_STOCK = 20
let sale, product1, product2, productVariant1, productVariant2, testDefaultShipment

beforeEach(() => {
    let store = new Store('Test Store')
    sale = new Sale(new Client('Test Client'))
    product1 = new Product(store, 'Product 1', 3000)
    product2 = new Product(store, 'Product 2', 2500)
    productVariant1 = new ProductVariant(product1, PRODUCT_VARIANT_1_INITIAL_STOCK, 'M', 'black')
    productVariant2 = new ProductVariant(product2, PRODUCT_VARIANT_2_INITIAL_STOCK, 'L', 'white')
    testDefaultShipment = new TraditionalDelivery(sale)
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

test('Sale subtotal cost', () => {
    sale.addProductVariant(productVariant1, 3)
    sale.addProductVariant(productVariant2, 2)

    expect(sale.getSubtotalCost()).toBe(productVariant1.getProduct().getPrice() * 3 + productVariant2.getProduct().getPrice() * 2)
})

test('Error on adding zero product variant', () => {
    expect(() => { sale.addProductVariant('productVariant', 0) }).toThrow('Quantity must be greater than zero')
})

test('Error accepting sale without shipment', () => {
    expect(() => { sale.accept() }).toThrow('Sale has no shipment')
})

test('Error accepting/unaccepting empty sale', () => {
    sale.setShipment(testDefaultShipment)
    expect(() => { sale.accept() }).toThrow('Sale has no products')
    sale.status = new SaleStatus.SaleStatusAccepted(sale)
    expect(() => { sale.unaccept() }).toThrow('Sale has no products')
})

test('Accept and unaccept sale', () => {
    sale.addProductVariant(productVariant1, 1)
    sale.setShipment(testDefaultShipment)
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
    sale.setShipment(testDefaultShipment)
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
    sale.setShipment(testDefaultShipment)
    sale.accept()
    expect(() => { sale.cancel() }).toThrow('Status not allowed')
})

test('Error on not allowed statuses for canceled sale', () => {
    sale.addProductVariant(productVariant1, 1)
    sale.cancel()
    expect(() => { sale.unaccept() }).toThrow('Status not allowed')
    expect(() => { sale.accept() }).toThrow('Sale has no shipment')
    sale.setShipment(testDefaultShipment)
    expect(() => { sale.accept() }).toThrow('Status not allowed')
    expect(() => { sale.deliver() }).toThrow('Status not allowed')
})

test('Error on not allowed statuses for delivered sale', () => {
    sale.addProductVariant(productVariant1, 1)
    sale.setShipment(testDefaultShipment)
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

    sale.setShipment(testDefaultShipment)
    sale.accept()

    expect(productVariant1.getStock()).toBe(PRODUCT_VARIANT_1_INITIAL_STOCK - 1)
    expect(productVariant2.getStock()).toBe(PRODUCT_VARIANT_2_INITIAL_STOCK - 2)
})

test('Pickup shipment', () => {
    sale.addProductVariant(productVariant1, 2)
    sale.addProductVariant(productVariant2, 3)

    let in3days = new Date()
    in3days.setDate(in3days.getDate() + 3)

    sale.setShipment(new Pickup(sale, in3days))
    expect(sale.getShipmentEstimatedDate().toISODateString()).toBe(in3days.toISODateString())

    expect(sale.getTotalCost()).toBe(sale.getSubtotalCost())
})

test('Traditional delivery', () => {
    sale.addProductVariant(productVariant1, 2)
    sale.addProductVariant(productVariant1, 3)

    let traditionalDelivery = new TraditionalDelivery(sale)
    sale.setShipment(traditionalDelivery)

    let shipmentEstimatedDate = new Date()
    shipmentEstimatedDate.setDate(sale.getDate().getDate() + 4)

    expect(sale.getShipmentEstimatedDate().toISODateString()).toBe(shipmentEstimatedDate.toISODateString())
    expect(sale.getTotalCost()).toBe(sale.getSubtotalCost() + 450)
})

test('Immediate delivery', () => {
    sale.addProductVariant(productVariant1, 2)
    sale.addProductVariant(productVariant1, 3)

    let immediateDelivery = new ImmediateDelivery(sale)
    sale.setShipment(immediateDelivery)

    let shipmentEstimatedDate = new Date()
    shipmentEstimatedDate.setDate(sale.getDate().getDate() + 1)

    expect(sale.getShipmentEstimatedDate().toISODateString()).toBe(shipmentEstimatedDate.toISODateString())
    expect(sale.getTotalCost()).toBe(sale.getSubtotalCost() + 700)
})
