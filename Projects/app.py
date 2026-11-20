print("hello world")
print('hello world')

a= 10 #variable of a is declared
b= 20 #variable of b is been declared
c= b* a #the process to find the value of c
print("the result is: ", c) #here we print the value of the c after the process above of  a * b

#doing selection in python 
age = int(input("What is your age: "))

if (age < 18):
    print("Your so young to continue")
else:
    print("You are so old enough to continue the next process")


username = input("Enter your username: ")
psd = int(input("Enter your pasword: "))

if(username == "name"):
    if(psd == 1234):
        print("you have enter to the system")
    else:
        print("sorry your password is somehow wrong")
else:
    print("your username is somehow wrong")

#most used library for ai model learning 
#pandas, numpy, seaborn, matplolib

#pandas
'''
features of pandas:
1. data handling missing values
2. data filtering and solting
3. data grouping
4. time series analiys
5. merging and joining datasets
6. data clearing and processing 
7. reading and writing data from multiple formats(csv, exel, sql, json, etc)

common pandas componets
 padas series
 pandas index

freq used
1. pandas.io -io oparation
2. pandas.plotting - data visulizasion
3. pandas.testing
4.pandas.api - public api exetiension
5. pandas.arrays
6. pandas.tseries

realated python packages used with pandas
1. numpy
2. malpultip
3. scipy 
4. openpyxl 
5. sclkit-learing - used for machine learning
6. sqlAlchemy - database connectivity


aplication of pandas
code

import pandas as pd
df = pd.DataFrame()

df["names] = ["john", "Rose", "jack"]

df["age] = [15, 19, 45]

df["country"] = ["kenya", "uganda", "malawi"]

type(df)

df.head(10)

df.tail()

df.shape[x-axis]

data.to_excel() // used to export data to various file fomarts like excel, json and more


'''