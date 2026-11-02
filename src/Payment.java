/**
 * Payment - records the money charged for a rental.
 *
 * Demonstrates:
 *   ENCAPSULATION : private fields with getters/setters.
 *   OVERLOADING   : two calculateAmount() methods that differ by the number of
 *                   parameters (with and without a discount).
 *   ASSOCIATION   : each Payment is linked to the Rental it belongs to.
 */
public class Payment {

    private String paymentId;
    private Rental rental;      // association with Rental
    private double amount;
    private String method;
    private String status;
    private String paymentDate;

    public Payment(String paymentId, Rental rental, double amount, String method) {
        setPaymentId(paymentId);
        if (rental == null) {
            throw new IllegalArgumentException("Payment must be linked to a rental");
        }
        this.rental = rental;
        this.amount = amount;
        this.method = method;
        this.status = "Pending";   // paid when the vehicle is returned
        this.paymentDate = "-";
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        if (paymentId == null || paymentId.trim().isEmpty()) {
            throw new IllegalArgumentException("Payment ID cannot be empty");
        }
        this.paymentId = paymentId.trim();
    }

    public Rental getRental() {
        return rental;
    }

    public double getAmount() {
        return amount;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getStatus() {
        return status;
    }

    public String getPaymentDate() {
        return paymentDate;
    }

    /** Marks the payment as completed on the given date. */
    public void markPaid(String paymentDate) {
        this.status = "Paid";
        this.paymentDate = paymentDate;
    }

    // ----------------------- OVERLOADED calculation methods -----------------------

    /** Rental amount for a vehicle, using the vehicle's own pricing rule. */
    public static double calculateAmount(Vehicle vehicle, int days) {
        return vehicle.calculateRent(days);              // runtime polymorphism
    }

    /** Same as above but applies a percentage discount. */
    public static double calculateAmount(Vehicle vehicle, int days, double discountPercent) {
        return vehicle.calculateRent(days, discountPercent);   // runtime polymorphism
    }

    @Override
    public String toString() {
        return String.format("%-6s %-7s %-13s %-7s %-10s %s",
                paymentId,
                rental.getRentalId(),
                "Rs." + String.format("%.2f", amount),
                method,
                status,
                paymentDate);
    }
}
