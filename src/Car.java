/**
 * Car - concrete subclass of Vehicle.
 *
 * Demonstrates INHERITANCE (extends Vehicle) and METHOD OVERRIDING
 * (its own version of calculateRent).
 */
public class Car extends Vehicle {

    /** Sample rental rate used as the default when adding a car. */
    public static final double DEFAULT_RATE = 2000.0;

    private int numberOfSeats;

    public Car(String vehicleId, String brand, String model, double rentalRatePerDay, int numberOfSeats) {
        super(vehicleId, brand, model, rentalRatePerDay);
        setNumberOfSeats(numberOfSeats);
    }

    public int getNumberOfSeats() {
        return numberOfSeats;
    }

    public void setNumberOfSeats(int numberOfSeats) {
        if (numberOfSeats <= 0) {
            throw new IllegalArgumentException("Number of seats must be positive");
        }
        this.numberOfSeats = numberOfSeats;
    }

    /** Cars are charged straight on the daily rate. */
    @Override
    public double calculateRent(int days) {
        if (days <= 0) {
            throw new IllegalArgumentException("Number of days must be positive");
        }
        return getRentalRatePerDay() * days;
    }

    @Override
    public String getVehicleType() {
        return "Car";
    }

    @Override
    public String extraFieldForFile() {
        return String.valueOf(numberOfSeats);
    }

    @Override
    public String getSpecification() {
        return "Seats: " + numberOfSeats;
    }
}
