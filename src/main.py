import json
import os
import itertools

import numpy as np

os.chdir(os.path.dirname(os.path.abspath(__file__)))

complete_cards_path = '../card-guesser/complete_cards.json'
minimal_cards_directory = 'minimal_cards_json'
complete_cards_directory = 'complete_cards_json'
no_picture_cards_directory = 'no_picture_cards_json'
picture_only_cards_directory = 'picture_only_cards_json'
maximal_cards_directory = 'maximal_cards_json'
new_cards_directory = 'new_cards_json'
os.makedirs(minimal_cards_directory, exist_ok=True)
os.makedirs(complete_cards_directory, exist_ok=True)
os.makedirs(no_picture_cards_directory, exist_ok=True)
os.makedirs(picture_only_cards_directory, exist_ok=True)
os.makedirs(maximal_cards_directory, exist_ok=True)
os.makedirs(new_cards_directory, exist_ok=True)

def powerset(iterable):
    """powerset([1,2,3]) --> () (1,) (2,) (3,) (1,2) (1,3) (2,3) (1,2,3)"""
    s = list(iterable)
    return itertools.chain.from_iterable(itertools.combinations(s, r) for r in range(len(s)+1))


def check_unique_subset(complete_cards, checklist, debug=True):
    counter = 0
    for c in complete_cards:
        for e in checklist:
            if e in ['cost', 'speed']:
                if str(c[e]) != str(checklist[e]): break
            elif e in ['range', 'target']:
                if c[e]['text'].replace(' ', '') != checklist[e].replace(' ', ''): break
            elif e == 'threshold':
                if c[e]['conditionText'] != checklist[e]: break
            else:
                if c['elements'][e] != checklist[e]: break
                
        else:
            counter += 1
            if debug:
                print('COMPLETE MATCH', c['name'])
            if counter > 1:
                return False
    
    assert counter == 1, checklist
    
    return True


def generate_minimal_cards():
    def find_subset(complete_card, include_threshold=False):
        options = ['cost', 'sun', 'moon', 'fire', 'air', 'water', 'earth', 'plant', 'animal', 'target']
        if complete_card['range']['enabled']:
            options.append('range')
        if include_threshold:
            options.append('threshold')
        
        valid_checklists = set()
        
        for subset in powerset(options):
            subset = list(subset) + ['speed']
            if not complete_card['range']['enabled']:
                subset += ['range']
            
            checklist = {}
            for e in subset:
                if e in ['cost', 'speed']:
                    checklist[e] = complete_card[e]
                elif e in ['range', 'target']:
                    checklist[e] = complete_card[e]['text']
                elif e == 'threshold':
                    checklist[e] = complete_card[e]['conditionText']
                elif complete_card['elements'][e]:
                    checklist[e] = complete_card['elements'][e]
            
            if valid_checklists and len(checklist) > len(list(valid_checklists)[0]):
                break
            
            if check_unique_subset(complete_cards, checklist, debug=len(subset) == len(options) + 1 + (not complete_card['range']['enabled'])):
                valid_checklists.add(tuple(sorted(checklist.keys())))
                
        return valid_checklists
        
    with open(complete_cards_path) as fp:
        complete_cards = json.load(fp)

    # Categories are cost, speed, range, target, elements, threshold condition
    # Speed has to be there as can't remove
    for complete_card in complete_cards:
        print(complete_card['title'])
        base_card = json.loads(json.dumps(complete_card))
        base_card['name'] = ''
        base_card['cost'] = ''
        base_card['range']['text'] = ''
        base_card['target']['enabled'] = True
        base_card['target']['text'] = ''
        base_card['effect'] = ''
        base_card['elements'] = {i: False for i in base_card['elements']}
        base_card['threshold']['enabled'] = False
        base_card['threshold']['conditionText'] = ''
        base_card['threshold']['effectText'] = ''
        base_card['art']['image'] = None
        base_card['art']['url'] = None
        base_card['art']['artist'] = ''
        
        valid_checklists = find_subset(complete_card)
        if not valid_checklists and complete_card['threshold']['conditionText']:
            valid_checklists = find_subset(complete_card, True)
            
        if not valid_checklists:
            print(f"------------------------------------------{complete_card['title']} had no unique subset")
            valid_checklists = set([('effect',), ('art',)])

        for idx, checklist in enumerate(valid_checklists):
            card = json.loads(json.dumps(base_card))
            for e in checklist:
                if e in ['cost', 'speed', 'effect']:
                    card[e] = complete_card[e]
                elif e in ['range', 'target']:
                    card[e]['text'] = complete_card[e]['text']
                elif e == 'threshold':
                    card[e]['conditionText'] = complete_card[e]['conditionText']
                    card[e]['enabled'] = True
                elif e == 'art':
                    card['art']['url'] = complete_card[e]['url']
                    card['art']['artist'] = complete_card[e]['artist']
                else:
                    card['elements'][e] = complete_card['elements'][e]
            print(checklist)
        
            with open(os.path.join(minimal_cards_directory, complete_card['id'] + f'_{str(idx).rjust(2, "0")}.json'), 'w') as fp:
                json.dump(card, fp, indent=4)
                
        complete_card['minimal_count'] = len(valid_checklists)

    with open(complete_cards_path, 'w') as fp:
        complete_cards.sort(key=lambda x: x['id'])
        json.dump(complete_cards, fp, indent=4)


