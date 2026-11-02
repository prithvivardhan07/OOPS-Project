# Vehicle Rental Management System

A beginner-friendly **Core Java console application** built as an OOPS mini project
(CSC2104). It manages vehicles, customers, rentals, returns, payments and
maintenance using Object-Oriented Programming concepts and stores all data in
simple text files.

---

## 1. Project Overview and Objectives

The system helps a small vehicle rental business keep track of:

* which vehicles it owns and whether each one is available,
* who its customers are,
* which customer has rented which vehicle and for how many days,
* how much each rental costs,
* when a vehicle is returned, and
* any maintenance work done on a vehicle.

**Objectives**

* Apply the core OOP pillars (encapsulation, inheritance, abstraction,
  polymorphism, interfaces) to a real, understandable problem.
* Use `ArrayList` collections to store objects in memory.
* Use Java file I/O for persistent storage without any database.
* Write clean, well-commented, viva-explainable code.

---

## 2. Features

1. Add a vehicle (Car / Bike / Bus / Truck).
2. View all vehicles.
3. View only the available vehicles.
4. Register a customer.
5. View registered customers.
6. Rent a vehicle to a customer.
7. Return a rented vehicle.
8. Calculate rental charges based on vehicle type and number of days
   (optional discount supported).
9. View full rental history.
10. Record and view vehicle maintenance details.
11. Save data to text files and load data back from them.
12. Exit the application (data is saved automatically).

**Validation included**

* Duplicate vehicle IDs and customer IDs are rejected.
* A rental needs an existing customer and an existing vehicle.
* Rental duration must be a positive whole number.
* A vehicle that is already rented cannot be rented again
  (`VehicleNotAvailableException`).
* Non-numeric menu/amount input is re-prompted instead of crashing.
* Malformed lines in the data files are skipped with a warning.

---

## 3. Technologies Used

* **Language:** Java (tested with JDK 17).
* **Libraries:** only the standard Core Java library
  (`java.util.ArrayList`, `java.util.Scanner`, `java.io`, `java.time`).
* **Storage:** plain `.txt` files in the `data` folder (no database).
* **Editor:** VS Code friendly (works with the "Extension Pack for Java").

No MySQL, no Spring Boot, no web frameworks, no external libraries, no build tools.

---

## 4. Project Folder Structure

```
Vehicle_Rental/
├── src/
│   ├── Main.java
│   ├── Vehicle.java
│   ├── Car.java
│   ├── Bike.java
│   ├── Bus.java
│   ├── Truck.java
│   ├── Rentable.java
│   ├── Customer.java
│   ├── Rental.java
│   ├── Payment.java
│   ├── Maintenance.java
│   └── VehicleNotAvailableException.java
├── data/
│   ├── vehicles.txt
│   ├── customers.txt
│   ├── rentals.txt
│   └── maintenance.txt
├── docs/
│   ├── requirements.md
│   ├── test-cases.md
│   └── uml-class-diagram.md
├── .vscode/
│   └── settings.json
└── README.md
```

---

## 5. How to Compile and Run

### Option A - From the VS Code Run button

1. Open the `Vehicle_Rental` folder in VS Code.
2. Install the **Extension Pack for Java** if it is not installed already.
3. Open `src/Main.java` and click the **Run** button (or press `F5`).
4. The program starts in the VS Code integrated terminal.

### Option B - From the terminal / command prompt

Open a terminal in the project root (`Vehicle_Rental`) and run:

```bash
# 1. Compile all source files into the out folder
javac -d out src/*.java

# 2. Run the application
java -cp out Main
```

On Windows PowerShell the same commands work as written above.
The application automatically creates the `data` folder on first run and loads
any existing records from it.

---

## 6. Sample Console Workflow

```
================= MAIN MENU =================
 1.  Add a vehicle
 ...
 12. Exit
=============================================
Enter your choice: 1

--- Add Vehicle ---
Vehicle type (Car/Bike/Bus/Truck): Car
Vehicle ID (e.g. V001): V001
Brand: Toyota
Model: Corolla
Rental rate per day [Enter for default Rs.2000.0]:      <- press Enter
Number of seats [Enter for default 5]: 5
  Vehicle added successfully.
  Car    V001    Toyota       Corolla      Rs.2000.00  Available  Seats: 5

Enter your choice: 4

--- Register Customer ---
Customer ID (e.g. C001): C001
Customer name: Alice
Phone number: 9876543210
Email: alice@example.com
  Customer registered successfully.

Enter your choice: 6

--- Rent a Vehicle ---
Customer ID: C001
Vehicle ID: V001
Number of days: 3
  Vehicle type : Car
  Rental cost  : Rs.6000.00
Payment method (Cash/Card/UPI): Cash
  Rental recorded successfully.
  Rental  : R001   C001     V001    3    Rs.6000.00    2026-10-12   -            Active

Enter your choice: 7

--- Return a Vehicle ---
Active rentals:
ID     CUST     VEHICLE DAYS COST          RENT DATE    RETURN DATE  STATUS
R001   C001     V001    3    Rs.6000.00    2026-10-12   -            Active
Enter Rental ID to return: R001
  Vehicle returned successfully.
  The vehicle is now available for rent again.

Enter your choice: 12
Data saved. Thank you for using the Vehicle Rental Management System!
```

