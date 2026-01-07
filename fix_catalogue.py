#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de correction et réorganisation du catalogue
"""

import re
from pathlib import Path

# Produits à supprimer complètement
PRODUCTS_TO_REMOVE_FILES = [
    "montre2.html", "montre5.html", "montre10.html", "montre11.html", 
    "montre12.html", "montre23.html", "montre26.html", "montre30.html",
    "montre39.html", "montre44.html", "montre49.html", "montre50.html"
]

# Noms exacts des produits à supprimer des catalogues
PRODUCTS_TO_REMOVE_NAMES = [
    "Rolex Daytona Oysterflex",
    "Rolex Daytona Steel gold",
    "Datejust 41 Chocolate",
    "Explorer 36",
    "Omega Speedmaster Moonwatch Professional",
    "Daydate Masterpiece MoP",
    "GMT Master II Bruce Wayne",
    "Oyster Perpetual 34mm",
    "Hamilton Ventura XXL",
    "Seiko",
    "Necklace Akilils",
    "Necklace Akillis Titane"
]

# Nouveaux produits à mettre en première position
NEW_PRODUCTS_HTML = [
    '''                <a href="montre55.html" class="watch-card" data-brand="Patek Philippe">
                    <img src="patek-philippe-annual-calendar-5726.webp" alt="Patek Philippe Annual Calendar 5726" class="watch-img" loading="lazy">
                    <div class="watch-info">
                        <h3 class="watch-name">Patek Philippe Annual Calendar 5726</h3>
                        <p class="watch-price">€ 135.000</p>
                    </div>
                </a>

''',
    '''                <a href="montre56.html" class="watch-card" data-brand="Rolex">
                    <img src="rolex-submariner-no-date-124060.webp" alt="Rolex Submariner No Date 124060" class="watch-img" loading="lazy">
                    <div class="watch-info">
                        <h3 class="watch-name">Rolex Submariner No Date 124060</h3>
                        <p class="watch-price">€ 11.000</p>
                    </div>
                </a>

''',
    '''                <a href="montre57.html" class="watch-card" data-brand="Rolex">
                    <img src="gmt-master-ii-pepsi-126710blro.webp" alt="GMT Master II Pepsi 126710BLRO" class="watch-img" loading="lazy">
                    <div class="watch-info">
                        <h3 class="watch-name">GMT Master II Pepsi 126710BLRO</h3>
                        <p class="watch-price">€ 21.500</p>
                    </div>
                </a>

''',
    '''                <a href="montre58.html" class="watch-card" data-brand="Rolex">
                    <img src="gmt-master-ii-zombie-gold-126718grnr.webp" alt="GMT Master II Zombie Gold 126718GRNR" class="watch-img" loading="lazy">
                    <div class="watch-info">
                        <h3 class="watch-name">GMT Master II Zombie Gold 126718GRNR</h3>
                        <p class="watch-price">€ 42.000</p>
                    </div>
                </a>

''',
    '''                <a href="montre59.html" class="watch-card" data-brand="Rolex">
                    <img src="yacht-master-ii-116680.webp" alt="Yacht Master II 116680" class="watch-img" loading="lazy">
                    <div class="watch-info">
                        <h3 class="watch-name">Yacht Master II 116680</h3>
                        <p class="watch-price">€ 15.900</p>
                    </div>
                </a>

''',
    '''                <a href="montre60.html" class="watch-card" data-brand="Rolex">
                    <img src="oyster-perpetual-36-ref-126000.webp" alt="Oyster Perpetual 36 ref. 126000" class="watch-img" loading="lazy">
                    <div class="watch-info">
                        <h3 class="watch-name">Oyster Perpetual 36 ref. 126000</h3>
                        <p class="watch-price">€ 9.900</p>
                    </div>
                </a>

''',
    '''                <a href="montre61.html" class="watch-card" data-brand="Breitling">
                    <img src="breitling-bentley-a25362.webp" alt="Breitling Bentley A25362" class="watch-img" loading="lazy">
                    <div class="watch-info">
                        <h3 class="watch-name">Breitling Bentley A25362</h3>
                        <p class="watch-price">€ Price on request</p>
                    </div>
                </a>

'''
]

def remove_product_references(content, product_name, product_file):
    """Supprime toutes les références à un produit"""
    # Supprimer les références dans le catalogue principal
    pattern1 = rf'<a href="{re.escape(product_file)}"[^>]*>.*?</a>\s*'
    content = re.sub(pattern1, '', content, flags=re.DOTALL)
    
    # Supprimer les références dans le banner (si présentes)
    pattern2 = rf'<a href="{re.escape(product_file)}"[^>]*>.*?</a>'
    content = re.sub(pattern2, '', content, flags=re.DOTALL)
    
    # Supprimer les références par nom exact
    pattern3 = rf'<h3 class="watch-name">{re.escape(product_name)}</h3>.*?</a>\s*'
    content = re.sub(pattern3, '', content, flags=re.DOTALL)
    
    return content

def remove_new_products_from_middle(content):
    """Supprime les nouveaux produits du milieu pour les remettre au début"""
    for watch_num in [55, 56, 57, 58, 59, 60, 61]:
        pattern = rf'<a href="montre{watch_num}\.html"[^>]*>.*?</a>\s*'
        content = re.sub(pattern, '', content, flags=re.DOTALL)
    return content

def add_new_products_at_start(content):
    """Ajoute les nouveaux produits en première position"""
    # Trouver le début de collection-grid
    pattern = r'(<div class="collection-grid" id="watchGrid">\s*)'
    replacement = r'\1' + ''.join(NEW_PRODUCTS_HTML)
    content = re.sub(pattern, replacement, content, count=1)
    return content

def fix_prices_in_pages():
    """Corrige les prix dans les pages individuelles"""
    price_fixes = {
        "montre15.html": "15.000",  # Cartier Santos 100th anniversary
        "montre25.html": "14.900",  # GMT Master II Sprite
        "montre27.html": "15.900",  # Yacht Master 40 (premier)
        "montre40.html": "Price on request"  # Breitling
    }
    
    for file_path, new_price in price_fixes.items():
        path = Path(file_path)
        if path.exists():
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Mettre à jour le prix dans l'en-tête
            pattern = r'(<p class="watch-price-large">)€\s*[^<]+(</p>)'
            replacement = rf'\1€ {new_price}\2'
            content = re.sub(pattern, replacement, content)
            
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"   ✓ Prix corrigé dans: {file_path}")

print("=" * 80)
print("CORRECTION ET RÉORGANISATION DU CATALOGUE")
print("=" * 80)

# Pour chaque fichier catalogue
for html_file in ['index.html', 'catalogue.html']:
    print(f"\nTraitement de {html_file}...")
    
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. Supprimer toutes les références aux produits supprimés
    print("   1. Suppression des références aux produits supprimés...")
    for name, file in zip(PRODUCTS_TO_REMOVE_NAMES, PRODUCTS_TO_REMOVE_FILES):
        content = remove_product_references(content, name, file)
    
    # 2. Supprimer les nouveaux produits du milieu (s'ils y sont)
    print("   2. Suppression des nouveaux produits du milieu...")
    content = remove_new_products_from_middle(content)
    
    # 3. Ajouter les nouveaux produits en première position
    print("   3. Ajout des nouveaux produits en première position...")
    content = add_new_products_at_start(content)
    
    # 4. Nettoyer les lignes vides multiples
    content = re.sub(r'\n\s*\n\s*\n+', '\n\n', content)
    
    if content != original_content:
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"   ✓ {html_file} mis à jour")
    else:
        print(f"   - {html_file} déjà à jour")

# Corriger les prix dans les pages individuelles
print("\nCorrection des prix dans les pages individuelles...")
fix_prices_in_pages()

# Vérification finale
print("\nVérification finale...")
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Compter les montres uniques
matches = re.findall(r'href="(montre\d+\.html)"', content)
unique_watches = len(set(matches))
print(f"   Total d'articles dans le catalogue: {unique_watches}")

# Vérifier qu'il n'y a plus de références aux produits supprimés
for file in PRODUCTS_TO_REMOVE_FILES:
    if file in content:
        print(f"   ⚠ ATTENTION: Référence restante à {file}")

print("\n" + "=" * 80)
print("CORRECTION TERMINÉE")
print("=" * 80)



