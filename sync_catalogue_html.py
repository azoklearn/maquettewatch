#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pour synchroniser catalogue.html avec index.html
"""

import re
from pathlib import Path

def sync_catalogue():
    """Synchronise catalogue.html avec index.html"""
    base_dir = Path(__file__).parent
    
    # Lire index.html
    with open(base_dir / 'index.html', 'r', encoding='utf-8') as f:
        index_content = f.read()
    
    # Lire catalogue.html
    with open(base_dir / 'catalogue.html', 'r', encoding='utf-8') as f:
        catalogue_content = f.read()
    
    # Extraire la section collection-grid de index.html
    collection_grid_match = re.search(
        r'(<div class="collection-grid" id="watchGrid">.*?</div>\s*<!-- Bouton Find my watch)',
        index_content,
        re.DOTALL
    )
    
    if not collection_grid_match:
        print("❌ Impossible de trouver la section collection-grid dans index.html")
        return
    
    collection_grid_section = collection_grid_match.group(1)
    
    # Extraire le bouton "Source my watch"
    button_match = re.search(
        r'(<!-- Bouton Find my watch.*?</div>\s*</div>\s*</div>\s*</section>)',
        index_content,
        re.DOTALL
    )
    
    if button_match:
        button_section = button_match.group(1)
    else:
        button_section = '''            <!-- Bouton Find my watch -->
            <div style="text-align: center; margin-top: 60px;">
                <a href="find-my-watch.html" class="catalogue-button" style="display: inline-block;">
                    Source my watch
                </a>
            </div>
            </div>
        </div>
    </section>'''
    
    # Trouver où insérer dans catalogue.html (après le banner latest-additions)
    # Chercher la fin du banner et le début de la section watchGrid
    banner_end_pattern = r'(</div>\s*</div>\s*</div>\s*</div>\s*</div>\s*</div>\s*<!-- Bandeau Derniers Ajouts -->.*?</div>\s*</div>\s*</div>\s*</div>\s*</div>\s*</div>\s*</div>)'
    
    # Remplacer tout ce qui vient après le banner jusqu'à la fin de la section collection
    # On cherche la fin du banner et on remplace jusqu'à </section>
    pattern = r'(</div>\s*</div>\s*</div>\s*</div>\s*</div>\s*</div>\s*<!-- Bandeau Derniers Ajouts -->.*?</div>\s*</div>\s*</div>\s*</div>\s*</div>\s*</div>\s*</div>)(.*?)(</section>)'
    
    replacement = r'\1\n\n            <div class="collection-grid" id="watchGrid">' + \
                  collection_grid_section.split('<div class="collection-grid" id="watchGrid">')[1].split('</div>')[0] + \
                  '\n</div>\n\n' + button_section
    
    new_catalogue_content = re.sub(pattern, replacement, catalogue_content, flags=re.DOTALL)
    
    # Corriger les liens dupliqués dans la navbar
    # Supprimer les liens STOCK et CONTACT dupliqués
    new_catalogue_content = re.sub(
        r'(<a href="index\.html#collection" class="nav-minimal-link">STOCK</a>\s*<a href="contact\.html" class="nav-minimal-link">CONTACT</a>\s*<a href="#collection" class="nav-minimal-link">STOCK</a>\s*<a href="contact\.html" class="nav-minimal-link">CONTACT</a>)',
        r'<a href="index.html#collection" class="nav-minimal-link">STOCK</a>\n            <a href="contact.html" class="nav-minimal-link">CONTACT</a>',
        new_catalogue_content
    )
    
    # Écrire le nouveau contenu
    with open(base_dir / 'catalogue.html', 'w', encoding='utf-8') as f:
        f.write(new_catalogue_content)
    
    print("✅ catalogue.html synchronisé avec index.html")

if __name__ == "__main__":
    sync_catalogue()


