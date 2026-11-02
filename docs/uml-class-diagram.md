# UML Class Diagram

The diagram below reflects the classes that are **actually implemented** in the
`src` folder. It uses Mermaid syntax, which renders automatically in VS Code
(install a Markdown/Mermaid preview) and on GitHub.

```mermaid
classDiagram
    direction TB

    class Rentable {
        <<interface>>
        +rent() boolean
        +returnVehicle() void
        +isAvailable() boolean
    }

    class Vehicle {
        <<abstract>>
        -vehicleId : String
        -brand : String
        -model : String
        -rentalRatePerDay : double
        -available : boolean
        +Vehicle(vehicleId, brand, model, rentalRatePerDay)
        +calculateRent(days : int) double*
        +calculateRent(days : int, discountPercent : double) double
        +getVehicleType() String*
        +extraFieldForFile() String*
        +getSpecification() String*
        +getRentalBreakdown(days : int) ArrayList~String~
        +rent() boolean
        +returnVehicle() void
        +isAvailable() boolean
        +toFileString() String
        +fromFileString(line : String) Vehicle$
    }

    class Car {
        -numberOfSeats : int
        +DEFAULT_RATE = 2000.0
        +calculateRent(days : int) double
    }

    class Bike {
        -engineCapacityCc : int
        +DEFAULT_RATE = 500.0
        +calculateRent(days : int) double
        +getRentalBreakdown(days : int) ArrayList~String~
    }

    class Bus {
        -seatingCapacity : int
        +DEFAULT_RATE = 5000.0
        +DRIVER_ALLOWANCE_PER_DAY = 500.0
        +calculateRent(days : int) double
        +getRentalBreakdown(days : int) ArrayList~String~
    }

    class Truck {
        -loadCapacityTons : double
        +DEFAULT_RATE = 3500.0
        +LOADING_CHARGE = 1000.0
        +calculateRent(days : int) double
        +getRentalBreakdown(days : int) ArrayList~String~
    }

    class Customer {
        -customerId : String
        -name : String
        -phone : String
        -email : String
        +Customer(customerId, name, phone, email)
        +toFileString() String
        +fromFileString(line : String) Customer$
    }

    class Rental {
        -rentalId : String
        -customer : Customer
        -vehicle : Vehicle
        -days : int
        -totalCost : double
        -rentDate : String
        -returnDate : String
        -returned : boolean
        +Rental(rentalId, customer, vehicle, days, totalCost, rentDate)
        +markReturned(returnDate : String) void
        +toFileString() String
        +fromFileString(line, customers, vehicles) Rental$
    }

    class Payment {
        -paymentId : String
        -rental : Rental
        -amount : double
        -method : String
        -status : String
        -paymentDate : String
        +Payment(paymentId, rental, amount, method)
        +markPaid(paymentDate : String) void
        +calculateAmount(vehicle : Vehicle, days : int) double$
        +calculateAmount(vehicle : Vehicle, days : int, discountPercent : double) double$
    }

    class Maintenance {
        -maintenanceId : String
        -vehicle : Vehicle
        -description : String
        -date : String
        -cost : double
        +Maintenance(maintenanceId, vehicle, description, date, cost)
        +toFileString() String
        +fromFileString(line, vehicles) Maintenance$
    }

    class VehicleNotAvailableException {
        <<checked exception>>
        +VehicleNotAvailableException(message : String)
    }

    class Main {
        -vehicles : ArrayList~Vehicle~
        -customers : ArrayList~Customer~
        -rentals : ArrayList~Rental~
        -maintenanceRecords : ArrayList~Maintenance~
        -payments : ArrayList~Payment~
        +main(args : String[]) void$
        +loadData() void$
        +saveData() void$
    }

    %% Interface realisation
    Rentable <|.. Vehicle : implements

    %% Inheritance
    Vehicle <|-- Car
    Vehicle <|-- Bike
    Vehicle <|-- Bus
    Vehicle <|-- Truck

    %% Association / composition
    Rental --> "1" Customer : has
    Rental --> "1" Vehicle : has
    Payment --> "1" Rental : for
    Maintenance --> "1" Vehicle : for

    %% Main aggregates the collections
    Main o-- "0..*" Vehicle
    Main o-- "0..*" Customer
    Main o-- "0..*" Rental
    Main o-- "0..*" Maintenance
    Main o-- "0..*" Payment

    %% Exception dependency
    Vehicle ..> VehicleNotAvailableException : throws
    Main ..> VehicleNotAvailableException : catches
```

---

## Reading the diagram

| Symbol | Meaning in this project |
|--------|-------------------------|
| `<<interface>>` | `Rentable` - only declares behaviour, no fields. |
| `<<abstract>>` | `Vehicle` - cannot be instantiated directly; has the abstract `calculateRent`. |
| `<|..` | Realisation: `Vehicle` implements `Rentable`. |
| `<|--` | Inheritance (generalisation): the four vehicle types extend `Vehicle`. |
| `-->` | Association: `Rental` holds a `Customer` and a `Vehicle`; `Payment` holds a `Rental`; `Maintenance` holds a `Vehicle`. |
| `o--` | Aggregation: `Main` owns the `ArrayList`s of records. |
| `..>` | Dependency: `Vehicle.rent()` throws, and `Main` catches, `VehicleNotAvailableException`. |
| `$` suffix | Static member (for example `Vehicle.fromFileString`). |

## Relationship summary

* **Inheritance (is-a):** `Car`, `Bike`, `Bus`, `Truck` are all `Vehicle`s.
* **Realisation:** `Vehicle` (and therefore all subclasses) is `Rentable`.
* **Composition / association (has-a):**
  * `Rental` -> `Customer` (the renter),
  * `Rental` -> `Vehicle` (the rented item),
  * `Payment` -> `Rental` (the rental being paid for),
  * `Maintenance` -> `Vehicle` (the vehicle being serviced).
* **Aggregation:** `Main` keeps `ArrayList` collections of all record types.
* **Dependency:** the custom `VehicleNotAvailableException` flows from
  `Vehicle.rent()` up to `Main`.
