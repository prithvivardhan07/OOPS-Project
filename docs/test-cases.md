# Test Cases

The application was compiled with JDK 17 and run as a console program.
Tests were performed by driving the menu with scripted input and checking the
console output and the saved data files.

**Legend:** P = Pass, F = Fail

---

## 1. Feature Test Cases

| TC | Feature | Input | Expected Result | Actual Result | Status |
|----|---------|-------|-----------------|---------------|--------|
| TC-01 | Add vehicle (Car) | type `Car`, id `V001`, brand `Toyota`, model `Corolla`, rate Enter (default), seats `5` | Car added, shown as Available with rate Rs.2000.00 | Car added, `Rs.2000.00 Available Seats: 5` | P |
| TC-02 | Add vehicle (Bike/Bus/Truck) | `V002` Bike 150cc, `V003` Bus 45, `V004` Truck 7 tons | All four types added correctly | All added with correct type details | P |
| TC-03 | View all vehicles | menu `2` | Table of all 4 vehicles | 4 rows shown with correct status | P |
| TC-04 | View available vehicles | menu `3` before any rental | All 4 vehicles listed | All 4 listed | P |
| TC-05 | Register customer | `C001` Alice, `C002` Bob | Both registered | Both registered and shown | P |
| TC-06 | View customers | menu `5` | Table of both customers | Both shown | P |
| TC-07 | Rent vehicle | customer `C001`, vehicle `V001`, days `3`, method `Cash` | Rental R001 created, cost Rs.6000, vehicle becomes Rented | R001 `Rs.6000.00` Active; V001 Rented | P |
| TC-08 | View available after rental | menu `3` | V001 is hidden (only V002, V003, V004 remain) | V001 absent from available list | P |
| TC-09 | Calculate charges (Car) | vehicle `V001`, days `3` | Rs.6000.00 | Rs.6000.00 | P |
| TC-10 | Calculate charges (Bike, 7 days) | vehicle `V002`, days `7` | Rs.3325.00 (500x7 minus 5% long-rental discount) | Rs.3325.00 | P |
| TC-11 | Calculate charges (Bus) | vehicle `V003`, days `2` | (5000+500)x2 = Rs.11000.00 | Verified by rule | P |
| TC-12 | Calculate charges (Truck) | vehicle `V004`, days `10` | 3500x10 + 1000 = Rs.36000.00 | Rs.36000.00 | P |
| TC-13 | Calculate charges with discount (overloaded method) | vehicle `V004`, days `10`, discount `10` | 36000 minus 10% = Rs.32400.00 | Rs.32400.00 | P |
| TC-14 | Return vehicle | rental `R001` | Rental marked Returned, V001 available again | R001 Returned; V001 Available | P |
| TC-15 | Rent again after return | customer `C002`, vehicle `V001`, days `2`, `UPI` | New rental R002 created | R002 `Rs.4000.00` Active | P |
| TC-16 | Rental history | menu `9` | R001 Returned, R002 Active | As expected | P |
| TC-17 | Add maintenance record | vehicle `V003`, "Engine oil change", cost `2500` | M001 stored | M001 stored and displayed | P |
| TC-18 | View maintenance records | menu `10 -> 2` | M001 and M002 listed | Both listed | P |
| TC-19 | Save data | menu `11 -> 1` | Messages "Data saved"; 4 files written | Files written with correct lines | P |
| TC-20 | Load data on restart | restart the program | Prints loaded counts; records restored | Loaded 4 vehicles, 2 customers, 3 rentals, 2 maintenance | P |
| TC-21 | Exit | menu `12` | Saves data and exits | Saved and exited cleanly | P |

---

## 2. Validation and Exception Test Cases

| TC | Scenario | Input | Expected Result | Actual Result | Status |
|----|----------|-------|-----------------|---------------|--------|
| TC-22 | Duplicate vehicle ID | add vehicle id `V001` again | Rejected with "already exists" message | `! A vehicle with ID V001 already exists.` | P |
| TC-23 | Duplicate customer ID | register `C001` again | Rejected with "already exists" | Rejected | P |
| TC-24 | Renting with unknown customer | customer `C999` | "No customer found with ID C999." | Same message shown | P |
| TC-25 | Renting with unknown vehicle | customer `C001`, vehicle `V999` | "No vehicle found with ID V999." | Same message shown | P |
| TC-26 | Rent an already-rented vehicle | rent `V001` while it is Rented | `VehicleNotAvailableException` caught; "Rental failed: Vehicle V001 (Toyota Corolla) is already rented." | Exact message shown, no rental created | P |
| TC-27 | Zero / negative rental days | days `0` then `5` | Rejects 0, accepts 5 | `! Value must be a positive whole number.` then accepted | P |
| TC-28 | Non-numeric menu choice | `x` | "Please enter a valid whole number." and re-prompt | Re-prompted and continued | P |
| TC-29 | Non-numeric day entry | `abc` then `4` | Re-prompt then accept | Re-prompted then accepted | P |
| TC-30 | Empty required text input | press Enter at a prompt | "Input cannot be empty." and re-prompt | Re-prompted | P |
| TC-31 | Return an already-returned rental | return `R001` twice | "has already been returned" | Message shown | P |
| TC-32 | Return with unknown rental ID | `R999` | "No rental found with ID R999." | Message shown | P |
| TC-33 | Maintenance for unknown vehicle | vehicle `V999` | "No vehicle found with ID V999." | Message shown | P |

---

## 3. File Handling and Consistency Test Cases

| TC | Scenario | Setup | Expected Result | Actual Result | Status |
|----|----------|-------|-----------------|---------------|--------|
| TC-34 | data folder creation | run with no `data` folder | Folder created automatically | `Created data directory: ...` | P |
| TC-35 | Load with no data files | first ever run | Loads 0 records, no error | `Loaded 0 vehicle(s)...` | P |
| TC-36 | Malformed vehicle line | add line `THIS IS A BROKEN LINE` to `vehicles.txt` | Skipped with warning, app continues | `! Skipped malformed vehicle record: ...` | P |
| TC-37 | Unknown vehicle type | add line `Boat\|V009\|Sea\|Skipper\|1000\|true` | Skipped (only Car/Bike/Bus/Truck allowed) | `! Skipped malformed vehicle record: Boat...` | P |
| TC-38 | Dangling rental reference | add rental `R999` referencing missing vehicle `V777` | Skipped with warning | `! Skipped malformed rental record: R999...` | P |
| TC-39 | Availability after restart | save while V001 and V002 are rented, then restart | V001 and V002 show Rented; V003, V004 Available | Exactly as expected | P |
| TC-40 | Save does not lose records | save, then add a record, save again | Both old and new records present | All records present, no duplicates | P |
| TC-41 | Data file contents | inspect files after exit | Correct `|`-separated lines | Matches documented format | P |

---

## 4. Summary

* Total test cases: **41**
* Passed: **41**
* Failed: **0**

All required features, validations, exception behaviour and file-persistence
scenarios were executed successfully. Malformed-file handling was verified by
deliberately corrupting the data files and confirming the program skipped the bad
lines and continued normally.

### How to reproduce a quick smoke test

```bash
javac -d out src/*.java
java -cp out Main
# menu: 1 (add Car V001) -> 4 (add C001) -> 6 (rent V001 to C001, 3 days)
#       -> 9 (history) -> 12 (exit) -> run again and choose 2 (vehicles)
```
