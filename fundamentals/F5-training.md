# F5. How models are trained
Goal: where capabilities, habits and flaws come from.

## F5.1 Data: what models learn from
**Level:** 1  **Prerequisites:** none
**Concept:** A model reflects its training data: its coverage, quality, gaps and biases.

**Read.** Sources of text, code and images; cleaning and filtering; duplicates; the training cutoff; licensing and consent questions. What isn't in the data, the model can't reliably know.

**Why it matters in practice.** Explains cutoffs and knowledge gaps (1.2), bias (7.4) and copyright questions (7.4).

**Puzzle.** Given a described dataset, predict three things a model trained on it will do well and three it will do badly. Grader: rubric.

## F5.2 Pretraining: predicting the next token
**Level:** 2  **Prerequisites:** F1.5, F4.5
**Concept:** Pretraining teaches broad language ability by predicting the next token across huge text collections.

**Read.** Show the model text with the next token hidden, compute the loss, update by gradient descent, repeat at huge scale. Abilities like grammar, facts and some reasoning emerge from this single objective.

**Why it matters in practice.** The foundation of everything in 1.3.

**Puzzle.** Train a tiny next-word model on a small text and compare its output at three training stages. Grader: checks loss decreased and output improved.

## F5.3 Fine-tuning and instruction tuning
**Level:** 2  **Prerequisites:** F5.2
**Concept:** Further training on chosen examples shapes behavior and format.

**Read.** Starting from a pretrained model, train on examples of good question-and-answer pairs so it follows instructions. Smaller adaptations can specialize a model cheaply.

**Why it matters in practice.** Why a chat assistant differs from a raw model, and when customizing a model is better than prompting (2.1, 8.6).

**Puzzle.** Given a task, decide whether prompting, retrieval or fine-tuning fits best and justify with cost and risk. Grader: key with reasons.

## F5.4 Learning from feedback
**Level:** 3  **Prerequisites:** F5.3
**Concept:** Models are further trained from human or automated preferences, which can improve helpfulness and also cause side effects.

**Read.** People or systems rank outputs; the model is trained to produce better-ranked ones. The target is a proxy for what we want, so a model can learn to exploit the proxy (reward hacking), flatter users, or hide failures.

**Why it matters in practice.** Underlies the need for several independent checks and honest evaluation (5.5, 7.3).

**Puzzle.** Given a reward rule for a toy task, find the loophole an agent would exploit and rewrite the rule to close it. Grader: simulator.

## F5.5 Scaling and its limits
**Level:** 3  **Prerequisites:** F5.2
**Concept:** Performance improves with more data, parameters and compute, with diminishing and uneven returns.

**Read.** Scaling laws describe smooth gains. Limits include data supply, energy, cost and tasks where more scale does not fix the problem. Better algorithms and data quality also matter.

**Why it matters in practice.** Context for the speed of change that makes this course need updating (8.7).

**Puzzle.** Given a table of model size versus score, fit a trend and say what it does and doesn't tell you about a model ten times bigger. Grader: numeric plus rubric.

## F5.6 Evaluating models
**Level:** 3  **Prerequisites:** F5.5, 5.5
**Concept:** Benchmarks are useful and gameable; your own tests are the real measure.

**Read.** Benchmarks, contamination (test answers in training data), saturation, human preference ratings, and why a model that tops a leaderboard can still fail on your task.

**Why it matters in practice.** Lets you judge announcements (8.7) and design evals (5.5).

**Puzzle.** Given three benchmark claims, find the weakness in each and propose a better test. Grader: rubric.
