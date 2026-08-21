#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script complet de synchronisation du catalogue avec Machiavelli Watches
Objectif: 55 articles exactement, alignés avec la source officielle
"""

import re
import unicodedata
from pathlib import Path
from urllib.parse import quote

# ============================================
# CONFIGURATION
# ============================================
DOMAIN = "maquettewatch.vercel.app"

# Produits à supprimer (nom exact tel qu'affiché)
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
        "material": "Steel"
    },
    {
        "name": "Rolex Submariner No Date 124060",
        "brand": "Rolex",
        "price": "11.000",
        "reference": "124060",
        "year": "2023",
        "material": "Steel"
    },
    {
        "name": "GMT Master II Pepsi 126710BLRO",
        "brand": "Rolex",
        "price": "21.500",
        "reference": "126710BLRO",
        "year": "2024",
        "material": "Steel"
    },
    {
        "name": "GMT Master II Zombie Gold 126718GRNR",
        "brand": "Rolex",
        "price": "42.000",
        "reference": "126718GRNR",
        "material": "Gold"
    },
    {
        "name": "Yacht Master II 116680",
        "brand": "Rolex",
        "price": "15.900",
        "reference": "116680",
        "material": "Steel"
    },
    {
        "name": "Oyster Perpetual 36 ref. 126000",
        "brand": "Rolex",
        "price": "9.900",
        "reference": "126000",
        "material": "Steel"
    },
    {
        "name": "Breitling Bentley A25362",
        "brand": "Breitling",
        "price": "Price on request",
        "reference": "A25362",
        "material": "Steel"
    }
]

# Corrections de prix
PRICE_CORRECTIONS = {
    "Cartier Santos 100th anniversary": "15.000",
    "GMT Master II Sprite": "14.900",
    "Yacht Master 40": "15.900",  # Le premier (montre27.html)
    "Breitling": "Price on request"  # montre40.html
}

def normalize_image_name(name):
    """Convertit un nom de montre en nom de fichier image"""
    # Enlever les accents
    name = unicodedata.normalize('NFD', name)
    name = name.encode('ascii', 'ignore').decode('ascii')
    # Convertir en minuscules
    name = name.lower()
    # Remplacer les espaces et caractères spéciaux par des tirets
    name = re.sub(r'[^a-z0-9]+', '-', name)
    # Enlever les tirets multiples
    name = re.sub(r'-+', '-', name)
    # Enlever les tirets en début/fin
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
    
    # Créer le nom d'image
    image_name = normalize_image_name(name)
    
    # Créer l'URL WhatsApp
    whatsapp_text = quote(f"I am interested par {name}\n\nhttps://{DOMAIN}/montre{watch_num}.html")
    whatsapp_url = f"https://api.whatsapp.com/send?phone=32484709109&text={whatsapp_text}"
    
    # Extraire le titre court (sans la marque)
    title_short = name.replace(f"{brand} ", "") if name.startswith(brand) else name
    
    html_template = f'''<!DOCTYPE html>
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
    
    return html_template

print("=" * 80)
print("SCRIPT DE SYNCHRONISATION DU CATALOGUE")
print("=" * 80)
print(f"\nProduits à supprimer: {len(PRODUCTS_TO_REMOVE)}")
print(f"Nouveaux produits à ajouter: {len(NEW_PRODUCTS)}")
print(f"Corrections de prix: {len(PRICE_CORRECTIONS)}")
print(f"\nProchain numéro de montre disponible: {get_next_watch_number()}")



