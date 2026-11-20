#here is the program to show the mathematical table using python

for i in range(1,11):
    for j in range(1,11):
        print(f'{i} * {j} = {i*j}', end = '\t')
    print()