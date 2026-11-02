import java.util.ArrayList;

/**
 * Maintenance - a service / repair record for a vehicle.
 *
 * Demonstrates COMPOSITION / ASSOCIATION: a Maintenance record holds a
 * reference to the Vehicle it belongs to.
 */
public class Maintenance {

    private String maintenanceId;
    private Vehicle vehicle;     // association with Vehicle
    private String description;
    private String date;
    private double cost;

    public Maintenance(String maintenanceId, Vehicle vehicle, String description, String date, double cost) {
        setMaintenanceId(maintenanceId);
        if (vehicle == null) {
            throw new IllegalArgumentException("Maintenance must be linked to a vehicle");
        }
        this.vehicle = vehicle;
        setDescription(description);
        this.date = date;
        setCost(cost);
    }

    public String getMaintenanceId() {
        return maintenanceId;
    }

    public void setMaintenanceId(String maintenanceId) {
        if (maintenanceId == null || maintenanceId.trim().isEmpty()) {
            throw new IllegalArgumentException("Maintenance ID cannot be empty");
        }
        this.maintenanceId = maintenanceId.trim();
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        if (description == null || description.trim().isEmpty()) {
            throw new IllegalArgumentException("Maintenance description cannot be empty");
        }
        this.description = description.trim();
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public double getCost() {
        return cost;
    }

    public void setCost(double cost) {
        if (cost < 0) {
            throw new IllegalArgumentException("Maintenance cost cannot be negative");
        }
        this.cost = cost;
    }

    // ------------------------ File handling support ------------------------

    public String toFileString() {
        return maintenanceId + "|" + vehicle.getVehicleId() + "|" + clean(description) + "|" + date + "|" + cost;
    }

    /** Returns null for a malformed line or a missing linked vehicle. */
    public static Maintenance fromFileString(String line, ArrayList<Vehicle> vehicles) {
        String[] parts = line.split("\\|", -1);
        if (parts.length < 5) {
            return null;
        }
        try {
            String maintenanceId = parts[0].trim();
            String vehicleId = parts[1].trim();
            String description = parts[2].trim();
            String date = parts[3].trim();
            double cost = Double.parseDouble(parts[4].trim());

            Vehicle vehicle = null;
            for (Vehicle v : vehicles) {
                if (v.getVehicleId().equalsIgnoreCase(vehicleId)) {
                    vehicle = v;
                    break;
                }
            }
            if (vehicle == null) {
                return null; // dangling reference, skip the record
            }
            return new Maintenance(maintenanceId, vehicle, description, date, cost);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private static String clean(String text) {
        if (text == null) {
            return "";
        }
        return text.replace("|", "/").replace("\r", " ").replace("\n", " ");
    }

    @Override
    public String toString() {
        return String.format("%-6s %-7s %-11s %-13s %s",
                maintenanceId,
                vehicle.getVehicleId(),
                date,
                "Rs." + String.format("%.2f", cost),
                description);
    }
}
