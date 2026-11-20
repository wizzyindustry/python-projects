import requests

#randum jokes API
url = "https://official-joke-api.appspot.com/random_joke"
response = requests.get(url)
data = response.json()
print(data["setup"])
print(data["punchline"])

#weather API
city = "london"
link = f"https://api.weatherapi.com/v1/current.json?key=API_KEY&q={city}"
response = requests.get(link)
data = response.json()
print(data)

