"""
Offline Chatbot using GPT4All
Simplest approach - no server needed, completely offline

Installation:
  pip install gpt4all

Models available:
  - "Mistral"
  - "Orca Mini"
  - "Nous Hermes 2"
  - "Neural Chat"
  (First run downloads the model automatically)
"""

from gpt4all import GPT4All
import sys

def main():
    # Model options: "Mistral", "Orca Mini", "Neural Chat", "Nous Hermes 2"
    MODEL_NAME = "Mistral"
    
    print("Loading model... (downloads on first run)")
    print("-" * 50)
    
    try:
        # Load the model (auto-downloads if not present)
        model = GPT4All(MODEL_NAME)
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        sys.exit(1)
    
    print(f"✅ Model loaded: {MODEL_NAME}")
    print("=" * 50)
    print("Offline Chatbot - Type 'exit' to quit")
    print("=" * 50 + "\n")
    
    while True:
        try:
            user_input = input("You: ").strip()
            
            if not user_input:
                continue
            
            if user_input.lower() == "exit":
                print("Goodbye!")
                break
            
            # Generate response
            print("Chatbot: ", end="", flush=True)
            response = model.generate(user_input, max_tokens=256)
            print(response)
            print()
        
        except KeyboardInterrupt:
            print("\n\nGoodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}\n")

if __name__ == "__main__":
    main()