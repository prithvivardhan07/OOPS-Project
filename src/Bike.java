import java.util.ArrayList;

/**
 * Bike - concrete subclass of Vehicle.
 * Demonstrates INHERITANCE and METHOD OVERRIDING with its own pricing rule
 * (a 5% discount for rentals of a week or longer).
 */
public class Bike extends Vehicle {

    /** Sample rental rate used as the default when adding a bike. */
    public static final double DEFAULT_RATE = 500.0;

    private int engineCapacityCc;

    public Bike(String vehicleId, String brand, String model, double rentalRatePerDay, int engineCapacityCc) {
        super(vehicleId, brand, model, rentalRatePerDay);
        setEngineCapacityCc(engineCapacityCc);
    }

    public int getEngineCapacityCc() {
        return engineCapacityCc;
    }

    public void setEngineCapacityCc(int engineCapacityCc) {
        if (engineCapacityCc <= 0) {
            throw new IllegalArgumentException("Engine capacity must be positive");
        }
        this.engineCapacityCc = engineCapacityCc;
    }

    /** Bikes get a 5% discount when rented for 7 days or more. */
    @Override
    public double calculateRent(int days) {
        if (days <= 0) {
            throw new IllegalArgumentException("Number of days must be positive");
        }
        double rent = getRentalRatePerDay() * days;
        if (days >= 7) {
            rent = rent - (rent * 5.0 / 100.0);
        }
        return rent;
    }

    /** Adds the long-rental discount line to the displayed cost breakdown. */
    @Override
    public ArrayList<String> getRentalBreakdown(int days) {
        ArrayList<String> lines = super.getRentalBreakdown(days);
        if (days >= 7) {
            double baseRent = getRentalRatePerDay() * days;
            double discount = baseRent * 5.0 / 100.0;
            lines.add(String.format("Long rental discount (5%% off) = -Rs.%.2f", discount));
        }
        return lines;
    }

    @Override
    public String getVehicleType() {
        return "Bike";
    }

    @Override
    public String extraFieldForFile() {
        return String.valueOf(engineCapacityCc);
    }

    @Override
    public String getSpecification() {
        return "Engine: " + engineCapacityCc + "cc";
    }
}
