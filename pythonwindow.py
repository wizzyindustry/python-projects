import tkinter as tk

root = tk.Tk()
root.title("My Window")
root.geometry("400x300")  # width x height

label = tk.Label(root, text="Hello, World!", font=("Arial", 20))
label.pack(pady=50)

button = tk.Button(root, text="Click Me", command=lambda: print("Clicked!"))
button.pack()

root.mainloop()