#a program to to convert the kilogram units into miles units

kilometer = float(input("Enter distance in kilometers: "))

#convenstion factors:  1kg  == 0.621371 miles
conversion_factor = 0.621371

miles = kilometer * conversion_factor

print(f"{kilometer} kilometer is equal to {miles}miles")