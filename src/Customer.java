/**
 * Customer - stores the details of a person who rents vehicles.
 * Demonstrates ENCAPSULATION: private fields, a constructor and validated
 * getters/setters.
 */
public class Customer {

    private String customerId;
    private String name;
    private String phone;
    private String email;

    public Customer(String customerId, String name, String phone, String email) {
        setCustomerId(customerId);
        setName(name);
        setPhone(phone);
        setEmail(email);
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        if (customerId == null || customerId.trim().isEmpty()) {
            throw new IllegalArgumentException("Customer ID cannot be empty");
        }
        this.customerId = customerId.trim();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Customer name cannot be empty");
        }
        this.name = name.trim();
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number cannot be empty");
        }
        this.phone = phone.trim();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        this.email = email.trim();
    }

    // ------------------------ File handling support ------------------------

    public String toFileString() {
        return customerId + "|" + clean(name) + "|" + clean(phone) + "|" + clean(email);
    }

    /** Returns null for a malformed line so the caller can skip it. */
    public static Customer fromFileString(String line) {
        String[] parts = line.split("\\|", -1);
        if (parts.length < 4) {
            return null;
        }
        try {
            return new Customer(parts[0].trim(), parts[1].trim(), parts[2].trim(), parts[3].trim());
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
        return String.format("%-8s %-18s %-14s %s", customerId, name, phone, email);
    }
}
