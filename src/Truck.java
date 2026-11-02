import java.util.ArrayList;

/**
 * Truck - concrete subclass of Vehicle.
 * Demonstrates INHERITANCE and METHOD OVERRIDING with its own pricing rule
 * (a fixed loading / unloading charge is added once).
 */
public class Truck extends Vehicle {

    /** Sample rental rate used as the default when adding a truck. */
    public static final double DEFAULT_RATE = 3500.0;

    /** One time loading and unloading charge. */
    public static final double LOADING_CHARGE = 1000.0;

    private double loadCapacityTons;

    public Truck(String vehicleId, String brand, String model, double rentalRatePerDay, double loadCapacityTons) {
        super(vehicleId, brand, model, rentalRatePerDay);
        setLoadCapacityTons(loadCapacityTons);
    }

    public double getLoadCapacityTons() {
        return loadCapacityTons;
    }

    public void setLoadCapacityTons(double loadCapacityTons) {
        if (loadCapacityTons <= 0) {
            throw new IllegalArgumentException("Load capacity must be positive");
        }
        this.loadCapacityTons = loadCapacityTons;
    }

    /** Truck charge = daily rate x days + one time loading charge. */
    @Override
    public double calculateRent(int days) {
        if (days <= 0) {
            throw new IllegalArgumentException("Number of days must be positive");
        }
        return (getRentalRatePerDay() * days) + LOADING_CHARGE;
    }

    /** Adds the one-time loading / unloading charge to the displayed breakdown. */
    @Override
    public ArrayList<String> getRentalBreakdown(int days) {
        ArrayList<String> lines = super.getRentalBreakdown(days);
        lines.add(String.format("Loading / unloading charge = Rs.%.2f", LOADING_CHARGE));
        return lines;
    }

    @Override
    public String getVehicleType() {
        return "Truck";
    }

    @Override
    public String extraFieldForFile() {
        return String.valueOf(loadCapacityTons);
    }

    @Override
    public String getSpecification() {
        return "Load: " + loadCapacityTons + " tons";
    }
}
