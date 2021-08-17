const Store = require('./Store')
const PercentageSubscription = require('./PercentageSubscription')
const QuantitySubscription = require('./QuantitySubscription')
const Product = require('./Product')
const ProductVariant = require('./ProductVariant')
const Client = require('./Client')
const Sale = require('./Sale')
const TraditionalDelivery = require('./TraditionalDelivery')

let sales

beforeEach(() => {
    let product1 = new Product('Product 1', 2500)
    let productVariant1a = new ProductVariant(product1, 30, 'M', 'black')
    let productVariant1b = new ProductVariant(product1, 50, 'L', 'black')

    let product2 = new Product('Product 2', 3000)
    let productVariant2 = new ProductVariant(product2, 30, 'M', 'black')

    sales = []

    sales[0] = new Sale(new Client('Client 1'))
    sales[0].addProductVariant(productVariant1a, 3)
    sales[0].addProductVariant(productVariant1b, 1)
    sales[0].setShipment(new TraditionalDelivery(sales[0]))
    sales[0].accept()
    sales[0].deliver()

    sales[1] = new Sale(new Client('Client 2'))
    sales[1].addProductVariant(productVariant1a, 1)
    sales[1].addProductVariant(productVariant2, 1)
    sales[1].setShipment(new TraditionalDelivery(sales[1]))
    sales[1].accept()
    sales[1].deliver()

    sales[2] = new Sale(new Client('Client 3'))
    sales[2].addProductVariant(productVariant1b, 2)
    sales[2].addProductVariant(productVariant2, 2)
    sales[2].setShipment(new TraditionalDelivery(sales[2]))
    sales[2].accept()

    sales[3] = new Sale(new Client('Client4'))
    sales[3].addProductVariant(productVariant1a, 1)
    sales[3].setShipment(new TraditionalDelivery(sales[3]))
    sales[3].cancel()

    sales[4] = new Sale(new Client('Client 5'))
    sales[4].addProductVariant(productVariant2, 1)
    sales[4].setShipment(new TraditionalDelivery(sales[4]))
})

test('Store with percentage subscription', () => {
    let store = new Store('Store 1', new PercentageSubscription(15))
    sales.forEach(s => store.addSale(s))
    expect(store.getSubscriptionPayment()).toBe(2460)
})

test('Store with quantity subscription above limit', () => {
    let store = new Store('Store 2', new QuantitySubscription(1000, 10, 10))
    sales.forEach(s => store.addSale(s))
    expect(store.getSubscriptionPayment()).toBe(1000)
})

test('Store with quantity subscription over limit', () => {
    let store = new Store('Store 3', new QuantitySubscription(1000, 1, 10))
    for (let i=1 ; i<5 ; i++) {
        store.addSale(sales[i])
    }
    expect(store.getSubscriptionPayment()).toBe(1000)
    store.addSale(sales[0])
    expect(store.getSubscriptionPayment()).toBe(1010)
})
