# Future Proofing: course design (draft 0.1)

A practical, hands-on course on using AI well. Supplements university study, and serves working professionals who need to keep up. Every lesson is read, then do: you apply what you read to a small puzzle using a real model, and an automated check tells you whether it worked.

## Principles
1. Practice over lecture. Each page is about 5 minutes of reading and 10 to 20 minutes of puzzle.
2. Durable ideas first, tools second. Lessons teach the concept (e.g. "constrain, then test"), and name current tools only in a clearly marked "Right now" box that can be swapped as the field moves.
3. Every puzzle is checkable. A puzzle has a goal, hidden test inputs, and a grader (rules, a script, or a model judge with a rubric). No "write something and hope".
4. Real use cases. Each module ends with a capstone drawn from work people do: triage an inbox, summarize a contract, build a research agent.
5. The course is versioned. Content has an owner, a last-reviewed date, and a freshness check (see "Keeping it current").
6. **Safety is the spine, not a module.** Operational security (opsec) comes first (Module 0), and an "Opsec check" appears in every lesson that involves data, tools or access. Default rules: when unsure, don't upload; confidential and restricted data never go to unapproved tools; agents (from Module 4) get the least access that works and run away from machines that hold confidential files; secrets never go in prompts; report mistakes at once.

## Tracks

### Core track: using AI well
**Start here (S). On-ramp**
- From search box to work partner (brief it, read it critically, ask for changes)
- Your first real win: one real task, five steps, with a safe-start rule until Module 0
- Your task audit: list recurring tasks, score them, pick the first three; revisited after Modules 2, 4 and 6 and ending in the flagship automation
- Puzzles: upgrade the question, fix the first answer, pick the first three

**Module 0. Safety first (everyone starts here)**
- Before you upload anything: classify data (public, internal, sensitive, restricted), ask four questions, strip it, hard rules
- Puzzle: classify and redact

**Module 1. How to think about models**
- The AI landscape: kinds of models (language, image, speech, video, classifiers, recommenders, embeddings). Focus on LLMs; image, video and audio come later as add-on components
- What an LLM is and isn't
- How an LLM works, the very basics: tokens, next-token prediction, temperature, training
- What LLMs can do and where they struggle
- Context window, tokens, cost, and memory
- Checking what a model tells you
- Puzzles: pick the right tool, predict the failure, be the next-token predictor, green/yellow/red sorting, fit facts in a token budget, catch the made-up source

**Module 2. Prompting**
- Clear instructions, examples, and format control
- System prompts and personas (prototype lesson)
- Constraints, refusals, and resisting prompt injection
- Prompts as tests: write the prompt, then write the inputs that break it
- Puzzles: role-play a character, extract clean JSON, make a model refuse correctly, fix a prompt that fails on edge cases

**Module 3. Working with context and documents**
- Giving a model your documents (grounding, quotes, "not stated")
- Long documents and limited space (split, summarize in stages)
- Search before you answer: retrieval (RAG) basics, chunks, embeddings
- Answers you can trace: citations, conflict handling, honest "I don't know"
- When retrieval goes wrong: diagnose by cause, stale sources, injection through documents
- Puzzles: stay inside the document, the 40-page report, tune the search, make it show its work, diagnose the bad answers

**Module 4. Tools and agents**
- Agents on a computer that holds confidential files (4.0): least privilege, separate environments, scoped folders, secrets out of reach, approvals on. Taught here, at the start of the agent section
- Tools: how a model acts on the world (schema, description, the model asks and the program runs)
- Kinds of tools and what they can touch (search, code, files, APIs, browsing; MCP; read vs. write; least privilege)
- The agent loop: plan, act, observe
- When agents go wrong: loops, budgets, injection through tool results
- Puzzles: write the tool description, pick the tools and set limits, run the loop, fix the looping agent

**Module 5. Harnesses and systems**
- What a harness is (context building, running tools, state, rules, stopping)
- Memory, state and files; delegation and sub-agents
- Permissions and human approval; sandboxes and logs
- Evals for whole systems; regressions
- Capstone: a small agent of your own
- Puzzles: label the parts, give the agent a memory, write the hand-off, set the rules, find the regression