### Sample rental rates and rules

| Vehicle | Default rate / day | Pricing rule |
|---------|--------------------|--------------|
| Car     | Rs. 2000           | rate × days |
| Bike    | Rs. 500            | rate × days, **5% discount if 7+ days** |
| Bus     | Rs. 5000           | (rate + Rs. 500 driver allowance) × days |
| Truck   | Rs. 3500           | rate × days + Rs. 1000 fixed loading charge |

A further discount can be applied in menu option **8 (Calculate rental charges)**.

---

## 7. OOP Concepts Demonstrated (with class names)

| Concept | Where it is used |
|---------|------------------|
| **Encapsulation** | `Vehicle`, `Customer`, `Rental`, `Payment`, `Maintenance` - all fields are `private`, accessed through getters/setters that validate data. |
| **Inheritance** | `Car`, `Bike`, `Bus`, `Truck` all `extend Vehicle`. |
| **Abstraction** | `Vehicle` is an `abstract` class with the abstract method `calculateRent(int days)`. |
| **Method Overriding** | Each subclass overrides `calculateRent(int days)` with its own pricing rule. |
| **Runtime Polymorphism** | `ArrayList<Vehicle>` holds different subclasses; `v.calculateRent(days)` calls the correct version at runtime. Also used through `Payment.calculateAmount(Vehicle, int)`. |
| **Method Overloading** | `Vehicle.calculateRent(int)` and `Vehicle.calculateRent(int, double)`; `Payment.calculateAmount(Vehicle, int)` and `Payment.calculateAmount(Vehicle, int, double)`. |
| **Interface** | `Rentable` declares `rent()`, `returnVehicle()` and `isAvailable()`; `Vehicle` implements it. |
| **Collections** | `ArrayList<Vehicle>`, `ArrayList<Customer>`, `ArrayList<Rental>`, `ArrayList<Maintenance>`, `ArrayList<Payment>` in `Main`. |
| **Exception Handling** | Custom checked `VehicleNotAvailableException` thrown by `Vehicle.rent()` and caught in `Main`; `try-catch` also used for invalid numeric input and file errors. |
| **File Handling** | `Main.saveData()` / `Main.loadData()` and the `toFileString()` / `fromFileString()` methods of each class. |
| **Composition / Association** | `Rental` HAS-A `Customer` and HAS-A `Vehicle`; `Payment` HAS-A `Rental`; `Maintenance` HAS-A `Vehicle`. |

---

## 8. Data Storage Explanation

All records are kept in memory in `ArrayList`s while the program runs and are
written to text files inside the `data` folder. The format is simple and uses
`|` as the separator.

| File | One line per record | Format |
|------|---------------------|--------|
| `data/vehicles.txt` | vehicle | `type\|id\|brand\|model\|rate\|available\|extra` |
| `data/customers.txt` | customer | `id\|name\|phone\|email` |
| `data/rentals.txt` | rental | `rentalId\|customerId\|vehicleId\|days\|totalCost\|rentDate\|returnDate\|returned` |
| `data/maintenance.txt` | maintenance | `id\|vehicleId\|description\|date\|cost` |

Notes:

* The `data` directory is created automatically if it is missing.
* Records are loaded automatically at startup; the app prints how many were loaded.
* On load, a rental's stored `customerId` / `vehicleId` are matched back to the
  real in-memory objects. If the linked object is missing, that line is skipped.
* A malformed line (wrong number of fields, bad number, unknown vehicle type) is
  skipped with a warning instead of crashing.
* **Consistency rule:** after loading, vehicle availability is rebuilt from the
  rental records - a vehicle is marked as *Rented* only if it has a rental that
  has not been returned. This keeps availability correct after a restart.
* Saving **overwrites** each file with the current complete list, so no records
  are lost and duplicates are avoided.

---

## 9. Known Limitations

* Data is stored in plain text files, so it is not suitable for concurrent or
  multi-user access (acceptable for a console mini project).
* **Payments are not persisted** - `Payment` objects (receipts with status
  `Pending` / `Paid`) live only in memory for the current session. The four
  required data files are vehicles, customers, rentals and maintenance.
* Rental and maintenance IDs are generated from the current record count
  (R001, R002, ...), which assumes records are only added, never deleted.
* There is no authentication / login and no graphical user interface.
* Dates come from the system clock (`LocalDate.now()`); a rental is always
  recorded as returned on the day the "return" option is used.
* Amounts use `double`; for real financial software `BigDecimal` would be used.

---

## 10. Quick Reference - Menu Options

| Option | Action |
|--------|--------|
| 1 | Add a vehicle |
| 2 | View all vehicles |
| 3 | View available vehicles |
| 4 | Register a customer |
| 5 | View registered customers |
| 6 | Rent a vehicle to a customer |
| 7 | Return a rented vehicle |
| 8 | Calculate rental charges (with optional discount) |
| 9 | View rental history |
| 10 | Maintenance records (add / view) |
| 11 | Save / Load data |
| 12 | Exit (saves automatically) |
