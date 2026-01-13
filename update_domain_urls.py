#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Script pour mettre à jour les URLs du domaine dans tous les fichiers HTML
Utilisation: python3 update_domain_urls.py <nouveau-domaine>
Exemple: python3 update_domain_urls.py machiavelli.com
"""

import sys
import re
from pathlib import Path

if len(sys.argv) < 2:
    print("Usage: python3 update_domain_urls.py <nouveau-domaine>")
    print("Exemple: python3 update_domain_urls.py machiavelli.com")
    sys.exit(1)

new_domain = sys.argv[1]
# S'assurer que le domaine commence par https://
if not new_domain.startswith('http'):
    new_domain = f"https://{new_domain}"

old_domain = "https://maquettewatch.vercel.app"

print(f"Remplacement de {old_domain} par {new_domain}...")

# Trouver tous les fichiers HTML
base_dir = Path('.')
html_files = sorted(base_dir.glob('*.html'))

updated_files = 0

for file_path in html_files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if old_domain in content:
            new_content = content.replace(old_domain, new_domain)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"  ✓ {file_path.name} mis à jour")
            updated_files += 1
    except Exception as e:
        print(f"  ✗ Erreur avec {file_path.name}: {e}")

print(f"\n{updated_files} fichier(s) mis à jour.")





