let Store = require('./Store')
let Product = require('./Product')
let ProductVariant = require('./ProductVariant')

let productVariant;

beforeEach(() => {
    let product = new Product(new Store("Tienda 1"), "Producto 1", 100)
    productVariant = new ProductVariant(product, 3, "M", "Black")
})

test('Discount available stock', () => {
    expect(productVariant.getStock()).toBe(3)
    productVariant.discountStock(2)
    expect(productVariant.getStock()).toBe(1)
})

test('Discount unavailable stock', () => {
    expect(() => productVariant.discountStock(4)).toThrow("Insufficient stock")
})