def generate_no_picture_cards():
    with open(complete_cards_path) as fp:
        complete_cards = json.load(fp)
        
    for complete_card in complete_cards:
        print(complete_card['title'])
        card = json.loads(json.dumps(complete_card))
        card['name'] = ''
        card['art']['image'] = None
        card['art']['url'] = None
        card['art']['artist'] = ''
        
        with open(os.path.join(no_picture_cards_directory, complete_card['id'] + '.json'), 'w') as fp:
            json.dump(card, fp, indent=4)
            
            
def generate_picture_only_cards():
    with open(complete_cards_path) as fp:
        complete_cards = json.load(fp)
        
    for complete_card in complete_cards:
        print(complete_card['title'])
        card = json.loads(json.dumps(complete_card))
        card['name'] = ''
        card['cost'] = ''
        card['range']['text'] = ''
        card['target']['enabled'] = True
        card['target']['text'] = ''
        card['effect'] = ''
        card['elements'] = {i: False for i in card['elements']}
        card['threshold']['enabled'] = False
        card['threshold']['conditionText'] = ''
        card['threshold']['effectText'] = ''
        
        with open(os.path.join(picture_only_cards_directory, complete_card['id'] + '.json'), 'w') as fp:
            json.dump(card, fp, indent=4)
            
            
def generate_maximal_cards():
    with open(complete_cards_path) as fp:
        complete_cards = json.load(fp)
        
    for complete_card in complete_cards:
        print(complete_card['title'])
        card = json.loads(json.dumps(complete_card))
        card['name'] = ''
        
        with open(os.path.join(maximal_cards_directory, complete_card['id'] + '.json'), 'w') as fp:
            json.dump(card, fp, indent=4)


def generate_complete_cards():
    with open(complete_cards_path) as fp:
        complete_cards = json.load(fp)
        
    for complete_card in complete_cards:
        print(complete_card['title'])
        card = json.loads(json.dumps(complete_card))
        
        with open(os.path.join(complete_cards_directory, complete_card['id'] + '.json'), 'w') as fp:
            json.dump(card, fp, indent=4)


def get_unique_values():
    with open(complete_cards_path) as fp:
        complete_cards = json.load(fp)

    keys = {
        "cost": None,
        "range": lambda x: str(x["range"]["enabled"]) + "/" + x["range"]["text"],
        "target": lambda x: x["target"]["text"],
        "threshold": lambda x: str(x["threshold"]["enabled"]) + "/" + x["threshold"]["conditionText"],
        "type": None,
        "set": None,
    }
    
    results = {key: np.unique([f(c) if f is not None else c[key] for c in complete_cards], return_counts=True) for key, f in keys.items()}
    for key, val in results.items():
        print(key)
        idxs = np.argsort(val[1])[::-1]
        print("\n".join([f"{val[1][i]} {val[0][i]}" for i in idxs]))
        print("\n\n")


def process_new_cards():
    new_cards = []
    for f in os.listdir(new_cards_directory):
        with open(os.path.join(new_cards_directory, f)) as fp:
            card = json.load(fp)
        card["title"] = card["name"].replace("\n", " ")
        while True:
            q = input(card["title"])
            if q:
                card["title"] = q
            else:
                break
                
        card["id"] = card["title"].replace(" ", "_").lower().replace("-", "").replace("'", "").replace(",", "")
        while True:
            q = input(card["id"])
            if q:
                card["id"] = q
            else:
                break
                
        card["type"] = "unique"
        while True:
            q = input(f"Type is {card['type']}, change to major/minor/unique??")
            if q:
                card["type"] = q
            else:
                break
                
        card["set"] = "ni"
        card["art"]["image"] = None
        card["art"]["url"] = f"https://sick.oberien.de/imgs/powers/{card['id']}.webp"
        
        new_cards.append(card)
    
    # Check statistics
    print("Types")
    print(np.unique([i["type"] for i in new_cards], return_counts=True))
    print("Sets")
    print(np.unique([i["set"] for i in new_cards], return_counts=True))
    
    with open("new_cards.json", "w") as fp:
        json.dump(new_cards, fp, indent=4)

generate_minimal_cards()
# generate_no_picture_cards()
# generate_picture_only_cards()
# generate_maximal_cards()
# generate_complete_cards()
# get_unique_values()
# process_new_cards()