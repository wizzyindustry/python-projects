import pandas as pd

df = pd.DataFrame()

df["name"] = ["emanuel", "pantaleo", "tesha"]
df["age"] = [20, 34, 55]
df["country"] = ["kenya", "uganda", "tanzania"]
df["tribe"] = ["mtanga", "nyakyusa", "changa"]

type(df)

df.head(10)