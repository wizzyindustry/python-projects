n = 5

for i in range(n):
    for j in range(n):

        if i == 0 or i == n - 1 or j == 0 or j == n - 1:
            print("*", end=" ")
        else:
            print(" ", end=" ")
        
    print()


for m in range(n):
    for o in range(n - m - 1):
        print(" ", end=" ")
    for k in range(2 * m + 1):
        print("*", end=" ")
    print()