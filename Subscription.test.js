const PercentageSubscription = require('./PercentageSubscription')
const QuantitySubscription = require('./QuantitySubscription')
const Sale = require('./Sale')
const Product = require('./Product')
const ProductVariant = require('./ProductVariant')
const TraditionalDelivery = require('./TraditionalDelivery')
const Client = require('./Client')

let sales

beforeEach(() => {
    sales = []

    let product1 = new Product('Product 1', 2000)
    let product2 = new Product('Product 2', 3200)

    let productVariant1 = new ProductVariant(product1, 30, 'M', 'black')
    let productVariant2 = new ProductVariant(product2, 30, 'M', 'gray')

    let sale1 = new Sale(new Client('Client 1'))
    sale1.addProductVariant(productVariant1, 3)
    sale1.addProductVariant(productVariant2, 1)
    sale1.setShipment(new TraditionalDelivery(sale1))
    sale1.accept()
    sales.push(sale1)

    let sale2 = new Sale(new Client('Client 2'))
    sale2.addProductVariant(productVariant1, 2)
    sale2.setShipment(new TraditionalDelivery(sale2))
    sale2.accept()
    sales.push(sale2)
})

test('Percentage subscription', () => {
    let subscription = new PercentageSubscription(10)
    expect(subscription.getPayment(sales)).toBe(1410)

    subscription = new PercentageSubscription(5)
    expect(subscription.getPayment(sales)).toBe(705)
})

test('Quantity subscription above sales limit', () => {
    let subscription = new QuantitySubscription(1000, 2, 10)
    expect(subscription.getPayment(sales)).toBe(1000)
})

test('Quantity subscription over sales limit', () => {
    let subscription = new QuantitySubscription(1000, 1, 10)
    expect(subscription.getPayment(sales)).toBe(1010)
})
