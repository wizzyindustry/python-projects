#python code for sign in and login 

import os

details=[]

print("-"*30)
print("SIGN HERE")
print("-"*30)

name = input("Enter your name: ")
password = input("Enter your password: ")
details.append(name)
details.append(password)
os.system('cls')

print("-"*30)
print("LOGIN HERE")
print("-"*30)

while True:
    name = input("Enter your user name: ")
    password = input("Enter your passowrd: ")
    if(name == details[0] and password == details[1]):
        print("Login success!")
        print("welcome", name)
        print(f"your password is: {password}")
        print("="*30) 
        print("please keep it do not share your password with anyone for more security")
        print("="*30)
        break
    else:
        print("Wrong username or password, please try again!!")
        print("-"*30)