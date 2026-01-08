#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pour formater les noms des montres dans le catalogue
Format: Nom + diamètre uniquement
"""

import re
from pathlib import Path

# Marques connues à retirer du nom
BRANDS = [
    "Richard Mille", "Patek Philippe", "Rolex", "Cartier", "Bulgari",
    "Omega", "Tudor", "Frank Muller", "Jaeger LeCoultre", "Oris",
    "Grand Seiko", "Hamilton", "Breitling", "Tag Heuer", "Rado",
    "Frederique Constant", "Seiko", "Akilils", "Fred"
]

def extract_diameter(name):
    """Extrait le diamètre du nom de la montre"""
    # Chercher des patterns comme "41", "40mm", "36mm", "34mm", etc.
    # Patterns: nombre suivi de "mm" ou nombre seul à la fin ou après un espace
    patterns = [
        r'(\d+)\s*mm',  # "41mm" ou "41 mm"
        r'\s(\d+)$',     # "41" à la fin
        r'\s(\d+)\s',    # "41" entre deux espaces
    ]
    
    for pattern in patterns:
        match = re.search(pattern, name, re.IGNORECASE)
        if match:
            diameter = match.group(1)
            # Vérifier que c'est un diamètre raisonnable (entre 20 et 60mm)
            if 20 <= int(diameter) <= 60:
                return diameter
    
    return None

def format_watch_name(full_name, brand):
    """Formate le nom de la montre pour n'afficher que Nom + diamètre"""
    # Retirer la marque du nom
    name = full_name
    if brand and name.startswith(brand):
        name = name[len(brand):].strip()
    
    # Extraire le diamètre
    diameter = extract_diameter(name)
    
    # Si on trouve un diamètre
    if diameter:
        # Retirer le diamètre existant (avec ou sans "mm") du nom
        # Pattern pour retirer "41", "41mm", "41 mm", etc.
        name = re.sub(r'\s*\d+\s*mm?\s*', ' ', name, flags=re.IGNORECASE)
        name = re.sub(r'\s+\d+\s*$', '', name)  # Retirer le nombre à la fin
        name = name.strip()
        
        # Si le nom est vide après retrait, utiliser le nom original sans la marque
        if not name:
            name = full_name
            if brand and name.startswith(brand):
                name = name[len(brand):].strip()
            # Retirer juste le diamètre
            name = re.sub(r'\s*\d+\s*mm?\s*', ' ', name, flags=re.IGNORECASE)
            name = re.sub(r'\s+\d+\s*$', '', name)
            name = name.strip()
        
        # Construire le nom final: "Nom diamètremm"
        if name:
            return f"{name} {diameter}mm"
        else:
            return f"{diameter}mm"
    else:
        # Pas de diamètre trouvé, retourner juste le nom sans la marque
        return name if name else full_name

def update_catalogue():
    """Met à jour le catalogue.html avec les noms formatés"""
    catalogue_path = Path('catalogue.html')
    
    if not catalogue_path.exists():
        print("Erreur: catalogue.html introuvable")
        return
    
    with open(catalogue_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern pour trouver les noms de montres dans le catalogue
    # Format: <h3 class="watch-name">Nom complet</h3>
    # On cherche d'abord la balise avec data-brand, puis le nom
    # Pattern amélioré pour gérer tous les cas
    pattern = r'(<a[^>]*href="montre\d+\.html"[^>]*data-brand="([^"]*)"[^>]*>[\s\S]*?<h3 class="watch-name">)([^<]+)(</h3>)'
    
    def replace_name(match):
        full_tag_start = match.group(1)
        brand = match.group(2)
        full_name = match.group(3).strip()
        tag_end = match.group(4)
        
        # Formater le nom
        formatted_name = format_watch_name(full_name, brand)
        
        return f"{full_tag_start}{formatted_name}{tag_end}"
    
    # Remplacer tous les noms
    new_content = re.sub(pattern, replace_name, content)
    
    # Sauvegarder
    with open(catalogue_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("Catalogue mis à jour avec succès!")

if __name__ == "__main__":
    update_catalogue()

