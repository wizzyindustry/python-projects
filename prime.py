num = int(input("Enter a number: "))

#define the flag  variable
flag = False


if num == 1:
    print(f"{num}, is not a prime number")
elif num >1:
    #cheking the factors
    for i in range(2, num):
        if (num % i) == 0:
            flag = True #if factor is found, set the flag to true
            break #break out of loop


#cheking if flag is true
if flag: 
    print(f"{num}, is not a prime number")
else:
    print(f"{num}, is a prime number")

print("thanks for trying.....")