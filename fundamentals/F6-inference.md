# F6. Running models (inference)
Goal: what happens between your prompt and the reply, and what it costs.

## F6.1 Sampling and temperature
**Level:** 2  **Prerequisites:** F1.3, 1.3
**Concept:** Sampling methods control how the model picks from the distribution.

**Read.** Greedy choice, temperature, top-k and top-p. Lower temperature concentrates probability on top choices; higher spreads it. Randomness explains varying answers.

**Why it matters in practice.** Hands-on companion to lesson 1.3.

**Puzzle.** Given a distribution, compute the probabilities after temperature changes and top-p filtering; predict output variety. Grader: numeric.

## F6.2 The KV cache and long conversations
**Level:** 3  **Prerequisites:** F4.4, F3.2
**Concept:** Storing earlier attention results speeds up generation but uses memory that grows with context.

**Read.** While generating token by token, the model reuses saved keys and values for earlier tokens instead of recomputing them. Memory use grows with context length and with the number of users served at once.

**Why it matters in practice.** Why long contexts are slow and costly (1.5), and why caching of prompt prefixes saves money (6.5).

**Puzzle.** Compute the cache memory for given model dimensions and context length, and how many concurrent users fit on a chip. Grader: numeric.

## F6.3 Quantization
**Level:** 2  **Prerequisites:** F2.3
**Concept:** Storing weights with fewer bits cuts memory and speeds inference at some quality cost.

**Read.** Common choices are 16, 8 and 4 bits. Lower precision shrinks the model and raises speed, and quality can drop, especially on harder tasks. Testing on your own tasks reveals whether the loss matters.

**Why it matters in practice.** Why local models are practical (8.6).

**Puzzle.** Pick the smallest precision for a model that meets a memory limit and a quality floor from a table of results. Grader: key.

## F6.4 Serving: batching, latency and cost
**Level:** 3  **Prerequisites:** F3.2, F6.2
**Concept:** Providers serve many users together to use chips efficiently, trading speed for cost.

**Read.** Batching groups requests. Latency (delay) and throughput (total work) pull in different directions. Cost per token reflects hardware, utilization, and model size; discounted batch pricing exists because delay is acceptable.

**Why it matters in practice.** Explains pricing structures and the levers in 6.5 and 8.6.

**Puzzle.** Given a traffic pattern and hardware cost, choose a batch size and compute cost per 1,000 requests and the typical delay. Grader: numeric.

## F6.5 Thinking at inference time
**Level:** 3  **Prerequisites:** F6.1, F6.2
**Concept:** Reasoning models spend extra tokens at answer time, trading cost and delay for accuracy.

**Read.** Extra generation (thinking) lets the model explore and check. Methods include producing many candidate answers and picking among them. The cost grows with the amount of thinking, and returns diminish.

**Why it matters in practice.** The mechanism behind lesson 8.1.

**Puzzle.** Given a success-rate curve versus thinking tokens, find the cheapest level that meets a target. Grader: numeric.
