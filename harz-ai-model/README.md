# HARZ AI — Custom Fine-Tuned Model

A proprietary AI model for HARZ Digital Services, fine-tuned on Nigerian digital business context with English, Hausa, and Pidgin support.

## Model Details

| Property | Value |
|----------|-------|
| Base Model | SmolLM2-135M-Instruct (HuggingFace) |
| Method | LoRA (Low-Rank Adaptation) |
| Parameters | 134.5M total, 1.84M trainable (1.35%) |
| LoRA Rank | 16 |
| Target Modules | q_proj, v_proj, k_proj, o_proj |
| Training Data | 443 examples |
| Languages | English, Hausa, Nigerian Pidgin |

## Training History

| Version | Hardware | Epochs | Loss | Notes |
|---------|----------|--------|------|-------|
| v1 | CPU | 1 | 3.07 | Rank 8, 2 target modules |
| v2 | CPU | 1 | 2.71 | Rank 16, 4 target modules, chat template |
| v3 | T4 GPU | 3 | TBD | Continued from v2 adapter |

## Training Data Coverage

1. HARZ AI identity (who are you, what is HARZ)
2. Products (12 books, pricing, bundle deals)
3. Payment methods (UBA, Paystack, GDEG, USDT, Gumroad)
4. Store links (Gumroad, Getly, HarzDM, Harz Store)
5. Customer support FAQ
6. Marketing content (English, Hausa, Pidgin)
7. 10+ ecosystem platforms (HarzDM, Abuja Estate, HARZ Connect, etc.)
8. 7 AI agents (Magani, Hauwa, Rabi, Aisha, Nuruddeen, Omega, Danjuma)
9. Nigerian business advice
10. Health topics (malaria, diabetes, hypertension)
11. Technology (Python, JavaScript, Git, APIs)
12. Education (CV writing, interview prep, study tips)
13. Finance (budgeting, ROI, taxes)
14. Real estate inquiries
15. Hausa conversations (15+ examples)
16. Conversational patterns

## Files

```
harz-ai-model/
├── harz-ai-v1-adapter/     # v1 LoRA adapter (CPU trained)
├── harz-ai-v2-adapter/     # v2 LoRA adapter (CPU trained, chat template)
├── harz_training_data_v4.jsonl  # 443 training examples
├── harz_ai_colab_training.ipynb  # Colab notebook for T4 GPU
├── harz_finetune_quick.py  # CPU training script
├── harz_finetune_v2.py     # v2 training script (3 epochs)
├── harz_test_model.py      # Model testing script
├── logs/                   # Training logs
└── README.md               # This file
```

## Usage

### Load the model

```python
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel

# Load base model
tokenizer = AutoTokenizer.from_pretrained("HuggingFaceTB/SmolLM2-135M-Instruct")
model = AutoModelForCausalLM.from_pretrained("HuggingFaceTB/SmolLM2-135M-Instruct")

# Load LoRA adapter
model = PeftModel.from_pretrained(model, "rabiuhamza11/harz-ai-model/harz-ai-v2-adapter")

# Chat
prompt = "<|im_start|>system\nYou are HARZ AI...<|im_end|>\n<|im_start|>user\nWho are you?<|im_end|>\n<|im_start|>assistant\n"
inputs = tokenizer(prompt, return_tensors="pt")
output = model.generate(**inputs, max_new_tokens=100)
print(tokenizer.decode(output[0]))
```

### Continue training on Colab

1. Open `harz_ai_colab_training.ipynb` in Google Colab
2. Set runtime to T4 GPU
3. Run all cells
4. Model trains 3 epochs in ~10-15 minutes
5. Pushes result back to GitHub

## Repository

https://github.com/rabiuhamza11/harz-ai-model

## License

Proprietary — HARZ Digital Services (RC 321424)