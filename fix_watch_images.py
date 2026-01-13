#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pour corriger les chemins d'images dans les fichiers de montres
"""

import os
import re
from pathlib import Path

def fix_watch_images():
    """Corrige les chemins d'images dans tous les fichiers montre*.html"""
    base_dir = Path(__file__).parent
    
    # Trouver tous les fichiers montre*.html
    watch_files = sorted(base_dir.glob("montre*.html"))
    
    fixed_count = 0
    
    for watch_file in watch_files:
        try:
            with open(watch_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Extraire le numéro de la montre depuis le nom du fichier
            match = re.search(r'montre(\d+)\.html', watch_file.name)
            if not match:
                continue
            
            watch_num = match.group(1)
            correct_image = f"{watch_num}.webp"
            
            # Remplacer les chemins d'images incorrects
            # Pattern 1: montre/montreX.png.webp ou montre/montreX.webp
            content = re.sub(
                r'src="montre/montre\d+\.(png\.)?webp"',
                f'src="{correct_image}"',
                content
            )
            
            # Pattern 2: tout autre chemin incorrect qui ne correspond pas à X.webp
            # On garde seulement les chemins qui sont déjà corrects (X.webp) ou aeje.jpg
            # On remplace les autres chemins d'images de montres
            def replace_watch_image(match):
                img_tag = match.group(0)
                # Si c'est déjà le bon format ou un autre fichier (aeje.jpg, etc.), on le garde
                if f'"{watch_num}.webp"' in img_tag or 'aeje.jpg' in img_tag:
                    return img_tag
                # Sinon, on le remplace
                return img_tag.replace(re.search(r'src="([^"]+)"', img_tag).group(1), correct_image)
            
            # Remplacer dans les balises img qui contiennent "watch-img" ou "watch-image-container"
            content = re.sub(
                r'<img[^>]*class="[^"]*watch[^"]*"[^>]*src="[^"]*montre[^"]*"[^>]*>',
                lambda m: re.sub(r'src="[^"]*montre[^"]*"', f'src="{correct_image}"', m.group(0)),
                content
            )
            
            # Vérifier s'il y a eu des changements
            if content != original_content:
                with open(watch_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"✅ Corrigé: {watch_file.name} -> image: {correct_image}")
                fixed_count += 1
            else:
                # Vérifier si l'image est correcte
                if f'src="{correct_image}"' in content or f'src="montre/' in content:
                    # Vérifier plus précisément
                    if re.search(rf'src="(montre/|.*/){correct_image}"', content):
                        print(f"⚠️  {watch_file.name}: chemin d'image suspect trouvé")
                    elif f'src="{correct_image}"' in content:
                        print(f"✓ {watch_file.name}: image correcte ({correct_image})")
                    else:
                        print(f"⚠️  {watch_file.name}: aucune image trouvée avec le bon format")
        
        except Exception as e:
            print(f"❌ Erreur lors du traitement de {watch_file.name}: {e}")
    
    print(f"\n📊 Total: {fixed_count} fichier(s) corrigé(s)")

if __name__ == "__main__":
    fix_watch_images()


