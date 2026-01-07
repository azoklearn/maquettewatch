#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de synchronisation du catalogue avec Machiavelli Watches
Objectif: 55 articles exactement, alignés avec la source officielle
"""

import re
import unicodedata
from pathlib import Path

# ============================================
# PRODUITS À SUPPRIMER (12 produits)
# ============================================
PRODUCTS_TO_REMOVE = [
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

# ============================================
# NOUVEAUX PRODUITS À AJOUTER (7 produits)
# ============================================
NEW_PRODUCTS = [
    {
        "name": "Patek Philippe Annual Calendar 5726",
        "brand": "Patek Philippe",
        "price": "135.000",
        "image": "patek-philippe-annual-calendar-5726.webp"
    },
    {
        "name": "Rolex Submariner No Date 124060",
        "brand": "Rolex",
        "price": "11.000",
        "image": "rolex-submariner-no-date-124060.webp",
        "year": "2023"
    },
    {
        "name": "GMT Master II Pepsi 126710BLRO",
        "brand": "Rolex",
        "price": "21.500",
        "image": "gmt-master-ii-pepsi-126710blro.webp",
        "year": "2024"
    },
    {
        "name": "GMT Master II Zombie Gold 126718GRNR",
        "brand": "Rolex",
        "price": "42.000",
        "image": "gmt-master-ii-zombie-gold-126718grnr.webp"
    },
    {
        "name": "Yacht Master II 116680",
        "brand": "Rolex",
        "price": "15.900",
        "image": "yacht-master-ii-116680.webp"
    },
    {
        "name": "Oyster Perpetual 36 ref. 126000",
        "brand": "Rolex",
        "price": "9.900",
        "image": "oyster-perpetual-36-ref-126000.webp"
    },
    {
        "name": "Breitling Bentley A25362",
        "brand": "Breitling",
        "price": "4.500",
        "image": "breitling-bentley-a25362.webp"
    }
]

# ============================================
# CORRECTIONS DE PRIX
# ============================================
PRICE_CORRECTIONS = {
    "Cartier Santos 100th anniversary": "15.000",
    "GMT Master II Sprite": "14.900",
    "Yacht Master 40": "15.900",  # Vérifier lequel
    "Breitling": "Price on request"  # Spécial
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

print("=" * 80)
print("SYNCHRONISATION DU CATALOGUE MACHIAVELLI WATCHES")
print("=" * 80)
print(f"\nProduits à supprimer: {len(PRODUCTS_TO_REMOVE)}")
print(f"Nouveaux produits à ajouter: {len(NEW_PRODUCTS)}")
print(f"Corrections de prix: {len(PRICE_CORRECTIONS)}")
print(f"\nProchain numéro de montre: {get_next_watch_number()}")



