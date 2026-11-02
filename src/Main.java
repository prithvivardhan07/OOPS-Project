import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Scanner;

/**
 * Main - entry point of the Vehicle Rental Management System.
 *
 * It shows the console menu, keeps all data in memory using ArrayList
 * collections, and saves / loads the data to simple text files inside the
 * "data" folder.
 */
public class Main {

    // ---------------------------- Data storage ----------------------------
    // COLLECTIONS: all records live in memory as ArrayList of objects.
    private static final ArrayList<Vehicle> vehicles = new ArrayList<>();
    private static final ArrayList<Customer> customers = new ArrayList<>();
    private static final ArrayList<Rental> rentals = new ArrayList<>();
    private static final ArrayList<Maintenance> maintenanceRecords = new ArrayList<>();
    private static final ArrayList<Payment> payments = new ArrayList<>();

    // ---------------------------- File handling ----------------------------
    private static final String DATA_DIR = "data";
    private static final String VEHICLE_FILE = DATA_DIR + File.separator + "vehicles.txt";
    private static final String CUSTOMER_FILE = DATA_DIR + File.separator + "customers.txt";
    private static final String RENTAL_FILE = DATA_DIR + File.separator + "rentals.txt";
    private static final String MAINTENANCE_FILE = DATA_DIR + File.separator + "maintenance.txt";

    private static final Scanner scanner = new Scanner(System.in);

    // ================================ MAIN ================================

    public static void main(String[] args) {
        createDataDirectory();

        System.out.println("=====================================================");
        System.out.println("     VEHICLE RENTAL MANAGEMENT SYSTEM (Core Java)");
        System.out.println("=====================================================");
        loadData();

        boolean running = true;
        while (running) {
            printMenu();
            Integer choice = readInt("Enter your choice: ");
            if (choice == null) {
                break; // input stream ended, exit gracefully
            }
            switch (choice) {
                case 1:
                    addVehicle();
                    break;
                case 2:
                    viewAllVehicles();
                    break;
                case 3:
                    viewAvailableVehicles();
                    break;
                case 4:
                    registerCustomer();
                    break;
                case 5:
                    viewCustomers();
                    break;
                case 6:
                    rentVehicle();
                    break;
                case 7:
                    returnVehicle();
                    break;
                case 8:
                    calculateCharges();
                    break;
                case 9:
                    viewRentalHistory();
                    break;
                case 10:
                    maintenanceMenu();
                    break;
                case 11:
                    dataMenu();
                    break;
                case 12:
                    saveData();
                    running = false;
                    System.out.println("Data saved. Thank you for using the Vehicle Rental Management System!");
                    break;
                default:
                    System.out.println("  ! Invalid choice. Please enter a number between 1 and 12.");
            }
        }
        scanner.close();
    }

    private static void printMenu() {
        System.out.println("\n================= MAIN MENU =================");
        System.out.println(" 1.  Add a vehicle");
        System.out.println(" 2.  View all vehicles");
        System.out.println(" 3.  View available vehicles");
        System.out.println(" 4.  Register a customer");
        System.out.println(" 5.  View registered customers");
        System.out.println(" 6.  Rent a vehicle to a customer");
        System.out.println(" 7.  Return a rented vehicle");
        System.out.println(" 8.  Calculate rental charges");
        System.out.println(" 9.  View rental history");
        System.out.println(" 10. Maintenance records");
        System.out.println(" 11. Save / Load data");
        System.out.println(" 12. Exit");
        System.out.println("=============================================");
    }

    // ============================ VEHICLE FEATURES ============================

