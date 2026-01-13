#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pour formater les noms des montres dans le catalogue
Format: Nom + diamètre uniquement
Approche directe: remplacement ligne par ligne
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
    patterns = [
        r'(\d+)\s*mm',  # "41mm" ou "41 mm"
        r'\s(\d+)$',     # "41" à la fin
        r'\s(\d+)\s',    # "41" entre deux espaces
    ]
    
    for pattern in patterns:
        match = re.search(pattern, name, re.IGNORECASE)
        if match:
            diameter = match.group(1)
            if 20 <= int(diameter) <= 60:
                return diameter
    return None

def format_watch_name(full_name, brand):
    """Formate le nom de la montre pour n'afficher que Nom + diamètre"""
    # Retirer la marque du nom
    name = full_name
    if brand and name.startswith(brand):
        name = name[len(brand):].strip()
    
    # Extraire le diamètre AVANT de modifier le nom
    diameter = extract_diameter(name)
    
    if diameter:
        # Vérifier si le nom se termine déjà par "diamètremm"
        if name.endswith(f'{diameter}mm'):
            # Le nom est déjà correctement formaté
            return name
        
        # Remplacer le diamètre existant par "diamètremm"
        # Si le diamètre est à la fin (avec ou sans mm), le remplacer
        if re.search(rf'\s{diameter}\s*mm?\s*$', name):
            name = re.sub(rf'\s{diameter}\s*mm?\s*$', f' {diameter}mm', name)
        # Si le diamètre est au milieu, le retirer et l'ajouter à la fin
        elif re.search(rf'\s{diameter}\s+', name):
            name = re.sub(rf'\s{diameter}\s+', ' ', name)
            name = name.strip()
            name = f"{name} {diameter}mm"
        # Sinon, l'ajouter à la fin
        else:
            name = f"{name} {diameter}mm"
        
        name = name.strip()
        return name
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
    
    # Trouver toutes les cartes de montres avec leur marque et nom
    # Pattern pour capturer toute la carte de montre, y compris l'attribut alt de l'image
    pattern = r'(<a[^>]*href="montre\d+\.html"[^>]*data-brand="([^"]*)"[^>]*>.*?alt="([^"]*)"[^>]*>.*?<h3 class="watch-name">)([^<]+)(</h3>)'
    
    def replace_name(match):
        prefix = match.group(1)
        brand = match.group(2)
        alt_name = match.group(3)  # Nom original depuis l'attribut alt
        current_name = match.group(4).strip()  # Nom actuel dans le h3
        suffix = match.group(5)
        
        # Utiliser le nom de l'attribut alt comme source de vérité (il contient le nom original)
        # Retirer la marque du nom alt si elle est présente
        original_name = alt_name
        if brand and original_name.startswith(brand):
            original_name = original_name[len(brand):].strip()
        
        # Si le nom devient vide après avoir retiré la marque, utiliser le nom alt complet
        if not original_name:
            original_name = alt_name
        
        formatted_name = format_watch_name(original_name, brand)
        
        # Si le nom formaté est vide, utiliser le nom original
        if not formatted_name:
            formatted_name = original_name if original_name else current_name
        
        return f"{prefix}{formatted_name}{suffix}"
    
    # Remplacer tous les noms
    new_content = re.sub(pattern, replace_name, content, flags=re.DOTALL)
    
    # Sauvegarder
    with open(catalogue_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("Catalogue mis à jour avec succès!")

if __name__ == "__main__":
    update_catalogue()

