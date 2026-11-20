import winsound, time

Time = int(input("Seconds to wait: "))
time.sleep(Time)

for i in range(30):
    winsound.Beep(1000, 3000)
print("Alarm Finished!")

