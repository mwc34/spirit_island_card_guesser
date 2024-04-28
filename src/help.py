import os
import pyautogui
import time

os.chdir(os.path.dirname(os.path.abspath(__file__)))

folder_type = 'minimal_cards'

files = os.listdir(folder_type + '_json')

print(pyautogui.size())

def check_position():
    while True:
        time.sleep(1)
        print(pyautogui.position())

def process_card(card):
    BROWSE = 1567, 854
    OPEN = 921, 625
    CARD_IMG = 1657, 542
    SAVE = 1715, 589

    time.sleep(0.1)
    pyautogui.click(*BROWSE)
    time.sleep(0.4)
    pyautogui.typewrite(card)
    pyautogui.click(*OPEN)
    time.sleep(0.2)
    pyautogui.click(*CARD_IMG, button='right')
    time.sleep(0.4)
    pyautogui.moveTo(*SAVE)
    pyautogui.click(*SAVE)
    time.sleep(0.4)
    pyautogui.typewrite(card)
    pyautogui.click(*OPEN)


def new_only(files):
    old_files = os.listdir(os.path.join('..', 'card-guesser', folder_type + '_img'))
    to_set = lambda x: set(map(lambda y: os.path.splitext(y)[0], x))
    return list(to_set(files) - to_set(old_files))

# check_position()
time.sleep(3)
files = new_only(files)
limit_count = None
for idx, f in enumerate(sorted(files)[:limit_count]):
    print(f"{str(idx).rjust(len(str(len(files))), '0')}/{len(files)}: {f}")
    process_card(os.path.splitext(f)[0])
