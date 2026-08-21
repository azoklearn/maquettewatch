#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script complet de synchronisation du catalogue avec Machiavelli Watches
Objectif: 55 articles exactement
"""

import re
import unicodedata
from pathlib import Path
from urllib.parse import quote

DOMAIN = "maquettewatch.vercel.app"

# Produits à supprimer (nom exact -> fichier)
PRODUCTS_TO_REMOVE = {
    "Rolex Daytona Oysterflex": "montre2.html",
    "Rolex Daytona Steel gold": "montre5.html",
    "Datejust 41 Chocolate": "montre10.html",
    "Explorer 36": "montre11.html",
    "Omega Speedmaster Moonwatch Professional": "montre12.html",
    "Daydate Masterpiece MoP": "montre23.html",
    "GMT Master II Bruce Wayne": "montre26.html",
    "Oyster Perpetual 34mm": "montre30.html",
    "Hamilton Ventura XXL": "montre39.html",
    "Seiko": "montre44.html",
    "Necklace Akilils": "montre49.html",
    "Necklace Akillis Titane": "montre50.html"
}

# Nouveaux produits à ajouter
NEW_PRODUCTS = [
    {
        "name": "Patek Philippe Annual Calendar 5726",
        "brand": "Patek Philippe",
        "price": "135.000",
        "reference": "5726",
        "material": "Steel",
        "year": ""
    },
    {
        "name": "Rolex Submariner No Date 124060",
        "brand": "Rolex",
        "price": "11.000",
        "reference": "124060",
        "material": "Steel",
        "year": "2023"
    },
    {
        "name": "GMT Master II Pepsi 126710BLRO",
        "brand": "Rolex",
        "price": "21.500",
        "reference": "126710BLRO",
        "material": "Steel",
        "year": "2024"
    },
    {
        "name": "GMT Master II Zombie Gold 126718GRNR",
        "brand": "Rolex",
        "price": "42.000",
        "reference": "126718GRNR",
        "material": "Gold",
        "year": ""
    },
    {
        "name": "Yacht Master II 116680",
        "brand": "Rolex",
        "price": "15.900",
        "reference": "116680",
        "material": "Steel",
        "year": ""
    },
    {
        "name": "Oyster Perpetual 36 ref. 126000",
        "brand": "Rolex",
        "price": "9.900",
        "reference": "126000",
        "material": "Steel",
        "year": ""
    },
    {
        "name": "Breitling Bentley A25362",
        "brand": "Breitling",
        "price": "Price on request",
        "reference": "A25362",
        "material": "Steel",
        "year": ""
    }
]

# Corrections de prix (nom exact -> nouveau prix)
PRICE_CORRECTIONS = {
    "Cartier Santos 100th anniversary": "15.000",
    "GMT Master II Sprite": "14.900",
    "Breitling": "Price on request"
}

def normalize_image_name(name):
    """Convertit un nom de montre en nom de fichier image"""
    name = unicodedata.normalize('NFD', name)
    name = name.encode('ascii', 'ignore').decode('ascii')
    name = name.lower()
    name = re.sub(r'[^a-z0-9]+', '-', name)
    name = re.sub(r'-+', '-', name)
    name = name.strip('-')
    return f"{name}.webp"

def get_next_watch_number():
    """Trouve le prochain numéro de montre disponible"""
    existing = []
    for f in Path('.').glob('montre*.html'):
        match = re.search(r'montre(\d+)\.html', f.name)
        if match:
            existing.append(int(match.group(1)))
    return max(existing) + 1 if existing else 1

def create_watch_page(watch_num, product):
    """Crée une page HTML pour une montre"""
    name = product["name"]
    brand = product["brand"]
    price = product["price"]
    reference = product.get("reference", "")
    material = product.get("material", "")
    year = product.get("year", "")
    
    image_name = normalize_image_name(name)
    whatsapp_text = quote(f"I am interested par {name}\n\nhttps://{DOMAIN}/montre{watch_num}.html")
    whatsapp_url = f"https://api.whatsapp.com/send?phone=32484709109&text={whatsapp_text}"
    
    title_short = name.replace(f"{brand} ", "") if name.startswith(brand) else name
    
    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{name} - Machiavelli</title>
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar-minimal">
        <div class="nav-minimal-container">
            <div class="nav-minimal-menu">
                <a href="#" class="nav-minimal-link" id="menuToggle">MENU</a>
                <div class="nav-minimal-dropdown" id="fullMenu">
                    <button class="menu-close" id="menuClose">×</button>
                    <div class="nav-menu-item-with-submenu">
                        <a href="index.html#collection" class="nav-minimal-link nav-minimal-item">Catalogue</a>
                        <div class="nav-submenu">
                            <a href="index.html#collection" class="nav-minimal-link nav-minimal-item nav-submenu-item" data-type="watch">Watches</a>
                            <a href="index.html#collection" class="nav-minimal-link nav-minimal-item nav-submenu-item" data-type="jewelry">Jewelry</a>
                            <a href="index.html#collection" class="nav-minimal-link nav-minimal-item nav-submenu-item" data-type="leather">Leather Goods</a>
                        </div>
                    </div>
                    <a href="a-propos.html" class="nav-minimal-link nav-minimal-item">About</a>
                    <a href="vendez-vos-montres.html" class="nav-minimal-link nav-minimal-item">Sell your watches</a>
                    <a href="find-my-watch.html" class="nav-minimal-link nav-minimal-item">Source my watch</a>
                    <a href="our-socials.html" class="nav-minimal-link nav-minimal-item">Our Socials</a>
                </div>
            </div>
            <a href="index.html#collection" class="nav-minimal-link">STOCK</a>
            <a href="contact.html" class="nav-minimal-link">CONTACT</a>
            <div class="language-switcher">
                <button class="lang-btn" id="langEn" data-lang="en">EN</button>
                <button class="lang-btn" id="langFr" data-lang="fr">FR</button>
            </div>
        </div>
    </nav>

        <section class="watch-detail-page watch-detail-page-2">
        <div class="container">
            <div class="watch-detail-content">
                <!-- En-tête avec marque, nom et matériau -->
                <div class="watch-header">
                    <div class="watch-brand">{brand}</div>
                    <div class="watch-title-row">
                        <h1 class="watch-title">{title_short}</h1>
                        <div class="watch-material">{material}</div>
                    </div>
                    <div class="watch-price-in-header">
                        <p class="watch-price-large">€ {price}</p>
                    </div>
                </div>

                <!-- Image de la montre -->
                <div class="watch-image-container">
                    <img src="{image_name}" alt="{name}" class="watch-img" loading="lazy">
                </div>

                <!-- Spécifications en deux colonnes -->
                <div class="watch-specs-grid">
                    <div class="watch-spec-label">Reference</div>
                    <div class="watch-spec-value">{reference}</div>
                    
                    <div class="watch-spec-label">Date</div>
                    <div class="watch-spec-value">{year if year else "Non spécifiée"}</div>
                    
                    <div class="watch-spec-label">Condition</div>
                    <div class="watch-spec-value">Good</div>
                    
                    <div class="watch-spec-label">Set</div>
                    <div class="watch-spec-value">FULL SET</div>
                </div>

                <!-- Description -->
                <div class="watch-description">

                    <p>The {name} represents the perfect balance between elegance and technical excellence. This exceptional timepiece combines timeless design with exceptional performance, making it a true collector's piece.</p>
                    <p>The certified movement ensures remarkable precision, while the refined design gives this watch a unique and prestigious character.</p>
                
                </div>

                <!-- Bouton d'action -->
                <a href="{whatsapp_url}" class="watch-action-button" target="_blank" rel="noopener noreferrer">
                    I am interested
                </a>
                <a href="catalogue.html" class="watch-action-button watch-back-button">
                    Back to catalog
                </a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <div class="footer-logo">
                        <img src="logomachia-icon.png" alt="Machiavelli Logo" class="footer-logo-img">
                    </div>
                    <p class="footer-tagline">Belgium</p>
                    <div class="social-links">
                        <a href="https://www.instagram.com/machiavelli_group/" target="_blank" rel="noopener noreferrer" class="social-link">Instagram</a>
                        <a href="https://www.tiktok.com/@machiavelli_group" target="_blank" rel="noopener noreferrer" class="social-link">TikTok</a>
                        <a href="https://api.whatsapp.com/send?phone=32484709109" target="_blank" rel="noopener noreferrer" class="social-link">WhatsApp</a>
                    </div>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2025 Machiavelli</p>
                <div class="footer-links">
                    <a href="mentions-legales.html">Mentions Légales</a>
                    <a href="#">Confidentialité</a>
                </div>
            </div>
        </div>
    </footer>

    
    <script src="script.js"></script>
    </body>
</html>'''
    
    return html

def remove_watch_from_catalog(html_content, watch_name, watch_file):
    """Supprime une montre du catalogue HTML"""
    # Pattern pour trouver le bloc complet de la montre
    pattern = rf'<a href="{re.escape(watch_file)}"[^>]*>.*?<h3 class="watch-name">{re.escape(watch_name)}</h3>.*?</a>'
    html_content = re.sub(pattern, '', html_content, flags=re.DOTALL)
    # Nettoyer les lignes vides multiples
    html_content = re.sub(r'\n\s*\n\s*\n', '\n\n', html_content)
    return html_content

def add_watch_to_catalog(html_content, watch_num, product):
    """Ajoute une montre au catalogue HTML"""
    name = product["name"]
    brand = product["brand"]
    price = product["price"]
    image_name = normalize_image_name(name)
    
    watch_card = f'''                <a href="montre{watch_num}.html" class="watch-card" data-brand="{brand}">
                    <img src="{image_name}" alt="{name}" class="watch-img" loading="lazy">
                    <div class="watch-info">
                        <h3 class="watch-name">{name}</h3>
                        <p class="watch-price">€ {price}</p>
                    </div>
                </a>

'''
    
    # Trouver la position après la dernière montre (avant </div> qui ferme collection-grid)
    # On cherche le dernier </a> avant </div> qui ferme collection-grid
    pattern = r'(</a>\s*</div>\s*<!-- Bouton Find my watch)'
    replacement = watch_card + r'\1'
    html_content = re.sub(pattern, replacement, html_content, count=1)
    
    return html_content

def update_price_in_catalog(html_content, watch_name, new_price):
    """Met à jour le prix d'une montre dans le catalogue"""
    # Pattern pour trouver le prix de la montre spécifique
    pattern = rf'(<h3 class="watch-name">{re.escape(watch_name)}</h3>.*?<p class="watch-price">)€\s*[^<]+(</p>)'
    replacement = rf'\1€ {new_price}\2'
    html_content = re.sub(pattern, replacement, html_content, flags=re.DOTALL)
    return html_content

