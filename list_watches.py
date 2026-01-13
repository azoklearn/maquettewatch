#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re
from pathlib import Path

# Lire index.html
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extraire toutes les montres
pattern = r'<a href="(montre\d+\.html)"[^>]*data-brand="([^"]+)"[^>]*>.*?<img[^>]*alt="([^"]+)"[^>]*>.*?<h3 class="watch-name">([^<]+)</h3>.*?<p class="watch-price">€\s*([^<]+)</p>'
matches = re.findall(pattern, content, re.DOTALL)

watches = []
seen_pages = set()

for match in matches:
    page, brand, alt, name, price = match
    page_num = int(re.search(r'\d+', page).group())
    if page not in seen_pages:
        watches.append((page_num, page, brand.strip(), name.strip(), price.strip()))
        seen_pages.add(page)

# Trier par numéro de page
watches.sort(key=lambda x: x[0])

print('=' * 95)
print('LISTE COMPLÈTE DES ARTICLES - MACHIAVELLI')
print('=' * 95)
print()
print(f"{'N°':<5} {'Nom':<45} {'Marque':<20} {'Prix':<15} {'Page'}")
print('-' * 95)

for i, (num, page, brand, name, price) in enumerate(watches, 1):
    print(f"{i:<5} {name:<45} {brand:<20} € {price:>12} {page}")

print()
print('-' * 95)
print(f'Total: {len(watches)} articles')
print('=' * 95)



