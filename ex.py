class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def display(self):
        print("-" * 30)
        print(f"Name: {self.name}")
        print(f"Age: {self.age}")
        print("-" * 30)
    
student = []

while True:
    print("1. add student")
    print("2. display student")
    print("3. exit")

    choice  = input("Enter your choice: ")

    if choice == "1":
        print("*" * 30)
        print("Adding a new student...")
        name = input("Enter student name: ")
        age = int(input("Enter student age: "))

        student.append(Student(name, age))
        print("Student added successfully!")
    elif choice == "2":
        print("*" * 30)
        print("Displaying all students...")
        if not student:
            print("No student found")
        else:
            for s in student:
                s.display()
    elif choice == "3":
        print("Exiting...")
        break
    print()

print("Thank you for using the student management system!")