import glob
import os

from PIL import Image
from tqdm import tqdm

os.chdir(os.path.dirname(os.path.abspath(__file__)))

folders = [
    'assets',
    'complete_cards_img',
    'maximal_cards_img',
    'minimal_cards_img',
    'no_picture_cards_img',
    'picture_only_cards_img',
]

for fold in folders:
    print(f"Folder {fold}")
    for f in tqdm(glob.glob(os.path.join("..", "card-guesser", fold, "*.png"))):
        img = Image.open(f)
        img = img.convert("RGB")
        img.save(os.path.join(os.path.splitext(f)[0] + ".jpg"))
        os.remove(f)