def update_price_in_watch_page(file_path, new_price):
    """Met à jour le prix dans une page de montre"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Mettre à jour le prix dans l'en-tête
    pattern = r'(<p class="watch-price-large">)€\s*[^<]+(</p>)'
    replacement = rf'\1€ {new_price}\2'
    content = re.sub(pattern, replacement, content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("=" * 80)
print("SYNCHRONISATION COMPLÈTE DU CATALOGUE")
print("=" * 80)

# ÉTAPE 1: Supprimer les fichiers HTML des produits à retirer
print("\n1. Suppression des produits à retirer...")
for name, file in PRODUCTS_TO_REMOVE.items():
    file_path = Path(file)
    if file_path.exists():
        file_path.unlink()
        print(f"   ✓ Supprimé: {file} ({name})")
    else:
        print(f"   ⚠ Fichier non trouvé: {file}")

# ÉTAPE 2: Supprimer les références dans index.html et catalogue.html
print("\n2. Suppression des références dans les catalogues...")
for html_file in ['index.html', 'catalogue.html']:
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    for name, file in PRODUCTS_TO_REMOVE.items():
        content = remove_watch_from_catalog(content, name, file)
    
    if content != original_content:
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"   ✓ Mis à jour: {html_file}")

# ÉTAPE 3: Corriger les prix
print("\n3. Correction des prix...")
for html_file in ['index.html', 'catalogue.html']:
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    for name, new_price in PRICE_CORRECTIONS.items():
        content = update_price_in_catalog(content, name, new_price)
    
    if content != original_content:
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"   ✓ Prix corrigés dans: {html_file}")

# Corriger les prix dans les pages individuelles
for name, new_price in PRICE_CORRECTIONS.items():
    # Trouver le fichier correspondant
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    match = re.search(rf'href="(montre\d+\.html)"[^>]*>.*?<h3 class="watch-name">{re.escape(name)}</h3>', content, re.DOTALL)
    if match:
        file_path = Path(match.group(1))
        if file_path.exists():
            update_price_in_watch_page(file_path, new_price)
            print(f"   ✓ Prix corrigé dans: {file_path} ({name})")

# ÉTAPE 4: Ajouter les nouveaux produits
print("\n4. Ajout des nouveaux produits...")
next_num = get_next_watch_number()

for product in NEW_PRODUCTS:
    watch_num = next_num
    next_num += 1
    
    # Créer la page HTML
    html_content = create_watch_page(watch_num, product)
    file_path = Path(f"montre{watch_num}.html")
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    print(f"   ✓ Créé: montre{watch_num}.html ({product['name']})")
    
    # Ajouter au catalogue
    for html_file in ['index.html', 'catalogue.html']:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        content = add_watch_to_catalog(content, watch_num, product)
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(content)
    print(f"   ✓ Ajouté aux catalogues: {product['name']}")

# ÉTAPE 5: Vérification finale
print("\n5. Vérification finale...")
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

matches = re.findall(r'href="(montre\d+\.html)"', content)
unique_watches = len(set(matches))
print(f"   Total d'articles dans le catalogue: {unique_watches}")

print("\n" + "=" * 80)
print("SYNCHRONISATION TERMINÉE")
print("=" * 80)



