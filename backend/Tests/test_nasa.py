from services.nasa_service import fetch_asteroids

data = fetch_asteroids()

print("Total asteroids:", len(data))
print(data[:2])   # print first 2
