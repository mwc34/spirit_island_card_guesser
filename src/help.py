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
    time.sleep(0.1)
    pyautogui.click(1567, 854)
    time.sleep(0.4)
    pyautogui.typewrite(card)
    pyautogui.click(785, 510)
    time.sleep(0.2)
    pyautogui.click(1657, 542, button='right')
    time.sleep(0.4)
    pyautogui.moveTo(1715, 589)
    pyautogui.click(1715, 589)
    time.sleep(0.4)
    pyautogui.typewrite(card)
    pyautogui.click(785, 510)


def horizons_only(files):
    old_files = os.listdir(os.path.join('..', 'card-guesser', folder_type + '_img'))
    to_set = lambda x: set(map(lambda y: os.path.splitext(y)[0], x))
    return list(to_set(files) - to_set(old_files))

# check_position()
time.sleep(2)
for f in files:
    print(f)
    process_card(os.path.splitext(f)[0])
