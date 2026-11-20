
num1 = int(input("Enter the first number: "))
num2 = int(input("Enter the second number: "))
num3 = int(input("Enter the third number: "))

if num1 + num2 > num3 or num1 + num3 > num2 or  num2 + num3 > num1:
    if num1 == num2 == num3:
        print("Equilateral triangle")
    elif num1 == num2 or num2 == num3 or num1 == num3:
        print("Isosceles triangle")
    else:
        print("Scalene triangle")
    
    print()