    private static void addVehicle() {
        System.out.println("\n--- Add Vehicle ---");

        String typeInput = readNonEmpty("Vehicle type (Car/Bike/Bus/Truck): ");
        if (typeInput == null) {
            return;
        }
        String type = typeInput.toLowerCase();
        String canonicalType;
        double defaultRate;
        if (type.equals("car")) {
            canonicalType = "Car";
            defaultRate = Car.DEFAULT_RATE;
        } else if (type.equals("bike")) {
            canonicalType = "Bike";
            defaultRate = Bike.DEFAULT_RATE;
        } else if (type.equals("bus")) {
            canonicalType = "Bus";
            defaultRate = Bus.DEFAULT_RATE;
        } else if (type.equals("truck")) {
            canonicalType = "Truck";
            defaultRate = Truck.DEFAULT_RATE;
        } else {
            System.out.println("  ! Unsupported vehicle type. Please choose Car, Bike, Bus or Truck.");
            return;
        }

        String id = readNonEmpty("Vehicle ID (e.g. V001): ");
        if (id == null) {
            return;
        }
        if (findVehicleById(id) != null) {
            System.out.println("  ! A vehicle with ID " + id + " already exists.");
            return;
        }

        String brand = readNonEmpty("Brand: ");
        if (brand == null) {
            return;
        }
        String model = readNonEmpty("Model: ");
        if (model == null) {
            return;
        }

        double rate = readOptionalPositiveDouble(
                "Rental rate per day [Enter for default Rs." + defaultRate + "]: ", defaultRate);

        Vehicle vehicle;
        if (canonicalType.equals("Car")) {
            int seats = readOptionalPositiveInt("Number of seats [Enter for default 5]: ", 5);
            vehicle = new Car(id, brand, model, rate, seats);
        } else if (canonicalType.equals("Bike")) {
            int cc = readOptionalPositiveInt("Engine capacity in cc [Enter for default 150]: ", 150);
            vehicle = new Bike(id, brand, model, rate, cc);
        } else if (canonicalType.equals("Bus")) {
            int capacity = readOptionalPositiveInt("Seating capacity [Enter for default 40]: ", 40);
            vehicle = new Bus(id, brand, model, rate, capacity);
        } else {
            double tons = readOptionalPositiveDouble("Load capacity in tons [Enter for default 5]: ", 5.0);
            vehicle = new Truck(id, brand, model, rate, tons);
        }

        vehicles.add(vehicle);
        System.out.println("  Vehicle added successfully.");
        System.out.println("  " + vehicle);
    }

    private static void viewAllVehicles() {
        System.out.println("\n--- All Vehicles ---");
        if (vehicles.isEmpty()) {
            System.out.println("  No vehicles registered yet.");
            return;
        }
        printVehicleHeader();
        // POLYMORPHISM: each element is a Vehicle but prints its own type details.
        for (Vehicle v : vehicles) {
            System.out.println(v);
        }
    }

    private static void viewAvailableVehicles() {
        System.out.println("\n--- Available Vehicles ---");
        boolean found = false;
        for (Vehicle v : vehicles) {
            if (v.isAvailable()) {
                if (!found) {
                    printVehicleHeader();
                    found = true;
                }
                System.out.println(v);
            }
        }
        if (!found) {
            System.out.println("  No vehicles are currently available.");
        }
    }

    private static void printVehicleHeader() {
        System.out.printf("%-6s %-7s %-12s %-12s %-11s %-10s %s%n",
                "TYPE", "ID", "BRAND", "MODEL", "RATE/DAY", "STATUS", "DETAILS");
    }

    // ============================ CUSTOMER FEATURES ============================

    private static void registerCustomer() {
        System.out.println("\n--- Register Customer ---");
        String id = readNonEmpty("Customer ID (e.g. C001): ");
        if (id == null) {
            return;
        }
        if (findCustomerById(id) != null) {
            System.out.println("  ! A customer with ID " + id + " already exists.");
            return;
        }
        String name = readNonEmpty("Customer name: ");
        if (name == null) {
            return;
        }
        String phone = readNonEmpty("Phone number: ");
        if (phone == null) {
            return;
        }
        String email = readNonEmpty("Email: ");
        if (email == null) {
            return;
        }

        try {
            Customer customer = new Customer(id, name, phone, email);
            customers.add(customer);
            System.out.println("  Customer registered successfully.");
            System.out.println("  " + customer);
        } catch (IllegalArgumentException e) {
            System.out.println("  ! Could not register customer: " + e.getMessage());
        }
    }

