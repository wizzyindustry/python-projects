
number = [7, 3, 9, 3, 10, 5, 9]

unique_number = []
seen = set()
print("Number to be replaced: ", number)


for num in number:
    if num not in seen:
        unique_number.append(num)
        seen.add(num)
    print(unique_number)