import requests

#weather API
city = "dodoma"
link = f"https://api.weatherapi.com/v1/current.json?key=API_KEY&q={city}"
response = requests.get(link)
data = response.json()
print(data)
