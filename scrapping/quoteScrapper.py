import requests
import json

CATEGORIES = {
    "SHORT": 10,
    "MEDIUM": 30,
    "LONG": 50,
    "VERY_LONG": 70
}

API_URL = "https://api.quotable.io/quotes"

def fetch_quotes(min_length):
    quotes = []
    page = 1

    while True:
        response = requests.get(API_URL, params={"minLength": min_length, "page": page, "limit": 20}, verify=False)

        if response.status_code != 200:
            print(f"Erreur lors de la récupération des citations pour minLength {min_length}.")
            break

        data = response.json()

        quotes.extend(data["results"])

        if not data["results"] or page >= data["totalPages"]:
            break
        page += 1

    return quotes

def scrape_quotes():
    categorized_quotes = {category: [] for category in CATEGORIES.keys()}

    for category, min_length in CATEGORIES.items():
        print(f"Récupération des citations pour la catégorie {category} (minLength={min_length})...")
        quotes = fetch_quotes(min_length)
        categorized_quotes[category].extend(quotes)

    with open("quotes.json", "w", encoding="utf-8") as f:
        json.dump(categorized_quotes, f, ensure_ascii=False, indent=4)

    print("Les citations ont été enregistrées dans 'quotes.json'.")

scrape_quotes()