    private static void viewCustomers() {
        System.out.println("\n--- Registered Customers ---");
        if (customers.isEmpty()) {
            System.out.println("  No customers registered yet.");
            return;
        }
        System.out.printf("%-8s %-18s %-14s %s%n", "ID", "NAME", "PHONE", "EMAIL");
        for (Customer c : customers) {
            System.out.println(c);
        }
    }

    // ============================ RENTAL FEATURES ============================

    private static void rentVehicle() {
        System.out.println("\n--- Rent a Vehicle ---");
        if (vehicles.isEmpty()) {
            System.out.println("  No vehicles registered yet.");
            return;
        }
        if (customers.isEmpty()) {
            System.out.println("  No customers registered yet. Please register a customer first.");
            return;
        }

        String customerId = readNonEmpty("Customer ID: ");
        if (customerId == null) {
            return;
        }
        Customer customer = findCustomerById(customerId);
        if (customer == null) {
            System.out.println("  ! No customer found with ID " + customerId + ".");
            return;
        }

        String vehicleId = readNonEmpty("Vehicle ID: ");
        if (vehicleId == null) {
            return;
        }
        Vehicle vehicle = findVehicleById(vehicleId);
        if (vehicle == null) {
            System.out.println("  ! No vehicle found with ID " + vehicleId + ".");
            return;
        }
        Integer days = readPositiveInt("Number of days: ");
        if (days == null) {
            return;
        }

        // OVERLOADED method: this variant has no discount.
        double cost = Payment.calculateAmount(vehicle, days);
        System.out.println("  Vehicle type : " + vehicle.getVehicleType());
        printCostBreakdown(vehicle, days);
        System.out.println("  Rental cost  : Rs." + String.format("%.2f", cost));

        String method = readNonEmpty("Payment method (Cash/Card/UPI): ");
        if (method == null) {
            return;
        }

        try {
            // EXCEPTION HANDLING: rent() throws VehicleNotAvailableException.
            vehicle.rent();
        } catch (VehicleNotAvailableException e) {
            System.out.println("  ! Rental failed: " + e.getMessage());
            return;
        }

        String today = LocalDate.now().toString();
        String rentalId = generateId("R", rentals.size());
        Rental rental = new Rental(rentalId, customer, vehicle, days, cost, today);
        rentals.add(rental);

        String paymentId = generateId("P", payments.size());
        Payment payment = new Payment(paymentId, rental, cost, method);
        payments.add(payment);

        System.out.println("  Rental recorded successfully.");
        System.out.println("  Rental  : " + rental);
        System.out.println("  Payment : " + payment);
    }

    private static void returnVehicle() {
        System.out.println("\n--- Return a Vehicle ---");

        ArrayList<Rental> activeRentals = new ArrayList<>();
        for (Rental r : rentals) {
            if (!r.isReturned()) {
                activeRentals.add(r);
            }
        }
        if (activeRentals.isEmpty()) {
            System.out.println("  No active rentals to return.");
            return;
        }

        System.out.println("Active rentals:");
        printRentalHeader();
        for (Rental r : activeRentals) {
            System.out.println(r);
        }

        String rentalId = readNonEmpty("Enter Rental ID to return: ");
        if (rentalId == null) {
            return;
        }
        Rental rental = findRentalById(rentalId);
        if (rental == null) {
            System.out.println("  ! No rental found with ID " + rentalId + ".");
            return;
        }
        if (rental.isReturned()) {
            System.out.println("  ! Rental " + rentalId + " has already been returned.");
            return;
        }

        String today = LocalDate.now().toString();
        rental.markReturned(today);
        rental.getVehicle().returnVehicle();   // vehicle becomes available again

        Payment payment = findPaymentByRental(rental);
        if (payment != null) {
            payment.markPaid(today);
        }

        System.out.println("  Vehicle returned successfully.");
        System.out.println("  Rental ID     : " + rental.getRentalId());
        System.out.println("  Vehicle       : " + rental.getVehicle().getVehicleId()
                + " (" + rental.getVehicle().getBrand() + " " + rental.getVehicle().getModel() + ")");
        System.out.println("  Final charges : Rs." + String.format("%.2f", rental.getTotalCost()));
        System.out.println("  The vehicle is now available for rent again.");
    }

