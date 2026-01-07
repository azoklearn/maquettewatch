#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pour synchroniser complètement catalogue.html avec index.html
"""

import re
from pathlib import Path

def fix_catalogue():
    """Synchronise complètement catalogue.html avec index.html"""
    base_dir = Path(__file__).parent
    
    # Lire index.html
    with open(base_dir / 'index.html', 'r', encoding='utf-8') as f:
        index_content = f.read()
    
    # Lire catalogue.html
    with open(base_dir / 'catalogue.html', 'r', encoding='utf-8') as f:
        catalogue_content = f.read()
    
    # Extraire la section collection-grid complète de index.html (de <div class="collection-grid" jusqu'à </div> avant le bouton)
    collection_match = re.search(
        r'(<div class="collection-grid" id="watchGrid">.*?</div>\s*<!-- Bouton Find my watch)',
        index_content,
        re.DOTALL
    )
    
    if not collection_match:
        print("❌ Impossible de trouver la section collection-grid dans index.html")
        return
    
    collection_section = collection_match.group(1)
    
    # Extraire le bouton "Source my watch" et la fermeture
    button_match = re.search(
        r'(<!-- Bouton Find my watch.*?</div>\s*</div>\s*</div>\s*</section>)',
        index_content,
        re.DOTALL
    )
    
    if not button_match:
        print("❌ Impossible de trouver le bouton dans index.html")
        return
    
    button_section = button_match.group(1)
    
    # Dans catalogue.html, trouver où commence la section après le banner
    # Chercher la fin du banner (fermeture des divs du banner)
    # Et remplacer tout jusqu'à </section>
    
    # Pattern: trouver la fin du banner et remplacer jusqu'à </section> de la section collection
    pattern = r'(</div>\s*</div>\s*</div>\s*</div>\s*</div>\s*</div>\s*<!-- Bandeau Derniers Ajouts -->.*?</div>\s*</div>\s*</div>\s*</div>\s*</div>\s*</div>\s*</div>)(.*?)(</section>\s*<!-- Footer)'
    
    replacement = r'\1\n\n            ' + collection_section + '\n\n' + button_section + '\n\n    <!-- Footer'
    
    new_content = re.sub(pattern, replacement, catalogue_content, flags=re.DOTALL)
    
    # Corriger les liens dupliqués dans la navbar
    new_content = re.sub(
        r'(<a href="index\.html#collection" class="nav-minimal-link">STOCK</a>\s*<a href="contact\.html" class="nav-minimal-link">CONTACT</a>.*?<a href="#collection" class="nav-minimal-link">STOCK</a>\s*<a href="contact\.html" class="nav-minimal-link">CONTACT</a>)',
        r'<a href="index.html#collection" class="nav-minimal-link">STOCK</a>\n            <a href="contact.html" class="nav-minimal-link">CONTACT</a>',
        new_content,
        flags=re.DOTALL
    )
    
    # Écrire le nouveau contenu
    with open(base_dir / 'catalogue.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("✅ catalogue.html complètement synchronisé avec index.html")

if __name__ == "__main__":
    fix_catalogue()


