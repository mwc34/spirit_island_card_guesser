import os
import pyautogui
import time

os.chdir(os.path.dirname(os.path.abspath(__file__)))

files = os.listdir('minimal_cards_json')

print(pyautogui.size())

sleep_time = 0.5

def process_card(card):
    time.sleep(sleep_time)
    pyautogui.click(1567, 854)
    time.sleep(sleep_time)
    pyautogui.typewrite(card)
    time.sleep(sleep_time)
    pyautogui.click(553, 448)
    time.sleep(sleep_time)
    pyautogui.click(1657, 542, button='right')
    time.sleep(sleep_time)
    pyautogui.moveTo(1715, 589)
    pyautogui.click(1715, 589)
    time.sleep(sleep_time)
    pyautogui.typewrite(card)
    time.sleep(sleep_time)
    pyautogui.click(553, 448)
    time.sleep(sleep_time)
    
time.sleep(2)
for f in files:
    print(f)
    process_card(os.path.splitext(f)[0])
