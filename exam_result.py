import os
print("="*60)
print("           UDOM EXAMINATION RESULT SYSTEM            ")
print("="*60)
student_name = input("Enter student name: ")
reg_number = input("Enter registration number: ")
programme  = input("Enter programme: ")
year_of_study = int(input("Enter year of study: "))

os.system("cls")

i = 1
total_marks = 0
total_gpa = 0
failed_count = 0

print("-"*30, "-"*30)
while i < 6:
    subject_name = input(f"Subject name {i}: ")
    marks = int(input(f"Subject  marks {i}: "))

    if marks >= 70:
        grades  = "A"
        gpa_point = 5.0
    elif marks >= 60:
        grades = "B+"
        gpa_point = 4.5
    elif marks >= 50:
        grades = "B"
        gpa_point = 4.0
    elif marks >= 45:
        grades = "C"
        gpa_point = 3.5
    elif marks >= 40:
        grades = "D"
        gpa_point = 3.0
    else:
        grades = "F"
        gpa_point = 0.0
        failed_count = failed_count + 1
    total_marks += marks
    total_gpa += gpa_point
    i += 1
    print()



average = total_marks / 5.0
ovarall_gpa = total_gpa / 5.0


if ovarall_gpa >= 4.5:
    classification = "First Class"
elif ovarall_gpa >= 3.5:
    classification = "Second Class Upper"
elif ovarall_gpa >= 2.0:
    classification = "Second Class Lower"
else:
    classification = "Fail"



os.system("cls")


print("="*60)
print("              UDOM OFFICIAL ACADEMIC TRANSCRIPT           ")
print("="*60)
print("Student Name:  ", student_name)
print("Reg Number: ", reg_number)
print("Programme: ", programme)
print("Year of study: ", year_of_study)
print("-"*60)
print("NO   Subject                Mark          Grade        GPA")
for i in range(0,5):
    print(i+1, "  ",
          subject_name, "\t\t",
          marks, "\t",
          grades, "\t",
          gpa_point
          )
    
print("-"*60)
print("Total Marks: ", total_marks)
print("Average Mark: ", average)
print("Ovarall GPA: ", ovarall_gpa)
print("-"*60)
print("Classification: ", classification)

if failed_count > 0:
    print("Status: SUPLLEMENTARY")
    print("Your Failed: ", failed_count)
else:
    print("Status: PASSED")

distinction =  True

for i in range(0,5):
    if marks < 70:
        distinction = False
    
print("="*60)
if distinction:
    print(f"*** DISTINCTION ***")
    print("Congratulations ", student_name, "!")
    print("Outstanding performance in all subjects!")
else:
    print("Congratulations", student_name, "!")
    print("Keep up the good academic performance!")

print("="*60)


