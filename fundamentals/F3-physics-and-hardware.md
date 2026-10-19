# F3. Physics and hardware
Goal: the physical limits (energy, heat, memory movement) behind the economics of AI.

## F3.1 Energy, power and compute
**Level:** 1  **Prerequisites:** none
**Concept:** Computation uses energy; energy and chip supply limit how much AI can run.

**Read.** Energy versus power, kilowatt-hours, and what a floating-point operation (FLOP) is. Estimate the energy of a task from operations and efficiency. Training a large model uses a huge number of operations; each answer uses a smaller amount.

**Why it matters in practice.** Links to cost (6.5), to why prices differ by model size (8.6), and to debates about AI's environmental footprint.

**Puzzle.** Estimate the energy and cost for a given number of requests using supplied efficiency figures. Grader: numeric tolerance, with sensitivity discussion.

## F3.2 Memory and bandwidth: the real bottleneck
**Level:** 2  **Prerequisites:** F3.1, F2.2
**Concept:** Moving data often costs more time than computing on it.

**Read.** Memory hierarchy: registers, cache, fast memory, main memory, disk. Bandwidth is how fast data moves. Generating each token requires reading the model's weights, so speed is often limited by memory bandwidth, not arithmetic.

**Why it matters in practice.** Explains why smaller or quantized models answer faster and why serving cost depends on memory (F6.2, F6.3).

**Puzzle.** Given a model size and a chip's memory bandwidth, compute the maximum tokens per second and the memory needed. Grader: numeric.

## F3.3 Chips: CPUs, GPUs and accelerators
**Level:** 2  **Prerequisites:** F2.4, F3.2
**Concept:** Different chips trade flexibility for efficiency on specific math.

**Read.** CPUs, GPUs, and custom AI accelerators, and the tradeoffs among speed, power, memory and cost. Why specialization helps: matrix multiplication dominates.

**Why it matters in practice.** Helps you read news about hardware, and understand supply and cost pressures on AI (8.6).

**Puzzle.** Match 6 workloads to the best-suited chip type with reasons. Grader: key with accepted alternatives.

## F3.4 Data centers: power, heat and scale
**Level:** 1  **Prerequisites:** F3.1
**Concept:** Running AI at scale is a power and cooling problem.

**Read.** Racks, power delivery, cooling, networking, and utilization. Why location and electricity supply matter. How efficiency gains can be offset by growth in use.

**Why it matters in practice.** Context for infrastructure news, costs (6.5) and sustainability questions in policy (7.5).

**Puzzle.** Estimate the power needed for a given fleet of chips, including cooling overhead, and judge whether a site's supply is enough. Grader: numeric.
