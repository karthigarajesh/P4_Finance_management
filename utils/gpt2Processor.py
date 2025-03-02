from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

# Load GPT-2 model
gpt2_model = pipeline("text-generation", model="gpt2")

@app.route("/api/gpt2", methods=["POST"])
def process_voice():
    data = request.json
    voice_text = data.get("voiceText", "")

    if not voice_text:
        return jsonify({"error": "No voice input provided"}), 400

    # Generate response using GPT-2
    generated_text = gpt2_model(voice_text, max_length=50)[0]["generated_text"]

    return jsonify({"message": generated_text})

if __name__ == "__main__":
    app.run(port=5001, debug=True)