    private static void calculateCharges() {
        System.out.println("\n--- Calculate Rental Charges ---");
        if (vehicles.isEmpty()) {
            System.out.println("  No vehicles registered yet.");
            return;
        }

        String vehicleId = readNonEmpty("Vehicle ID: ");
        if (vehicleId == null) {
            return;
        }
        Vehicle vehicle = findVehicleById(vehicleId);
        if (vehicle == null) {
            System.out.println("  ! No vehicle found with ID " + vehicleId + ".");
            return;
        }

        Integer days = readPositiveInt("Number of days: ");
        if (days == null) {
            return;
        }
        double discount = readOptionalNonNegativeDouble("Discount percent [Enter for none]: ", 0.0);

        // POLYMORPHISM + OVERLOADING: the correct calculateRent() version is
        // chosen based on the object type and on the number of arguments.
        double amount;
        if (discount > 0) {
            amount = Payment.calculateAmount(vehicle, days, discount);   // overloaded (3 args)
        } else {
            amount = Payment.calculateAmount(vehicle, days);             // overloaded (2 args)
        }

        System.out.println("\n  Vehicle      : " + vehicle.getVehicleType()
                + " (" + vehicle.getBrand() + " " + vehicle.getModel() + ")");
        System.out.println("  Rate per day : Rs." + String.format("%.2f", vehicle.getRentalRatePerDay()));
        System.out.println("  Days         : " + days);
        boolean itemized = printCostBreakdown(vehicle, days);
        if (discount > 0) {
            if (itemized) {
                double subtotal = Payment.calculateAmount(vehicle, days);
                System.out.println("    Subtotal     = Rs." + String.format("%.2f", subtotal));
            }
            System.out.println("  Discount     : " + discount + "%");
        }
        System.out.println("  Total charge : Rs." + String.format("%.2f", amount));
    }

    /**
     * Prints the itemized cost breakdown for a vehicle, but only when the
     * vehicle adds extra charges (or a discount) on top of the base rent.
     * The lines come from the vehicle itself, so the pricing rules are not
     * repeated here. The total printed by the caller stays authoritative.
     *
     * @return true if a breakdown was printed, false if only base rent applies
     */
    private static boolean printCostBreakdown(Vehicle vehicle, int days) {
        ArrayList<String> lines = vehicle.getRentalBreakdown(days);
        if (lines.size() <= 1) {
            return false;   // base rent only: nothing extra to itemize
        }
        System.out.println("  Cost breakdown:");
        for (String line : lines) {
            System.out.println("    - " + line);
        }
        return true;
    }

    private static void viewRentalHistory() {
        System.out.println("\n--- Rental History ---");
        if (rentals.isEmpty()) {
            System.out.println("  No rentals recorded yet.");
            return;
        }
        printRentalHeader();
        for (Rental r : rentals) {
            System.out.println(r);
        }
    }

    private static void printRentalHeader() {
        System.out.printf("%-6s %-8s %-7s %-4s %-13s %-12s %-12s %s%n",
                "ID", "CUST", "VEHICLE", "DAYS", "COST", "RENT DATE", "RETURN DATE", "STATUS");
    }

    // ============================ MAINTENANCE FEATURES ============================

