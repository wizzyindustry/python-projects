#=============================================
# Real time typing Speed test
#=============================================


import time
import os
import random

words = [
    "python", "variable", "function", "loop", "condition",
    "dictionary", "list", "tuple", "module", "import", "class", 
    "object", "exception", "debug", "algorithm", "recursion", 
    "iteration", "boolean", "string", "interger", "javascript"
]

def typing_test():
    print("Typing speed Test - 15 seconds")
    print("Type the words as fast as you can\n")
    print("Press Enter when ready....")

    score = 0
    start_time = time.time()
    end_time = start_time + 30

    words_to_type = random.sample(words * 11, 12)

    for i, word in enumerate(words_to_type, 1):
        if time.time()> end_time:
            break
        print(f"[{i}/{len(words_to_type)}] {word}")
        typed = input("-> ").strip()
        if typed  == word:
            score += 1
            print("corect ")
        else:
            print(f"wrong: (was: {word})")
        
    taken = time.time() - start_time
    wpm = score / taken * 60

    print("\n" + "=" * 40)
    print(f"Time: {taken:.1f} seconds")
    print(f"Correct words: {score}")
    print(f"Your speed: {wpm:.0f} WPM")
    print("=" * 40)

if __name__ == "__main__":
    while True:
        typing_test()
        again = input("\nAnother round? (y/n): ").lower()
        os.system("cls")
        if again != 'y':
            break