#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pour remplir les noms vides dans catalogue.html en utilisant les noms depuis index.html
"""

import re
from pathlib import Path

def extract_watch_names_from_index():
    """Extrait tous les noms de montres depuis index.html"""
    index_path = Path('index.html')
    with open(index_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern pour trouver toutes les cartes de montres avec leur nom
    pattern = r'href="(montre\d+\.html)"[^>]*data-brand="([^"]*)"[^>]*>.*?alt="([^"]*)"[^>]*>.*?<h3 class="watch-name">([^<]+)</h3>'
    
    watch_names = {}
    for match in re.finditer(pattern, content, re.DOTALL):
        watch_file = match.group(1)
        brand = match.group(2)
        alt_name = match.group(3)
        name = match.group(4).strip()
        
        # Si le nom est vide, utiliser l'alt sans la marque
        if not name:
            if brand and alt_name.startswith(brand):
                name = alt_name[len(brand):].strip()
            else:
                name = alt_name
        
        watch_names[watch_file] = name
    
    return watch_names

def fix_catalogue_names():
    """Corrige les noms vides dans catalogue.html"""
    # Récupérer les noms depuis index.html
    watch_names = extract_watch_names_from_index()
    
    catalogue_path = Path('catalogue.html')
    with open(catalogue_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern pour trouver les cartes avec des noms vides
    pattern = r'(href="(montre\d+\.html)"[^>]*data-brand="([^"]*)"[^>]*>.*?alt="([^"]*)"[^>]*>.*?<h3 class="watch-name">)(</h3>)'
    
    def replace_empty_name(match):
        prefix = match.group(1)
        watch_file = match.group(2)
        brand = match.group(3)
        alt_name = match.group(4)
        suffix = match.group(5)
        
        # Chercher le nom depuis index.html
        name = watch_names.get(watch_file, '')
        
        # Si pas trouvé, utiliser l'alt sans la marque
        if not name:
            if brand and alt_name.startswith(brand):
                name = alt_name[len(brand):].strip()
            else:
                name = alt_name
        
        return f"{prefix}{name}{suffix}"
    
    # Remplacer tous les noms vides
    new_content = re.sub(pattern, replace_empty_name, content, flags=re.DOTALL)
    
    # Sauvegarder
    with open(catalogue_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Corrigé {len(watch_names)} noms de montres dans catalogue.html")

if __name__ == "__main__":
    fix_catalogue_names()

