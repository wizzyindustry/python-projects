import random
import time 

class LoveCalculator:
    def calculate(self, name1, name2):
        print("\n Calculating love score......")
        time.sleep(1)

        score = random.randint(1, 100)

        print("\n" + "=" * 30)
        print("     💘LOVE CALCULATOR 💘    ")
        print("=" * 30)
        print(f'👨‍💼{name1}')
        print("💘loves")
        print(f'👨‍💼{name2}')
        print("=" * 30)
        print(f"💯 Love Score: {score}%")
        print("-" * 30)

        if score >= 80:
            print(" 💞Perfect Match!")
        elif score >= 50:
            print("😇 Good Match!")
        else:
            print("😅 Better stay friends!")


love = LoveCalculator()

name1 = input("Your name: ")
name2 = input("Crush name: ")

love.calculate(name1, name2)
