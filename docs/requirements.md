# Requirements Document

**Project:** Vehicle Rental Management System
**Course:** CSC2104 - Object Oriented Programming with Java
**Type:** OOPS Mini Project (Core Java console application)

---

## 1. Problem Statement

A small vehicle rental business owns a mix of cars, bikes, buses and trucks.
Managing this manually causes problems:

* it is hard to know which vehicles are available at any moment,
* rental charges are calculated by hand and mistakes happen,
* there is no reliable record of who rented what and when it was returned,
* maintenance history is not tracked, and
* records are lost every time the program is closed.

The business needs a simple software tool that keeps vehicle, customer, rental,
payment and maintenance information in one place and can remember it between
sessions - without needing a database.

---

## 2. Objectives

1. Build a working console application in Core Java that manages the complete
   rental lifecycle: add vehicle -> register customer -> rent -> return.
2. Correctly calculate rental charges based on the vehicle type and the number
   of rental days.
3. Prevent invalid operations such as renting an already-rented vehicle,
   using a non-existent customer/vehicle ID, or entering a non-positive
   number of days.
4. Persist all important data to text files and reload it on the next start.
5. Clearly demonstrate the required OOP concepts so they can be explained in a viva.

---

## 3. Scope

**In scope**

* Adding and viewing vehicles (Car, Bike, Bus, Truck).
* Registering and viewing customers.
* Renting a vehicle to a customer and returning it.
* Rental charge calculation (with an optional discount).
* Viewing rental history.
* Recording and viewing maintenance details.
* Saving to and loading from simple `.txt` files in a `data` folder.

**Out of scope**

* Databases (MySQL/SQL), web or mobile front ends, REST APIs.
* Authentication / user accounts / roles.
* Online payment gateways (payments are recorded, not processed).
* Multi-user or networked access.
* Deleting or editing existing records (records are added, not removed).

---

## 4. Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | The system shall allow the user to add a vehicle of type Car, Bike, Bus or Truck with a unique ID, brand, model, rate and a type-specific detail. | Must |
| FR-02 | The system shall not allow two vehicles with the same ID. | Must |
| FR-03 | The system shall display all registered vehicles and their availability. | Must |
| FR-04 | The system shall display only the available vehicles. | Must |
| FR-05 | The system shall allow registering a customer with a unique ID, name, phone and email. | Must |
| FR-06 | The system shall not allow two customers with the same ID. | Must |
| FR-07 | The system shall display all registered customers. | Must |
| FR-08 | The system shall allow renting a vehicle to an existing customer for a positive number of days. | Must |
| FR-09 | The system shall refuse to rent a vehicle that is already rented and report it using `VehicleNotAvailableException`. | Must |
| FR-10 | The system shall calculate the rental cost from the vehicle type and the number of days. | Must |
| FR-11 | The system shall allow the user to estimate rental charges with an optional discount without creating a rental. | Should |
| FR-12 | The system shall allow returning a rented vehicle, which marks the rental as complete and makes the vehicle available again. | Must |
| FR-13 | The system shall display the full rental history with status (Active / Returned). | Must |
| FR-14 | The system shall allow recording maintenance details (vehicle, description, cost, date). | Must |
| FR-15 | The system shall display recorded maintenance details. | Should |
| FR-16 | The system shall save vehicles, customers, rentals and maintenance records to text files. | Must |
| FR-17 | The system shall load saved records automatically on startup and keep vehicle availability consistent. | Must |
| FR-18 | The system shall skip malformed data-file records without crashing. | Should |
| FR-19 | The system shall handle non-numeric and invalid input gracefully by re-prompting. | Must |
| FR-20 | The system shall save data automatically before exiting. | Must |

---

## 5. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | **Usability:** simple numbered console menu; clear prompts and error messages. |
| NFR-02 | **Reliability:** invalid input must not crash the program; a failed file read must not stop the app. |
| NFR-03 | **Maintainability:** modular classes, short methods, meaningful names, OOP-based design. |
| NFR-04 | **Portability:** runs on any machine with a JDK (tested with JDK 17); no external libraries. |
| NFR-05 | **Performance:** instant response for the small data sizes expected in a mini project. |
| NFR-06 | **Understandability:** beginner-friendly code suitable for a viva explanation. |
| NFR-07 | **Data integrity:** saved records must not be lost or duplicated on save/load. |

---

## 6. OOP Requirements Mapping

| Requirement | How it is satisfied |
|-------------|---------------------|
| Encapsulation & constructors | Private fields + validating getters/setters + constructors in `Vehicle`, `Customer`, `Rental`, `Payment`, `Maintenance`. |
| Inheritance & abstraction | `Car`/`Bike`/`Bus`/`Truck` extend the abstract `Vehicle`. |
| Polymorphism | Method **overriding** of `calculateRent(int)`; method **overloading** of `calculateRent(int, double)` and `Payment.calculateAmount(...)`; runtime dispatch through `ArrayList<Vehicle>`. |
| Interface & collections | `Rentable` interface implemented by `Vehicle`; `ArrayList` used for every record type in `Main`. |
| Exception & file handling | `VehicleNotAvailableException` + `try-catch`; `Main.saveData()` / `Main.loadData()` using `java.io`. |
| Code quality | Modular, commented, consistent style; no placeholder or TODO methods. |

---

## 7. Assumptions and Constraints

* The user interacts through a single console; one session at a time.
* Sample rental rates are acceptable; the user may override the rate per vehicle.
* Dates are taken from the system clock.
* The `data` folder is created next to the running program.
