from guizero import App, Text, TextBox, PushButton

def push_line():
    msg2.value = "become leagend"


app = App(title="LEAGUE HUB")
welcome_msg = Text(app, text="Welcome to league hub", size=30, color="Black", font="times new roman")
msg = Text(app, text="text box")
tt = TextBox(app)
msg2 = Text(
    app,
    text="What do you want to be"
)
update_text = PushButton(
    app,
    command=push_line,
    text="Answer"
)
app.display()