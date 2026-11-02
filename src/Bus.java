import java.util.ArrayList;

/**
 * Bus - concrete subclass of Vehicle.
 * Demonstrates INHERITANCE and METHOD OVERRIDING with its own pricing rule
 * (a daily driver allowance is added to the base rate).
 */
public class Bus extends Vehicle {

    /** Sample rental rate used as the default when adding a bus. */
    public static final double DEFAULT_RATE = 5000.0;

    /** Extra amount charged per day for the driver. */
    public static final double DRIVER_ALLOWANCE_PER_DAY = 500.0;

    private int seatingCapacity;

    public Bus(String vehicleId, String brand, String model, double rentalRatePerDay, int seatingCapacity) {
        super(vehicleId, brand, model, rentalRatePerDay);
        setSeatingCapacity(seatingCapacity);
    }

    public int getSeatingCapacity() {
        return seatingCapacity;
    }

    public void setSeatingCapacity(int seatingCapacity) {
        if (seatingCapacity <= 0) {
            throw new IllegalArgumentException("Seating capacity must be positive");
        }
        this.seatingCapacity = seatingCapacity;
    }

    /** Bus charge = daily rate + driver allowance, multiplied by the days. */
    @Override
    public double calculateRent(int days) {
        if (days <= 0) {
            throw new IllegalArgumentException("Number of days must be positive");
        }
        return (getRentalRatePerDay() + DRIVER_ALLOWANCE_PER_DAY) * days;
    }

    /** Adds the daily driver allowance line to the displayed cost breakdown. */
    @Override
    public ArrayList<String> getRentalBreakdown(int days) {
        ArrayList<String> lines = super.getRentalBreakdown(days);
        double allowance = DRIVER_ALLOWANCE_PER_DAY * days;
        lines.add(String.format("Driver allowance (Rs.%.2f x %d days) = Rs.%.2f",
                DRIVER_ALLOWANCE_PER_DAY, days, allowance));
        return lines;
    }

    @Override
    public String getVehicleType() {
        return "Bus";
    }

    @Override
    public String extraFieldForFile() {
        return String.valueOf(seatingCapacity);
    }

    @Override
    public String getSpecification() {
        return "Capacity: " + seatingCapacity;
    }
}
