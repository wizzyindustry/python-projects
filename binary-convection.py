#A python program which converts decimal values into binary then octal then hexadecimal values

decimal_number = int(input("Enter a decimal number value: "))

print("The decimal number value of", decimal_number, "are: ")
print(bin(decimal_number), "in binary.")
print(oct(decimal_number), "in octal.")
print(hex(decimal_number), "in Hexadecimal.")