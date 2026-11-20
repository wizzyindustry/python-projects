import os

print("-" * 50)
print("   TANESCO CUSTOMER INFOMATION   ")
print("-" * 50)

customer_name = input("Customer name: ")
acc_number = int(input("Account Number: "))
meter_start = int(input("Start meter: "))
meter_end = int(input("End meter: "))
outstanding = float(input("Enter your balance: "))

unit_consumed = meter_end - meter_start

if( unit_consumed >= 300):
    rate = 300
elif ( unit_consumed >= 151):
    rate = 200
elif ( unit_consumed >= 51):
    rate = 150
else:
    rate = 100

energy_cost = unit_consumed * rate

vat = energy_cost * 0.18

service_charges = 5000

total = energy_cost + vat + service_charges + outstanding

os.system("cls")

print("=" * 50)
print("        TANESCO ELECTRICITY BILL     ")
print("=" * 50)
print("Customer Name          : ", customer_name)
print("Account Number         : ", "TAN-",acc_number)
print("Start Reading          : ", meter_start, "kwh")
print("End Reading            : ", meter_end, "kwh")
print("Unity Consumed         : ", unit_consumed, "kwh")
print("-" * 50)
print("Energy Cost            : TZS", energy_cost)
print("VAT (18%)              : TZS", vat)
print("Service Charges        : TZS", service_charges)
print("Outstanding Bill       : TZS", outstanding)
print("-" * 50)
print("TOTAL BILL             : TZS", total)
print("=" * 50)
print("       PLEASE PAY BEFORE THE DEAD LINE       ")
print("=" * 50)