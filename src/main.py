import json
import os
import itertools

os.chdir(os.path.dirname(os.path.abspath(__file__)))

complete_directory = '../card-guesser/complete_cards_json'
minimal_directory = '../card-guesser/minimal_cards_json'
os.makedirs(minimal_directory, exist_ok=True)

def powerset(iterable):
    """powerset([1,2,3]) --> () (1,) (2,) (3,) (1,2) (1,3) (2,3) (1,2,3)"""
    s = list(iterable)
    return itertools.chain.from_iterable(itertools.combinations(s, r) for r in range(len(s)+1))


def load_cards():
    cards = []
    for f in os.listdir(complete_directory):
        print(f)
        with open(os.path.join(complete_directory, f)) as fp:
            c = json.load(fp)
            c['file_name'] = os.path.splitext(f)[0]
            
            if c['range']['enabled'] and 'spirit' in c['target']['text']:
                print(c)
                input()
            cards.append(c)
        
    return cards


def check_unique_subset(complete_cards, checklist, debug=True):
    counter = 0
    for c in complete_cards:
        for e in checklist:
            if e in ['cost', 'speed']:
                if c[e] != checklist[e]: break
            elif e in ['range', 'target']:
                if c[e]['text'] != checklist[e]: break
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


def generate_minimal_cards(complete_cards):
    def find_subset(complete_card, card, include_threshold=False):
        options = ['cost', 'sun', 'moon', 'fire', 'air', 'water', 'earth', 'plant', 'animal', 'range', 'target']
        if include_threshold:
            options.append('threshold')
            
        for subset in powerset(options):
            subset = list(subset) + ['speed']
                
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
            
            if check_unique_subset(complete_cards, checklist, debug=len(subset) == len(options) + 1):
                for e in checklist:
                    if e in ['cost', 'speed']:
                        card[e] = checklist[e]
                    elif e in ['range', 'target']:
                        card[e]['text'] = checklist[e]
                    elif e == 'threshold':
                        card[e]['conditionText'] = checklist[e]
                        card[e]['enabled'] = True
                    else:
                        card['elements'][e] = checklist[e]
                print(tuple(checklist.keys()))
                return card
                
        else:
            return None
        
        
        
                
    cards = []
    # Categories are cost, speed, range, target, elements, threshold condition
    # Speed has to be there as can't remove
    for complete_card in complete_cards:
        print(complete_card['name'])
        card = json.loads(json.dumps(complete_card))
        card['id'] = card['name']
        card['name'] = ''
        card['cost'] = ''
        card['range']['enabled'] = True
        card['range']['text'] = ''
        card['target']['enabled'] = True
        card['target']['text'] = ''
        card['effect'] = ''
        card['elements'] = {i: False for i in card['elements']}
        card['threshold']['enabled'] = False
        card['threshold']['conditionText'] = ''
        card['threshold']['effectText'] = ''
        card['art']['image'] = None
        card['art']['url'] = None
        card['art']['artist'] = ''
        
        if not find_subset(complete_card, card):
            if not complete_card['threshold']['conditionText'] or not find_subset(complete_card, card, True):
                print(f"------------------------------------------{complete_card['name']} had no unique subset")
                card['effect'] = complete_card['effect']
            
        with open(os.path.join(minimal_directory, card['file_name'] + '.json'), 'w') as fp:
            json.dump(card, fp)
            

def generate_card_name_list(save_path):
    names = sorted(map(lambda x: os.path.splitext(x)[0], os.listdir(complete_directory)))
    with open(save_path, 'w') as fp:
        json.dump(names, fp, indent=4)