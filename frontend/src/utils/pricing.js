/**
 * Rental pricing calculation engine.
 * Faithfully mirrors the Core Java OOPS project implementations:
 *  - Car.java: rate * days
 *  - Bike.java: rate * days, 5% discount if days >= 7
 *  - Bus.java: (rate + 500 driver allowance) * days
 *  - Truck.java: (rate * days) + 1000 loading charge
 */

export const PRICING_CONSTANTS = {
  BUS_DRIVER_ALLOWANCE_PER_DAY: 500.0,
  TRUCK_LOADING_CHARGE: 1000.0,
  BIKE_LONG_RENTAL_DISCOUNT_PERCENT: 5.0,
  BIKE_DISCOUNT_MIN_DAYS: 7,
};

/**
 * Calculates rental cost and detailed breakdown for a vehicle and duration.
 *
 * @param {Object} vehicle - Vehicle object with type and rentalRatePerDay
 * @param {number} days - Duration of rental in days
 * @returns {Object} { baseCost, driverAllowance, loadingCharge, discount, totalCost, breakdownLines: [] }
 */
export function calculateRentalCost(vehicle, days) {
  const numDays = Math.max(1, parseInt(days, 10) || 1);
  const rate = Number(vehicle?.rentalRatePerDay) || 0;
  const type = (vehicle?.type || '').toLowerCase();

  const baseCost = rate * numDays;
  let driverAllowance = 0;
  let loadingCharge = 0;
  let discount = 0;
  const breakdownLines = [];

  breakdownLines.push({
    label: `Base Rental (${numDays} ${numDays === 1 ? 'day' : 'days'} × ₹${rate.toLocaleString('en-IN')})`,
    amount: baseCost,
    type: 'base',
  });

  if (type === 'car') {
    // Car has no additional charges or automatic discounts
  } else if (type === 'bike') {
    if (numDays >= PRICING_CONSTANTS.BIKE_DISCOUNT_MIN_DAYS) {
      discount = (baseCost * PRICING_CONSTANTS.BIKE_LONG_RENTAL_DISCOUNT_PERCENT) / 100;
      breakdownLines.push({
        label: `Long Rental Discount (${PRICING_CONSTANTS.BIKE_LONG_RENTAL_DISCOUNT_PERCENT}% for ≥7 days)`,
        amount: -discount,
        type: 'discount',
      });
    }
  } else if (type === 'bus') {
    driverAllowance = PRICING_CONSTANTS.BUS_DRIVER_ALLOWANCE_PER_DAY * numDays;
    breakdownLines.push({
      label: `Driver Allowance (₹${PRICING_CONSTANTS.BUS_DRIVER_ALLOWANCE_PER_DAY}/day × ${numDays} days)`,
      amount: driverAllowance,
      type: 'fee',
    });
  } else if (type === 'truck') {
    loadingCharge = PRICING_CONSTANTS.TRUCK_LOADING_CHARGE;
    breakdownLines.push({
      label: 'One-time Loading & Unloading Charge',
      amount: loadingCharge,
      type: 'fee',
    });
  }

  const totalCost = baseCost + driverAllowance + loadingCharge - discount;

  return {
    baseCost,
    driverAllowance,
    loadingCharge,
    discount,
    totalCost,
    breakdownLines,
    formattedTotal: `₹${totalCost.toLocaleString('en-IN')}`,
  };
}

/**
 * Currency formatter helper.
 */
export function formatCurrency(amount) {
  if (typeof amount !== 'number') {
    amount = Number(amount) || 0;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}
