import java.util.ArrayList;

/**
 * Vehicle - abstract parent class of the whole hierarchy.
 *
 * OOP concepts demonstrated here:
 *   ENCAPSULATION  : private fields + getters/setters with validation.
 *   ABSTRACTION    : abstract calculateRent(int) with no body; subclasses decide it.
 *   INHERITANCE    : Car, Bike, Bus and Truck extend this class.
 *   INTERFACE      : implements the Rentable interface.
 *   OVERLOADING    : calculateRent(int) and calculateRent(int, double).
 *   POLYMORPHISM   : calculateRent(days) is dispatched at runtime to the
 *                    correct subclass version.
 */
public abstract class Vehicle implements Rentable {

    // Encapsulation: all data members are private.
    private String vehicleId;
    private String brand;
    private String model;
    private double rentalRatePerDay;
    private boolean available;

    public Vehicle(String vehicleId, String brand, String model, double rentalRatePerDay) {
        setVehicleId(vehicleId);
        setBrand(brand);
        setModel(model);
        setRentalRatePerDay(rentalRatePerDay);
        this.available = true;   // every newly created vehicle starts available
    }

    // ---------------- Getters and setters (encapsulation) ----------------

    public String getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(String vehicleId) {
        if (vehicleId == null || vehicleId.trim().isEmpty()) {
            throw new IllegalArgumentException("Vehicle ID cannot be empty");
        }
        this.vehicleId = vehicleId.trim();
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        if (brand == null || brand.trim().isEmpty()) {
            throw new IllegalArgumentException("Brand cannot be empty");
        }
        this.brand = brand.trim();
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        if (model == null || model.trim().isEmpty()) {
            throw new IllegalArgumentException("Model cannot be empty");
        }
        this.model = model.trim();
    }

    public double getRentalRatePerDay() {
        return rentalRatePerDay;
    }

    public void setRentalRatePerDay(double rentalRatePerDay) {
        if (rentalRatePerDay <= 0) {
            throw new IllegalArgumentException("Rental rate must be a positive number");
        }
        this.rentalRatePerDay = rentalRatePerDay;
    }

    @Override
    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    // ------------- Abstract behaviour (abstraction + polymorphism) -------------

    /**
     * Calculates the rental charge for the given number of days.
     * Abstract because each vehicle type has its own pricing rule.
     */
    public abstract double calculateRent(int days);

    /** @return the vehicle type name: "Car", "Bike", "Bus" or "Truck". */
    public abstract String getVehicleType();

    /** @return the type specific value stored in the text file (raw form). */
    public abstract String extraFieldForFile();

    /** @return a short type specific description shown on the console. */
    public abstract String getSpecification();

    /**
     * OVERLOADED version of calculateRent().
     * Same purpose but with an extra "discountPercent" parameter.
     * The inner call calculateRent(days) is resolved at RUNTIME, which is
     * the runtime polymorphism demonstration.
     */
    public double calculateRent(int days, double discountPercent) {
        if (days <= 0) {
            throw new IllegalArgumentException("Number of days must be positive");
        }
        if (discountPercent < 0 || discountPercent > 100) {
            throw new IllegalArgumentException("Discount must be between 0 and 100");
        }
        double rent = calculateRent(days);          // runtime polymorphism
        double discount = rent * discountPercent / 100.0;
        return rent - discount;
    }

    /**
     * Builds the itemized cost breakdown lines for the given number of days.
     * This is for DISPLAY only: the first line is always the base rent and each
     * subclass appends its own extra charge or discount line. The authoritative
     * total is still calculateRent(days), so no pricing rule is repeated here.
     *
     * @return list of printable lines, base rent first
     */
    public ArrayList<String> getRentalBreakdown(int days) {
        double baseRent = getRentalRatePerDay() * days;
        ArrayList<String> lines = new ArrayList<>();
        lines.add(String.format("Base rent (Rs.%.2f x %d days) = Rs.%.2f",
                getRentalRatePerDay(), days, baseRent));
        return lines;
    }

    // ---------------- Rentable interface implementation ----------------

    @Override
    public boolean rent() throws VehicleNotAvailableException {
        if (!available) {
            throw new VehicleNotAvailableException(
                    "Vehicle " + vehicleId + " (" + brand + " " + model + ") is already rented.");
        }
        available = false;
        return true;
    }

    @Override
    public void returnVehicle() {
        available = true;
    }

    // ------------------------ File handling support ------------------------

    /** One line of text that fully describes this vehicle. */
    public String toFileString() {
        return getVehicleType() + "|" + vehicleId + "|" + clean(brand) + "|" + clean(model)
                + "|" + rentalRatePerDay + "|" + available + "|" + extraFieldForFile();
    }

    /**
     * Builds the correct subclass from one stored line.
     * Returns null for a malformed record so the caller can safely skip it.
     */
    public static Vehicle fromFileString(String line) {
        String[] parts = line.split("\\|", -1);
        if (parts.length < 6) {
            return null;
        }
        try {
            String type = parts[0].trim();
            String id = parts[1].trim();
            String brand = parts[2].trim();
            String model = parts[3].trim();
            double rate = Double.parseDouble(parts[4].trim());
            boolean available = Boolean.parseBoolean(parts[5].trim());
            String extra = parts.length > 6 ? parts[6].trim() : "";

            Vehicle vehicle;
            if (type.equalsIgnoreCase("Car")) {
                vehicle = new Car(id, brand, model, rate, parseInt(extra, 5));
            } else if (type.equalsIgnoreCase("Bike")) {
                vehicle = new Bike(id, brand, model, rate, parseInt(extra, 150));
            } else if (type.equalsIgnoreCase("Bus")) {
                vehicle = new Bus(id, brand, model, rate, parseInt(extra, 40));
            } else if (type.equalsIgnoreCase("Truck")) {
                vehicle = new Truck(id, brand, model, rate, parseDouble(extra, 5.0));
            } else {
                return null; // unknown vehicle type
            }
            vehicle.setAvailable(available);
            return vehicle;
        } catch (IllegalArgumentException e) {
            // NumberFormatException is also an IllegalArgumentException.
            return null;
        }
    }

    private static int parseInt(String text, int fallback) {
        try {
            return Integer.parseInt(text);
        } catch (NumberFormatException e) {
            return fallback;
        }
    }

    private static double parseDouble(String text, double fallback) {
        try {
            return Double.parseDouble(text);
        } catch (NumberFormatException e) {
            return fallback;
        }
    }

    /** Removes the '|' separator and newlines from free-text fields. */
    protected static String clean(String text) {
        if (text == null) {
            return "";
        }
        return text.replace("|", "/").replace("\r", " ").replace("\n", " ");
    }

    @Override
    public String toString() {
        return String.format("%-6s %-7s %-12s %-12s %-11s %-10s %s",
                getVehicleType(),
                vehicleId,
                brand,
                model,
                "Rs." + String.format("%.2f", rentalRatePerDay),
                (available ? "Available" : "Rented"),
                getSpecification());
    }
}
