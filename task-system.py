#task systems project

task_list = { 
    1: "Add task",
    2: "Remove task",
    3: "show task",
    4: "Exit"
}

for i,j in task_list.items():
    print(i,j)

task = []

while True:
    user_choice = int(input("Enter your choice from(1,4): "))
    if user_choice == 1:
        adding = input("Enter the task you want to add: ")
        task.append(adding)
        print("Task added successufully")
    elif user_choice == 2:
        removing = input("Enter the task you want to remove: ")
        if removing in task:
            task.remove(removing)
            print("Task removed successufully")
        else:
            print("Task not found")
        task.remove(removing)
    elif user_choice == 3:
        print("Your tasks are: ", task)
    elif user_choice == 4:
        break
    else: 
        print("Invalid choice, please try again")