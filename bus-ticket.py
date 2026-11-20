import os

print("-" * 30)
print("----- DODOMA EXPRESS --------")
print("-" * 30)

passenger_name = input("Passenger`s name: ")
passenger_age = int(input("Passenger Age: "))
os.system("cls")

print("-" * 30)
print("-------- BUS ROOTS ---------")
print("-" * 30)

print(" 1. DODOMA ➡️ MOROGORO  - TZS 15,000")
print(" 2. DODOMA ➡️ DAR-ES-SALAAM  - TZS 30,000")
print(" 3. DODOMA ➡️ ARUSHA  - TZS 25,000")
print(" 4. DODOMA ➡️ MWANZA  - TZS 35,000")
print(" 5. DODOMA ➡️ TANGA  - TZS 30,000")
destination = int(input("Choose your Destination(1 to 5): ")) 

if ( destination == 1):
    base_price = 15000
    destination_name = "DODOMA ➡️ MOROGORO"
elif( destination == 2):
    base_price = 30000
    destination_name = "DODOMA ➡️ DAR-ES-SALAAM"
elif ( destination == 3):
    base_price = 25000
    destination_name = "DODOMA ➡️ ARUSHA"
elif ( destination == 4):
    base_price = 35000
    destination_name = "DODOMA ➡️ MWANZA"
else:
    base_price = 30000
    destination_name = "DODOMA ➡️ TANGA"


print("----------- TICKET CLASS -----------")
print(" 1. VIP (x2.0)")
print(" 2. BUSSINES (x1.5)")
print(" 3. ECONOMY (x1.0)")
ticket_class = int(input("Choose your Ticket class(1 to 3): "))
os.system("cls")

if(ticket_class == 1):
    multiplayer = 2.0
    class_name = "VIP class"
elif( ticket_class == 2):
    multiplayer = 1.5
    class_name = "BUSSINES class"
else:
    multiplayer = 1.0
    class_name = "ECONOMY"

bus_ticket = base_price * multiplayer


if (passenger_age < 12):
    discount_percent = 0.50
    passenger_type = "child"
elif (passenger_age >= 60):
    discount_percent = 0.30
    passenger_type = "Senior"
else:
    discount_percent = 0
    passenger_type = "Normal"

discount_amount = bus_ticket * discount_percent
finall_price = bus_ticket - discount_amount


print("=" * 30)
print("            DODOMA EXPRESS BUS TICKET        ")
print("=" * 30)
print("Passenger`s name: ", passenger_name)
print("Passenger`s age: ", passenger_age ,f"{passenger_type}")
print("Ticket type: ", class_name)
print("Destination: ", destination_name)
print("-" * 30)
print("Base price: ", base_price)
print("Ticket price: ", bus_ticket)
print(f"Discount {discount_percent * 100}%: ", discount_amount)
print("Finall price: ", finall_price)
print("=" * 30)
print("            HAVE A NICE JOURNEY   ")
print("=" * 30)



