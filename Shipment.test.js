const Shipment = require('./Shipment')
const Pickup = require('./Pickup')
const TraditionalDelivery = require('./TraditionalDelivery')
const ImmediateDelivery = require('./ImmediateDelivery')
const Sale = require('./Sale')

let sale

Date.prototype.toISODateString = function () {
    return this.toISOString().slice(0, 10)
}

beforeEach(() => {
    sale = new Sale('client')
})

test('Error on shipment', () => {
    let shipment = new Shipment(sale)
    expect(() => { shipment.getCost() }).toThrow('Shipment cost undefined')
    expect(shipment.getEstimatedDate()).toBe(null)
})

test('Pickup', () => {
    let pickupDate = new Date()
    pickupDate.setDate(pickupDate.getDate() + 2)
    let pickup = new Pickup(sale, pickupDate)

    expect(pickup.getCost()).toBe(0)
    expect(pickup.getEstimatedDate().toISODateString()).toBe(pickupDate.toISODateString())
})

test('Traditional delivery', () => {
    let traditionalDelivery = new TraditionalDelivery(sale)

    let in4days = new Date()
    in4days.setDate(in4days.getDate() + 4)

    expect(traditionalDelivery.getCost()).toBe(450)
    expect(traditionalDelivery.getEstimatedDate().toISODateString()).toBe(in4days.toISODateString())
})

test('Immediate delivery', () => {
    let immediateDelivery = new ImmediateDelivery(sale)

    let tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    expect(immediateDelivery.getCost()).toBe(700)
    expect(immediateDelivery.getEstimatedDate().toISODateString()).toBe(tomorrow.toISODateString())
})
