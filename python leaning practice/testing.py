num = int(input("What multiplication table you want to display: "))

print(f"Multiplication table for {num}")
print("-"* 30)


for i in range(1, 13):
    print(f"{num} x {i:2d} = {num * i:3d}")