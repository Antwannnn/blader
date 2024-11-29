import json

CATEGORIES = {
    "SHORT": 10,
    "MEDIUM": 30,
    "LONG": 50,
    "VERY_LONG": 70
}


def categorize_citations(citations):
    categorized = {"SHORT": [], "MEDIUM": [], "LONG": [], "VERY_LONG": []}

    for citation in citations:
        # Si citation est un dictionnaire, accéder à sa clé "content"
        if isinstance(citation, dict) and "content" in citation:
            text = citation["content"]
        elif isinstance(citation, str):  # Si c'est une chaîne directe
            text = citation
        else:
            continue  # Ignorer si le format est inattendu

        word_count = len(text.split())  # Compte le nombre de mots dans le texte

        if word_count <= CATEGORIES["SHORT"]:
            categorized["SHORT"].append(citation)
        elif word_count <= CATEGORIES["MEDIUM"]:
            categorized["MEDIUM"].append(citation)
        elif word_count <= CATEGORIES["LONG"]:
            categorized["LONG"].append(citation)
        else:
            categorized["VERY_LONG"].append(citation)

    return categorized

# Mise à jour de la fonction process_json
def process_json(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Vérifier la structure du JSON d'entrée
    citations = []
    for key in ["SHORT", "MEDIUM", "LONG", "VERY_LONG"]:
        if key in data:
            citations.extend(data[key])

    categorized_citations = categorize_citations(citations)

    # Sauvegarde dans un nouveau fichier
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(categorized_citations, f, ensure_ascii=False, indent=4)

# Exemple d'utilisation
input_file = "quotes.json"
output_file = "quotesSorted.json"

try:
    process_json(input_file, output_file)
    print(f"Les citations ont été triées et enregistrées dans {output_file}.")
except Exception as e:
    print(f"Erreur : {e}")
