#a program that use python on setting alarm

import time

#intilizing alarm
alarm_time = input("Set alarm (HH:MM): ")

while True:
    current_time = time.strftime("%H:%M")
    #compare time
    if current_time == alarm_time:
        print("wake up!")
        break
