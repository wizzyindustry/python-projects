#the pyhton program to great the user by its name

def great():
    print("Hello, welcome to the program")

def program_name(program):
    print(f"My name is:, {program}")

name = 'software'

while True:
    print(f"what is your name!, my name is: {name}")
    user = input("my name is: ")
    if user:
        print( f"{name}:  oh, nice name", user)
        break
    else:
        print(f"{name}: my bad to know you, we will know each other next time")
        break
    
