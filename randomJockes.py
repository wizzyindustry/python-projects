import requests

#randum jokes API
url = "https://official-joke-api.appspot.com/random_joke"
response = requests.get(url)
data = response.json()
print(data["setup"])
print(data["punchline"])