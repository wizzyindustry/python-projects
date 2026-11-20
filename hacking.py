import random
import time

green = "\033[92m"

def terminal_hack(text, min_delay = 0.02, max_delay=0.26):
    for char in text:
        print(char, end="", flush=True)
        time.sleep(random.uniform(min_delay, max_delay))
    print()

print(green, end="")

for line in ["Connecting to network....",
            "Bypassing Firewall...", 
            "Access granted....",
            "I'am in your system :>"]:
    terminal_hack(line)
    time.sleep(0.5)