import speech_recognition as sr
import pyttsx3
import pyautogui
import webbrowser
import datetime
import wikipedia

# Text-to-speech engine
engine = pyttsx3.init()
engine.setProperty('rate', 170)

def speak(text):
    engine.say(text)
    engine.runAndWait()

# Voice recognition
def take_command():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening...")
        r.pause_threshold = 1
        audio = r.listen(source)

    try:
        print("Recognizing...")
        query = r.recognize_google(audio)
        print(f"You said: {query}")
    except:
        speak("I did not understand that.")
        return ""

    return query.lower()

# Core brain
def run_jarvis():
    speak("System online. How can I assist?")
    
    while True:
        command = take_command()

        if "open youtube" in command:
            speak("Opening YouTube")
            webbrowser.open("https://youtube.com")

        elif "time" in command:
            time = datetime.datetime.now().strftime("%H:%M")
            speak(f"The time is {time}")

        elif "search wikipedia" in command:
            speak("Searching Wikipedia")
            query = command.replace("search wikipedia", "")
            result = wikipedia.summary(query, sentences=2)
            speak(result)

        elif "type" in command:
            speak("Typing now")
            text = command.replace("type", "")
            pyautogui.write(text)

        elif "exit" in command:
            speak("Shutting down")
            break

        else:
            speak("Command not recognized")

run_jarvis()