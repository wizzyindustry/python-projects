#my triying projects

menu = {
        1: "toa pesa",
        2: "tuma pesa",
        3: "lipa bill",
        4: "jihudumie",
        5: "toka",
        9: "menu kuu"
    }

for i,j in menu.items():
        print(i,j)


while True:
        user_choice = int(input("Enter your choice from the list: "))
        if user_choice == 1:
            print("karibu kwenye huduma ya kutoa pesa")
            toa = {
                1: "Toa kwenda benk",
                2: "Toa kwa wakala"
            }
            for x,y in toa.items():
                print(x,y)
            print("Umetapokea ujumbe hivi punde")
        elif user_choice == 2:
            print("karibu kwenye huduma ya kutuma pesa")
            tuma = {
                1: "Tuma kwenda bank",
                2: "Tuma kwenda mitandao mingine"
            }
            for h,k in tuma.items():
                print(h,k)
            print("Utapokea ujumbe hivi punde")
        elif user_choice == 3:
            print("karibu kwenye huduma ya kulipa bill")
            lipa = {
                1: "lipa kwa simu",
                2: "lipa kwenda serikarini"
            }
            for a,b in lipa.items():
                print(a,b)
            print("Asante kwa kufanya malipo")
        elif user_choice == 4:
            print("Huduma ipo kwenye matengenezo")
        elif user_choice == 5:
            print("Asnte kwa kutumia huduma zetu, karibu tena baadae")
            break
        elif user_choice == 9:
            print("menu kuu")
            for i,j in menu.items():
                print(i,j)
        else:
            print("namba ulio ingiza sio sahihi, tafadhali angalia chaguo lako!")