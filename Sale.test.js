const Sale = require('./Sale')
const ProductVariant = require('./ProductVariant')

let sale, productVariant1, productVariant2

beforeEach(() => {
    sale = new Sale('client')
    productVariant1 = new ProductVariant('product1', 10, 'M', 'black')
    productVariant2 = new ProductVariant('product2', 20, 'L', 'white')
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
    expect(() => { sale.addProductVariant('productVariant', 0) }).toThrow("Quantity must be greater than zero")
})
