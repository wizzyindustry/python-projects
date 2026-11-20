

number = int(input("Enter number to show its multiplication: "))

for i in range(1,11):
    print(f'{i} * {number} = {i*number}', end='\t')
    print()