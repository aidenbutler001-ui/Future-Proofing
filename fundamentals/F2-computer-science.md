# F2. Computer science for AI
Goal: the computing ideas that explain cost, speed and limits.

## F2.1 Data structures and algorithms enough for AI work
**Level:** 1  **Prerequisites:** none
**Concept:** Choosing how data is stored and searched decides speed.

**Read.** Arrays, dictionaries, queues and trees; searching and sorting; what a program does when it loops over data. Big picture: the same task can take milliseconds or hours depending on the approach.

**Why it matters in practice.** Retrieval (3.3), pipelines (6.2) and agent harnesses (5.1) are ordinary programs built from these pieces.

**Puzzle.** Speed up a slow search over 100,000 records by changing the structure. Grader: runs both versions against a timer.

## F2.2 Complexity: why long inputs get expensive
**Level:** 2  **Prerequisites:** F2.1
**Concept:** Cost grows with input size in different ways; attention grows with the square of the context length.

**Read.** Big-O describes growth: linear, quadratic and so on. In standard attention, each token looks at every other token, so doubling the input roughly quadruples that part of the work. Engineering tricks reduce this, but long contexts still cost more in time and memory.

**Why it matters in practice.** Explains the cost and speed limits behind context windows (1.5) and why trimming context helps (6.5).

**Puzzle.** Estimate the relative cost of 1K, 10K and 100K token inputs under linear and quadratic models and say which parts of a system grow which way. Grader: numeric check plus a short explanation rubric.

## F2.3 Numbers inside computers
**Level:** 2  **Prerequisites:** F2.1
**Concept:** Computers store numbers with limited precision, and models trade precision for speed and size.

**Read.** Binary, integers, floating point. Rounding errors accumulate. Using fewer bits per number (16, 8, 4) uses less memory and runs faster, at some cost in accuracy.

**Why it matters in practice.** This is the basis of quantization (F6.3) and why a large model can run on small hardware (8.6).

**Puzzle.** Compute a sum in different precisions and observe the error; choose the smallest precision that keeps the error under a limit. Grader: numeric.

## F2.4 Parallelism and GPUs
**Level:** 2  **Prerequisites:** F1.2, F2.1
**Concept:** Many simple calculations done at once make AI practical.

**Read.** A CPU does a few complex tasks quickly; a GPU does thousands of simple ones at once. Matrix multiplication splits naturally into independent pieces. Big models are split across many chips, which adds communication cost.

**Why it matters in practice.** Explains why GPUs dominate AI and why training and serving need large clusters (F3, F5).

**Puzzle.** Given a workload, decide which parts can run in parallel and compute the speed-up, including a communication cost. Grader: numeric and rubric.
