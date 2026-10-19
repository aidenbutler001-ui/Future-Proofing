# F4. Model architecture
Goal: understand the transformer well enough to explain why LLMs behave as they do.

## F4.1 Neurons and layers
**Level:** 2  **Prerequisites:** F1.2
**Concept:** A neural network is layers of simple units whose connections are learned.

**Read.** A unit adds up its weighted inputs and applies a simple bend (activation). Layers of units, stacked, can approximate complicated relationships. The learned numbers are the parameters (weights).

**Why it matters in practice.** 'Billions of parameters' means billions of these learned numbers (1.3).

**Puzzle.** Hand-set the weights of a tiny network to compute XOR. Grader: tests all four inputs.

## F4.2 Backpropagation
**Level:** 3  **Prerequisites:** F1.4, F4.1
**Concept:** Backpropagation computes how to change every weight to reduce the loss.

**Read.** Run an input forward to get a prediction and loss, then pass slopes backward through the layers using the chain rule. Each weight gets a nudge proportional to its effect on the error.

**Why it matters in practice.** The method that makes training feasible (F5.2).

**Puzzle.** Compute the gradients of a two-layer network on one example by hand; check against a numeric estimate. Grader: tolerance check.

## F4.3 Tokenization and embeddings
**Level:** 2  **Prerequisites:** F1.1
**Concept:** Text becomes tokens; tokens become vectors the model can process.

**Read.** A tokenizer splits text into pieces from a fixed vocabulary, which is why odd words, code and other languages use more tokens. Each token maps to an embedding vector that the model refines as it reads.

**Why it matters in practice.** Explains token limits and costs (1.5), why models struggle with letter counting, and how retrieval embeddings differ (3.3).

**Puzzle.** Tokenize a set of sentences with a toy tokenizer, then predict which would use the most tokens in a real one, and why. Grader: key plus explanation rubric.

## F4.4 Attention
**Level:** 3  **Prerequisites:** F1.1, F1.2, F4.3
**Concept:** Attention lets each token weigh which other tokens matter for its meaning.

**Read.** Each token produces a query, a key and a value. Comparing a query to all keys gives weights; the output is a weighted mix of values. This lets 'it' in a sentence draw on the noun it refers to. Many heads do this in parallel, looking for different patterns.

**Why it matters in practice.** Why context matters so much (1.5), why long inputs cost more (F2.2), and why position in the input can affect results.

**Puzzle.** Implement a single attention head on a 4-token example in a few lines and read off the weights. Grader: numeric match.

## F4.5 The transformer block
**Level:** 3  **Prerequisites:** F4.1, F4.4
**Concept:** A transformer repeats attention and a feed-forward step, with shortcuts that keep training stable.

**Read.** A block = attention + a feed-forward network, with residual connections and normalization. Stack dozens of blocks. The last layer produces a distribution over the next token.

**Why it matters in practice.** The overall structure behind the next-token loop (1.3).

**Puzzle.** Given a diagram with missing parts, place attention, feed-forward and residual connections, and trace how one token's vector changes. Grader: key with explanations.

## F4.6 Other architectures and what changes
**Level:** 3  **Prerequisites:** F4.5
**Concept:** Variants change cost, memory or modality, not the basic idea of learning from data.

**Read.** Mixture-of-experts uses only part of the model per token. Alternatives to attention aim to handle long inputs more cheaply. Diffusion models build images by gradually removing noise. Multimodal models combine encoders for different inputs.

**Why it matters in practice.** Helps you read about new models (8.7) without being misled by names.

**Puzzle.** Match 6 architecture descriptions to the problem each tries to solve. Grader: key.
