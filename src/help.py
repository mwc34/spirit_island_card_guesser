import os
import pyautogui
import time

os.chdir(os.path.dirname(os.path.abspath(__file__)))

files = os.listdir('no_picture_cards_json')

print(pyautogui.size())

sleep_time = 0.4

def check_position():
    while True:
        time.sleep(sleep_time)
        print(pyautogui.position())

def process_card(card):
    time.sleep(sleep_time)
    pyautogui.click(1567, 854)
    time.sleep(sleep_time)
    pyautogui.typewrite(card)
    pyautogui.click(553, 448)
    time.sleep(sleep_time)
    pyautogui.click(1657, 542, button='right')
    time.sleep(sleep_time)
    pyautogui.moveTo(1715, 589)
    pyautogui.click(1715, 589)
    time.sleep(sleep_time)
    pyautogui.typewrite(card)
    pyautogui.click(553, 448)

# check_position()
time.sleep(2)
for f in files:
    print(f)
    process_card(os.path.splitext(f)[0])