    private static void maintenanceMenu() {
        while (true) {
            System.out.println("\n--- Maintenance ---");
            System.out.println("  1. Add maintenance record");
            System.out.println("  2. View maintenance records");
            System.out.println("  3. Back to main menu");
            Integer choice = readInt("Enter your choice: ");
            if (choice == null) {
                return;
            }
            if (choice == 1) {
                addMaintenance();
            } else if (choice == 2) {
                viewMaintenance();
            } else if (choice == 3) {
                return;
            } else {
                System.out.println("  ! Invalid choice. Please enter 1, 2 or 3.");
            }
        }
    }

    private static void addMaintenance() {
        System.out.println("\n--- Add Maintenance Record ---");
        if (vehicles.isEmpty()) {
            System.out.println("  No vehicles registered yet.");
            return;
        }
        String vehicleId = readNonEmpty("Vehicle ID: ");
        if (vehicleId == null) {
            return;
        }
        Vehicle vehicle = findVehicleById(vehicleId);
        if (vehicle == null) {
            System.out.println("  ! No vehicle found with ID " + vehicleId + ".");
            return;
        }
        String description = readNonEmpty("Maintenance description: ");
        if (description == null) {
            return;
        }
        double cost = readOptionalNonNegativeDouble("Cost in Rs. [Enter for 0]: ", 0.0);

        String today = LocalDate.now().toString();
        String maintenanceId = generateId("M", maintenanceRecords.size());
        try {
            Maintenance record = new Maintenance(maintenanceId, vehicle, description, today, cost);
            maintenanceRecords.add(record);
            System.out.println("  Maintenance record added successfully.");
            System.out.println("  " + record);
        } catch (IllegalArgumentException e) {
            System.out.println("  ! Could not add record: " + e.getMessage());
        }
    }

    private static void viewMaintenance() {
        System.out.println("\n--- Maintenance Records ---");
        if (maintenanceRecords.isEmpty()) {
            System.out.println("  No maintenance records yet.");
            return;
        }
        System.out.printf("%-6s %-7s %-11s %-13s %s%n",
                "ID", "VEHICLE", "DATE", "COST", "DESCRIPTION");
        for (Maintenance m : maintenanceRecords) {
            System.out.println(m);
        }
    }

    // ============================ SAVE / LOAD FEATURES ============================

    private static void dataMenu() {
        while (true) {
            System.out.println("\n--- Save / Load Data ---");
            System.out.println("  1. Save data to files");
            System.out.println("  2. Load data from files");
            System.out.println("  3. Back to main menu");
            Integer choice = readInt("Enter your choice: ");
            if (choice == null) {
                return;
            }
            if (choice == 1) {
                saveData();
            } else if (choice == 2) {
                loadData();
            } else if (choice == 3) {
                return;
            } else {
                System.out.println("  ! Invalid choice. Please enter 1, 2 or 3.");
            }
        }
    }

    /** Writes every record to its text file. Uses try-with-resources. */
    private static void saveData() {
        createDataDirectory();
        saveVehicles();
        saveCustomers();
        saveRentals();
        saveMaintenance();
        System.out.println("  Data saved to the '" + DATA_DIR + "' folder.");
    }

