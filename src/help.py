import os
import pyautogui
import time

os.chdir(os.path.dirname(os.path.abspath(__file__)))

files = os.listdir('maximal_cards_json')

print(pyautogui.size())

def check_position():
    while True:
        time.sleep(sleep_time)
        print(pyautogui.position())

def process_card(card):
    time.sleep(0.1)
    pyautogui.click(1567, 854)
    time.sleep(0.4)
    pyautogui.typewrite(card)
    pyautogui.click(553, 448)
    time.sleep(0.2)
    pyautogui.click(1657, 542, button='right')
    time.sleep(0.2)
    pyautogui.moveTo(1715, 589)
    pyautogui.click(1715, 589)
    time.sleep(0.4)
    pyautogui.typewrite(card)
    pyautogui.click(553, 448)

# check_position()
time.sleep(2)
for f in files:
    print(f)
    process_card(os.path.splitext(f)[0])
