import requests
URL = "http://localhost:5001/generate-summary"

if __name__ == "__main__":
    response = requests.post(URL)
    print(f"[{response.status_code}] {response.json()}")