    private static void saveVehicles() {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(VEHICLE_FILE))) {
            for (Vehicle v : vehicles) {
                writer.write(v.toFileString());
                writer.newLine();
            }
        } catch (IOException e) {
            System.out.println("  ! Could not save vehicles: " + e.getMessage());
        }
    }

    private static void saveCustomers() {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(CUSTOMER_FILE))) {
            for (Customer c : customers) {
                writer.write(c.toFileString());
                writer.newLine();
            }
        } catch (IOException e) {
            System.out.println("  ! Could not save customers: " + e.getMessage());
        }
    }

    private static void saveRentals() {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(RENTAL_FILE))) {
            for (Rental r : rentals) {
                writer.write(r.toFileString());
                writer.newLine();
            }
        } catch (IOException e) {
            System.out.println("  ! Could not save rentals: " + e.getMessage());
        }
    }

    private static void saveMaintenance() {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(MAINTENANCE_FILE))) {
            for (Maintenance m : maintenanceRecords) {
                writer.write(m.toFileString());
                writer.newLine();
            }
        } catch (IOException e) {
            System.out.println("  ! Could not save maintenance records: " + e.getMessage());
        }
    }

    /** Loads all files, replacing whatever is currently in memory. */
    private static void loadData() {
        vehicles.clear();
        customers.clear();
        rentals.clear();
        maintenanceRecords.clear();
        payments.clear();

        loadVehicles();
        loadCustomers();
        loadRentals();       // needs vehicles + customers already loaded
        loadMaintenance();   // needs vehicles already loaded
        reconcileVehicleAvailability();

        System.out.println("Loaded " + vehicles.size() + " vehicle(s), "
                + customers.size() + " customer(s), "
                + rentals.size() + " rental(s), "
                + maintenanceRecords.size() + " maintenance record(s).");
    }

    private static void loadVehicles() {
        File file = new File(VEHICLE_FILE);
        if (!file.exists()) {
            return;
        }
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty()) {
                    continue;
                }
                Vehicle vehicle = Vehicle.fromFileString(line);
                if (vehicle == null) {
                    System.out.println("  ! Skipped malformed vehicle record: " + line);
                    continue;
                }
                if (findVehicleById(vehicle.getVehicleId()) != null) {
                    continue; // skip duplicate IDs
                }
                vehicles.add(vehicle);
            }
        } catch (IOException e) {
            System.out.println("  ! Could not read vehicles: " + e.getMessage());
        }
    }

    private static void loadCustomers() {
        File file = new File(CUSTOMER_FILE);
        if (!file.exists()) {
            return;
        }
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty()) {
                    continue;
                }
                Customer customer = Customer.fromFileString(line);
                if (customer == null) {
                    System.out.println("  ! Skipped malformed customer record: " + line);
                    continue;
                }
                if (findCustomerById(customer.getCustomerId()) != null) {
                    continue; // skip duplicate IDs
                }
                customers.add(customer);
            }
        } catch (IOException e) {
            System.out.println("  ! Could not read customers: " + e.getMessage());
        }
    }

    private static void loadRentals() {
        File file = new File(RENTAL_FILE);
        if (!file.exists()) {
            return;
        }
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty()) {
                    continue;
                }
                Rental rental = Rental.fromFileString(line, customers, vehicles);
                if (rental == null) {
                    System.out.println("  ! Skipped malformed rental record: " + line);
                    continue;
                }
                rentals.add(rental);
            }
        } catch (IOException e) {
            System.out.println("  ! Could not read rentals: " + e.getMessage());
        }
    }

    private static void loadMaintenance() {
        File file = new File(MAINTENANCE_FILE);
        if (!file.exists()) {
            return;
        }
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty()) {
                    continue;
                }
                Maintenance record = Maintenance.fromFileString(line, vehicles);
                if (record == null) {
                    System.out.println("  ! Skipped malformed maintenance record: " + line);
                    continue;
                }
                maintenanceRecords.add(record);
            }
        } catch (IOException e) {
            System.out.println("  ! Could not read maintenance records: " + e.getMessage());
        }
    }

    /**
     * Keeps availability consistent after a restart: a vehicle is unavailable
     * exactly when it has a rental that has not been returned yet.
     */
    private static void reconcileVehicleAvailability() {
        for (Vehicle v : vehicles) {
            v.setAvailable(true);
        }
        for (Rental r : rentals) {
            if (!r.isReturned()) {
                r.getVehicle().setAvailable(false);
            }
        }
    }

    // ============================ LOOKUP HELPERS ============================

    private static Vehicle findVehicleById(String vehicleId) {
        for (Vehicle v : vehicles) {
            if (v.getVehicleId().equalsIgnoreCase(vehicleId)) {
                return v;
            }
        }
        return null;
    }

    private static Customer findCustomerById(String customerId) {
        for (Customer c : customers) {
            if (c.getCustomerId().equalsIgnoreCase(customerId)) {
                return c;
            }
        }
        return null;
    }

    private static Rental findRentalById(String rentalId) {
        for (Rental r : rentals) {
            if (r.getRentalId().equalsIgnoreCase(rentalId)) {
                return r;
            }
        }
        return null;
    }

    private static Payment findPaymentByRental(Rental rental) {
        for (Payment p : payments) {
            if (p.getRental() == rental) {
                return p;
            }
        }
        return null;
    }

    /** Builds IDs such as R001, P001, M001 from the current record count. */
    private static String generateId(String prefix, int currentCount) {
        return prefix + String.format("%03d", currentCount + 1);
    }

    // ============================ INPUT HELPERS ============================

    private static String nextLine() {
        if (scanner.hasNextLine()) {
            return scanner.nextLine();
        }
        return null; // end of input (for example when input is piped in)
    }

    private static String readNonEmpty(String prompt) {
        while (true) {
            System.out.print(prompt);
            String value = nextLine();
            if (value == null) {
                return null;
            }
            value = value.trim();
            if (!value.isEmpty()) {
                return value;
            }
            System.out.println("  ! Input cannot be empty.");
        }
    }

    private static Integer readInt(String prompt) {
        while (true) {
            System.out.print(prompt);
            String value = nextLine();
            if (value == null) {
                return null;
            }
            value = value.trim();
            try {
                return Integer.parseInt(value);
            } catch (NumberFormatException e) {
                System.out.println("  ! Please enter a valid whole number.");
            }
        }
    }

    private static Integer readPositiveInt(String prompt) {
        while (true) {
            Integer value = readInt(prompt);
            if (value == null) {
                return null;
            }
            if (value > 0) {
                return value;
            }
            System.out.println("  ! Value must be a positive whole number.");
        }
    }

    private static int readOptionalPositiveInt(String prompt, int defaultValue) {
        while (true) {
            System.out.print(prompt);
            String value = nextLine();
            if (value == null) {
                return defaultValue;
            }
            value = value.trim();
            if (value.isEmpty()) {
                return defaultValue;
            }
            try {
                int parsed = Integer.parseInt(value);
                if (parsed > 0) {
                    return parsed;
                }
                System.out.println("  ! Value must be positive.");
            } catch (NumberFormatException e) {
                System.out.println("  ! Please enter a valid whole number or press Enter for the default.");
            }
        }
    }

    private static double readOptionalPositiveDouble(String prompt, double defaultValue) {
        while (true) {
            System.out.print(prompt);
            String value = nextLine();
            if (value == null) {
                return defaultValue;
            }
            value = value.trim();
            if (value.isEmpty()) {
                return defaultValue;
            }
            try {
                double parsed = Double.parseDouble(value);
                if (parsed > 0) {
                    return parsed;
                }
                System.out.println("  ! Value must be positive.");
            } catch (NumberFormatException e) {
                System.out.println("  ! Please enter a valid number or press Enter for the default.");
            }
        }
    }

    private static double readOptionalNonNegativeDouble(String prompt, double defaultValue) {
        while (true) {
            System.out.print(prompt);
            String value = nextLine();
            if (value == null) {
                return defaultValue;
            }
            value = value.trim();
            if (value.isEmpty()) {
                return defaultValue;
            }
            try {
                double parsed = Double.parseDouble(value);
                if (parsed >= 0) {
                    return parsed;
                }
                System.out.println("  ! Value cannot be negative.");
            } catch (NumberFormatException e) {
                System.out.println("  ! Please enter a valid number or press Enter for the default.");
            }
        }
    }

    // ============================ SETUP HELPERS ============================

    private static void createDataDirectory() {
        File dir = new File(DATA_DIR);
        if (!dir.exists()) {
            if (dir.mkdirs()) {
                System.out.println("Created data directory: " + dir.getAbsolutePath());
            } else {
                System.out.println("  ! Could not create the data directory.");
            }
        }
    }
}
