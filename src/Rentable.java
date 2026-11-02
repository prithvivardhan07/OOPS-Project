/**
 * Rentable interface.
 *
 * Demonstrates the INTERFACE OOP concept: it declares WHAT a rentable thing can
 * do (rent / return / check availability) without saying HOW. The abstract
 * Vehicle class provides the actual behaviour.
 */
public interface Rentable {

    /**
     * Rents this vehicle.
     *
     * @return true when the rental succeeds.
     * @throws VehicleNotAvailableException if the vehicle is already rented.
     */
    boolean rent() throws VehicleNotAvailableException;

    /** Marks the vehicle as returned so it becomes available again. */
    void returnVehicle();

    /** @return true if the vehicle is currently available for rent. */
    boolean isAvailable();
}
