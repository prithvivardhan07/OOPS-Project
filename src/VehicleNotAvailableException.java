/**
 * Custom checked exception thrown when someone tries to rent a vehicle that is
 * already rented. Demonstrates the EXCEPTION HANDLING OOP requirement.
 *
 * It is a checked exception (extends Exception), so callers are forced to
 * handle it with try-catch or declare it with throws.
 */
public class VehicleNotAvailableException extends Exception {

    private static final long serialVersionUID = 1L;

    public VehicleNotAvailableException(String message) {
        super(message);
    }
}
