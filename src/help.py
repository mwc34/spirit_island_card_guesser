import json
import os
import itertools
import shutil
import requests

os.chdir(os.path.dirname(os.path.abspath(__file__)))

working_directory = '../card-guesser/complete_cards_json'
old_directory = 'old'

def downloadImage(url, file_path):

    # Open the url image, set stream to True, this will return the stream content.
    r = requests.get(url, stream = True)

    # Check if the image was retrieved successfully
    if r.status_code == 200:
        # Set decode_content value to True, otherwise the downloaded image file's size will be zero.
        r.raw.decode_content = True
        
        # Open a local file with wb ( write binary ) permission.
        with open(file_path, 'wb+') as f:
            shutil.copyfileobj(r.raw, f)
            
        return True
        
    else:
        print('Image Couldn\'t be retreived')
        print(url)
        return False

old_names = sorted(os.listdir(old_directory))
working_names = sorted(os.listdir(working_directory))

for of, wf in zip(old_names, working_names):
    with open(os.path.join(old_directory, of)) as fp:
        o = json.load(fp)
    with open(os.path.join(working_directory, wf)) as fp:
        w = json.load(fp)
    
    file_path = 'card-guesser/complete_cards_img/' + os.path.basename(o['art']['url'])
    downloadImage(o['art']['url'], '../' + file_path)
    
    w['id'] = os.path.splitext(of)[0]
    w['art']['url'] = '/' + file_path
    
    with open(os.path.join(working_directory, wf), 'w') as fp:
        json.dump(w, fp, indent=4)