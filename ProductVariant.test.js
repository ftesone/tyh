const Store = require('./Store')
const Product = require('./Product')
const ProductVariant = require('./ProductVariant')

let productVariant;

beforeEach(() => {
    let product = new Product(new Store('Store 1'), 'Product 1', 100)
    productVariant = new ProductVariant(product, 3, 'M', 'Black')
})

test('Discount available stock', () => {
    expect(productVariant.getStock()).toBe(3)
    productVariant.substractStock(2)
    expect(productVariant.getStock()).toBe(1)
})

test('Discount unavailable stock', () => {
    expect(() => productVariant.substractStock(4)).toThrow('Insufficient stock')
})
