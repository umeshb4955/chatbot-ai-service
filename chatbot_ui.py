from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import json

# Load knowledge base
with open("knowledge_base.json", "r") as f:
    knowledge_base = json.load(f)

# Load pre-trained model and tokenizer
model_name = "microsoft/DialoGPT-medium"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

def get_response(user_input):
    # Check if input matches knowledge base
    for key, value in knowledge_base["questions"].items():
        if key in user_input.lower():
            return value
    
    # Fallback to AI model
    inputs = tokenizer.encode(user_input + tokenizer.eos_token, return_tensors="pt")
    outputs = model.generate(inputs, max_length=100, pad_token_id=tokenizer.eos_token_id)
    response = tokenizer.decode(outputs[:, inputs.shape[-1]:][0], skip_special_tokens=True)
    return response