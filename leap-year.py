year = int(input("Enter a year: "))

#divided by 100 means century year (ending with 00)
#center year is divided by 400 is a leap year
if (year % 400 == 0) and (year % 100 == 0):
    print("{0}, is a leap year".format(year))
#if not divided by 100 means not a century year, then a year is divided by 4 is a leap year 
elif (year % 4 == 0) and (year % 100 != 0):
    print("{0} is a leap year".format(year))
#if not divided by both 400(centery year) and 4(not centery year) then is year is not a leap year 
else:
    print("{0} is not a leap year".format(year))