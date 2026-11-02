import java.util.ArrayList;

/**
 * Rental - one rental transaction.
 *
 * Demonstrates COMPOSITION / ASSOCIATION: a Rental HAS-A Customer and HAS-A
 * Vehicle (it stores references to the actual objects instead of copying data).
 */
public class Rental {

    private String rentalId;
    private Customer customer;   // association with Customer
    private Vehicle vehicle;     // association with Vehicle
    private int days;
    private double totalCost;
    private String rentDate;
    private String returnDate;
    private boolean returned;

    public Rental(String rentalId, Customer customer, Vehicle vehicle,
                  int days, double totalCost, String rentDate) {
        setRentalId(rentalId);
        if (customer == null) {
            throw new IllegalArgumentException("Rental must be linked to a customer");
        }
        if (vehicle == null) {
            throw new IllegalArgumentException("Rental must be linked to a vehicle");
        }
        if (days <= 0) {
            throw new IllegalArgumentException("Rental days must be positive");
        }
        this.customer = customer;
        this.vehicle = vehicle;
        this.days = days;
        this.totalCost = totalCost;
        this.rentDate = rentDate;
        this.returnDate = "-";
        this.returned = false;
    }

    public String getRentalId() {
        return rentalId;
    }

    public void setRentalId(String rentalId) {
        if (rentalId == null || rentalId.trim().isEmpty()) {
            throw new IllegalArgumentException("Rental ID cannot be empty");
        }
        this.rentalId = rentalId.trim();
    }

    public Customer getCustomer() {
        return customer;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public int getDays() {
        return days;
    }

    public double getTotalCost() {
        return totalCost;
    }

    public String getRentDate() {
        return rentDate;
    }

    public String getReturnDate() {
        return returnDate;
    }

    public boolean isReturned() {
        return returned;
    }

    /** Marks this rental as completed and stores the return date. */
    public void markReturned(String returnDate) {
        this.returned = true;
        this.returnDate = returnDate;
    }

    // ------------------------ File handling support ------------------------

    public String toFileString() {
        return rentalId + "|" + customer.getCustomerId() + "|" + vehicle.getVehicleId()
                + "|" + days + "|" + totalCost + "|" + rentDate + "|" + returnDate + "|" + returned;
    }

    /**
     * Rebuilds a Rental from a stored line. The stored customer and vehicle IDs
     * are resolved back to the real objects from the loaded lists.
     * Returns null if the line is malformed or the linked objects are missing.
     */
    public static Rental fromFileString(String line, ArrayList<Customer> customers, ArrayList<Vehicle> vehicles) {
        String[] parts = line.split("\\|", -1);
        if (parts.length < 8) {
            return null;
        }
        try {
            String rentalId = parts[0].trim();
            String customerId = parts[1].trim();
            String vehicleId = parts[2].trim();
            int days = Integer.parseInt(parts[3].trim());
            double totalCost = Double.parseDouble(parts[4].trim());
            String rentDate = parts[5].trim();
            String returnDate = parts[6].trim();
            boolean wasReturned = Boolean.parseBoolean(parts[7].trim());

            Customer customer = null;
            for (Customer c : customers) {
                if (c.getCustomerId().equalsIgnoreCase(customerId)) {
                    customer = c;
                    break;
                }
            }
            Vehicle vehicle = null;
            for (Vehicle v : vehicles) {
                if (v.getVehicleId().equalsIgnoreCase(vehicleId)) {
                    vehicle = v;
                    break;
                }
            }
            if (customer == null || vehicle == null) {
                return null; // dangling reference, skip the record
            }

            Rental rental = new Rental(rentalId, customer, vehicle, days, totalCost, rentDate);
            if (wasReturned) {
                rental.markReturned(returnDate);
            }
            return rental;
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    @Override
    public String toString() {
        return String.format("%-6s %-8s %-7s %-4s %-13s %-12s %-12s %s",
                rentalId,
                customer.getCustomerId(),
                vehicle.getVehicleId(),
                days,
                "Rs." + String.format("%.2f", totalCost),
                rentDate,
                (returned ? returnDate : "-"),
                (returned ? "Returned" : "Active"));
    }
}