**Module 6. Workflows and automation (the destination of the core track)**
- Workflows or agents: choosing the shape; start with the simplest thing that works
- Workflow patterns: chain, route, parallelize, check and revise, delegate
- Triggers, schedules and connecting apps; credentials and least access
- Making automations reliable: validation, retries, de-duplication, human review
- Cost, speed and monitoring
- Flagship capstone: automate a real piece of your own work

**Module 7. Judgement and safety**
- Privacy and your data
- Prompt injection and attacks on agents (data, untrusted input and a way out: remove one)
- Oversight, monitoring and accountability; do not rely on one check
- Fairness, copyright and honest use, including academic integrity
- Rules that apply to you (policy, contracts, law); write a one-page AI use policy
- Risk review of your own automation
- Safety also appears earlier, inside Modules 3 to 6, where each risk first shows up

**Module 8. Frontier (living module, reviewed quarterly)**
- Reasoning models, coding agents and AI-assisted building, computer use, connecting agents and tools (MCP and agent-to-agent protocols), voice/images/video, small and local models, and how to keep up
- Topics here are swapped in and out as the field moves; this is where the course changes most

### Optional track: how models work (fundamentals)
For students and the curious. Drafted in `fundamentals/` as six units with 28 lessons; each links back to the core lesson it deepens. It is optional: the core track never requires it.
1. F1 Math: vectors, matrices, probability, calculus, loss and gradient descent
2. F2 Computer science: data structures, complexity, numbers in computers, parallelism and GPUs
3. F3 Physics and hardware: energy and compute, memory and bandwidth, chips, data centers
4. F4 Model architecture: neurons, backpropagation, tokenization and embeddings, attention, the transformer block, other architectures
5. F5 Training: data, pretraining, fine-tuning, learning from feedback, scaling, evaluating models
6. F6 Inference: sampling, the KV cache, quantization, serving, thinking at inference time
Puzzles here are small and runnable: implement a tiny attention head, predict what temperature does, compute a memory budget.

## The lesson loop
1. **Read**: a short page with one core idea and one worked example.
2. **Try**: a puzzle with a clear goal. Learner writes a system prompt, a tool description, or a small config.
3. **Run**: the page runs it against hidden test inputs using a real model.
4. **Check**: a grader says which tests passed, with feedback that names the idea, not just "wrong".
5. **Reflect**: a short note on what changed and why. Optional hint ladder (nudge, bigger hint, worked answer).
6. **Revisit**: spaced review brings back earlier puzzles in a new form.

### Grading puzzles
- Rule checks for things that are objectively checkable (valid JSON, length, forbidden strings).
- Behavioral tests: hidden user messages the prompt must handle (including adversarial ones).
- Model judge with a rubric for fuzzy qualities (tone, faithfulness), calibrated against example answers.
- Anti-gaming: hidden tests are rotated, and the learner sees failures but not the test list.

## Keeping it current
- Every lesson has frontmatter: `concept`, `right_now` (tool-specific part), `last_reviewed`, `owner`.
- A scheduled review job flags lessons whose `last_reviewed` is older than 90 days, and re-runs every puzzle against current models. A puzzle that stops being solvable or becomes trivial is flagged.
- A changelog page and "what changed this quarter" digest. A news-to-curriculum queue where new capabilities become candidate lessons.
- Content lives as plain files in a repository (Markdown plus a puzzle spec), so updates are reviewable pull requests.

## Platform options
| Option | Pros | Cons |
|---|---|---|
| Static site + serverless model calls | Cheap, simple, easy to update | Need API keys, rate limits and abuse protection |
| Open-source learning platform (Jupyter-style notebooks) | Great for code puzzles and the fundamentals track | Weaker for non-coders |
| Custom web app | Full control of the lesson loop | Most work to build |
| Prototype-first in Claude artifacts | Fastest way to test lessons | Not a long-term home |

Recommendation: content as files in a repository, rendered by a simple web app that runs puzzles through a thin model-calling API. Start with Module 2 only.

## Open questions for Aiden
1. Who is the first audience: you and classmates, or the public?
2. Free, or paid? This decides how much model usage cost we can absorb.
3. Do you want to write lessons yourself, or have me draft them for you to edit?
4. Should the first build be a website, or stay inside Claude for now?
