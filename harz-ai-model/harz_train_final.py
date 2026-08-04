#!/usr/bin/env python3
"""HARZ AI — Final CPU training (3 epochs, rank 16, chat template)"""
import json, torch, os, sys
from transformers import AutoTokenizer, AutoModelForCausalLM, TrainingArguments, Trainer, DataCollatorForLanguageModeling
from peft import LoraConfig, get_peft_model, TaskType
from datasets import Dataset

print("=== HARZ AI FINAL TRAINING (3 epochs) ===", flush=True)

# Load data
with open("harz_training_data_v4.jsonl") as f:
    training_data = [json.loads(line) for line in f]
print(f"Loaded {len(training_data)} examples", flush=True)

HARZ_SYS = "You are HARZ AI, a helpful assistant for HARZ Digital Services, a Nigerian digital business ecosystem. Be warm, direct, and concise. Support English, Hausa, and Pidgin."

def format_chat(ex):
    return {"text": f"<|im_start|>system\n{HARZ_SYS}<|im_end|>\n<|im_start|>user\n{ex['instruction']}<|im_end|>\n<|im_start|>assistant\n{ex['response']}<|im_end|>"}

dataset = Dataset.from_list(training_data).map(format_chat)
print(f"Dataset: {len(dataset)} examples", flush=True)

# Load model
MODEL = "HuggingFaceTB/SmolLM2-135M-Instruct"
tok = AutoTokenizer.from_pretrained(MODEL)
if tok.pad_token is None: tok.pad_token = tok.eos_token
model = AutoModelForCausalLM.from_pretrained(MODEL, torch_dtype=torch.float32, device_map="cpu")
print(f"Model: {sum(p.numel() for p in model.parameters())/1e6:.1f}M params", flush=True)

# LoRA config — rank 16, 4 target modules
lora = LoraConfig(
    task_type=TaskType.CAUSAL_LM, r=16, lora_alpha=32, lora_dropout=0.05,
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"], bias="none"
)
model = get_peft_model(model, lora)
model.print_trainable_parameters()

# Tokenize
def tok_fn(examples):
    return tok(examples["text"], truncation=True, max_length=512, padding="max_length")

tok_ds = dataset.map(tok_fn, batched=True, remove_columns=["text"])
dc = DataCollatorForLanguageModeling(tokenizer=tok, mlm=False)

# Training — 3 epochs
args = TrainingArguments(
    output_dir="./harz-ai-v3-checkpoint",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=2,
    warmup_steps=10,
    logging_steps=10,
    save_steps=50,
    learning_rate=1e-4,
    fp16=False,
    report_to="none",
    save_total_limit=1,
    use_cpu=True,
)

trainer = Trainer(model=model, args=args, train_dataset=tok_ds, data_collator=dc)

print(f"\nStarting training (3 epochs, ~168 steps)...", flush=True)
print(f"Estimated time: ~90 minutes on CPU", flush=True)
trainer.train()
print("Training complete!", flush=True)

# Save
print("Saving model...", flush=True)
model.save_pretrained("./harz-ai-v3")
tok.save_pretrained("./harz-ai-v3")
print("Saved to ./harz-ai-v3!", flush=True)

# Test
print("\n=== TEST RESULTS ===", flush=True)
model.eval()

def chat(prompt, max_tokens=150):
    text = f"<|im_start|>system\n{HARZ_SYS}<|im_end|>\n<|im_start|>user\n{prompt}<|im_end|>\n<|im_start|>assistant\n"
    inputs = tok(text, return_tensors="pt")
    with torch.no_grad():
        out = model.generate(**inputs, max_new_tokens=max_tokens, temperature=0.7, do_sample=True,
                            top_p=0.9, repetition_penalty=1.2, pad_token_id=tok.pad_token_id)
    r = tok.decode(out[0], skip_special_tokens=True)
    if "assistant" in r:
        r = r.split("assistant")[-1].strip()
    return r[:300]

tests = [
    "Who are you?",
    "Sannu! Yaya ka ke?",
    "How much are the books?",
    "What payment methods do you accept?",
    "Wane ne kai?",
    "What is HARZ Digital Services?",
    "How do I buy a book?",
    "Me ne GDEG token?",
    "What platforms are in HARZ ecosystem?",
    "Tell me about your products",
]

for p in tests:
    print(f"\nQ: {p}", flush=True)
    print(f"A: {chat(p)}", flush=True)

print("\n=== HARZ AI v3 COMPLETE ===", flush=True)
