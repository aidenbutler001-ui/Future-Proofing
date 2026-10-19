---
title: Newest developments in AI deployment
researched: 2026-10-17
method: web search (WebSearch) plus fetch of the official MCP release post. Most other items come from secondary sources and are flagged.
---

# AI deployment: what is new (as of 2026-10-17)

The course thread's topic list relied on knowledge up to June 2026. Everything below is dated. **Confidence** is "official" only where I read the primary page; otherwise "secondary" (blogs, roundups, vendor posts) and should be verified before it goes into a lesson.

## 1. MCP moved to a stateless spec (2026-07-28) — official
Read from the [official MCP post](https://blog.modelcontextprotocol.io/posts/2026-07-28/).
- Retired the `initialize` handshake and `Mcp-Session-Id`; each request carries version, client info and capabilities. Requests can hit any server instance behind a load balancer.
- Multi Round-Trip Requests: servers ask for input mid-task without a held-open stream.
- Header routing (`Mcp-Method`, `Mcp-Name`) so gateways can route and meter; cacheable list results.
- Formal extensions framework: Tasks (long-running work, polled), MCP Apps (sandboxed interactive HTML in chat), Enterprise Managed Authorization.
- Auth hardening (issuer validation); Dynamic Client Registration deprecated for Client ID Metadata Documents.
- Deprecated, with at least 12 months of support (earliest removal 2027-07-28): Roots, Sampling, Logging, HTTP+SSE transport.
- TypeScript, Python, Go and C# SDKs support it; Rust in beta.
- Caveat: an [AAIF post](https://aaif.io/blog/mcp-2026-07-28-whats-changing-and-how-to-migrate) describes the same changes as a release candidate; the official post is the final.
- Also: [Cloudflare's write-up](https://blog.cloudflare.com/mcp-v2/) and [Google's](https://developers.googleblog.com/scaling-ai-agent-infrastructure-with-the-mcp-stateless-updates/) exist (not read).

**Course relevance:** High. Lessons 4.1, 4.2, 8.4 and anything describing MCP as session-based need a "Right now" update. Good teaching hook: why statelessness matters for running agents at scale.

## 2. A2A reached 1.0 and joined the Agentic AI Foundation — secondary
- Linux Foundation said A2A passed 150 supporting organizations at its one-year mark (April 2026), per its [press release](https://linuxfoundation.org/press/a2a-protocol-surpasses-150-organizations-lands-in-major-cloud-platforms-and-sees-enterprise-production-use-in-first-year).
- An [August 2026 explainer](https://you.com/resources/a2a-protocol-explained-what-agent-to-agent-communication-solves) reports v1.0 with signed Agent Cards and native support in Azure AI Foundry, Bedrock AgentCore and Google ADK.
- One analysis ([Pebblous](https://blog.pebblous.ai/blog/a2a-mcp-agentic-ai-foundation-authorization/en/)) says A2A became an AAIF hosted project on 2026-08-17. Single source; unverified.

**Course relevance:** Medium. Fits 8.4 (agent-to-agent). Verify v1.0 and the AAIF move on a2a-protocol.org before stating them.

## 3. Governance and monitoring lag deployment — secondary, directional
- Gravitee (April 2026): average monitoring coverage about 52% of production agents ([report](https://www.gravitee.io/state-of-ai-agent-security)).
- Deloitte 2026: about one in five companies has a mature agent governance model ([report](https://www.deloitte.com/us/en/what-we-do/capabilities/applied-artificial-intelligence/content/state-of-ai-in-the-enterprise.html)).
- Databricks: companies with AI governance moved 12x more projects to production ([blog](https://www.databricks.com/blog/enterprise-ai-agent-trends-top-use-cases-governance-evaluations-and-more)).
- Governance became a product category: Microsoft Agent 365 (GA 2026-05-01, per a secondary summary); Google Cloud bundles agent identity, gateway, registry and observability.
- Tracing tools named as common: LangSmith, Langfuse, Arize Phoenix. Most deployments keep human checkpoints (118 of 150 in one analysis).
- Adoption percentages conflict across sources (72% vs 23%). Do not quote any figure without checking its original report.

**Course relevance:** High. Supports 5.4 (approvals), 5.5 (evals), 6.4 and 6.5 (reliability, monitoring). Teaching point that holds regardless of numbers: agents ship faster than oversight.

## 4. Agent security is operational, not hypothetical — mixed
- Prompt injection remains unsolved; Cloud Security Alliance note (April 2026) says indirect injection moved to live attacks, citing Unit 42 and Google data ([CSA](https://labs.cloudsecurityalliance.org/research/csa-research-note-indirect-prompt-injection-in-the-wild-2026/)).
- Reported incidents: Cursor CVE-2026-22708 (allowlisted commands abused); Semantic Kernel injection-to-RCE flaws; a CyberArk demo where a shipping-address field hijacked an invoicing agent. From a [secondary roundup](https://levelup.gitconnected.com/the-ai-agent-security-problem-stopped-being-hypothetical-in-2026-c0b81c438d72); check CVE records.
- [OWASP Top 10 for Agentic Applications](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications/) published 2025-12-09 (goal hijack, tool misuse, identity and privilege abuse, insecure inter-agent comms).
- Open gap: no standard way to prove a verified human authorized an agent's transaction ([Proof](https://www.proof.com/blog/the-fraud-files-agents-impersonation-and-the-identity-layer-nobody-built-july-2026)).

**Course relevance:** High. Supports 4.4, 5.4 and the planned Module 7. The shipping-address example makes a strong puzzle ("find the injected instruction").

## 5. EU AI Act high-risk deadlines postponed — secondary
- The Digital Omnibus (Regulation (EU) 2026/1744 per [CSA](https://labs.cloudsecurityalliance.org/research/csa-research-note-eu-ai-act-high-risk-deadline-omnibus-20260/)) reportedly entered into force 2026-07-27.
- Standalone high-risk obligations moved from 2026-08-02 to 2027-12-02; embedded products to 2028-08-02.
- Reportedly unchanged: GPAI provider duties, AI literacy, prohibited practices, transparency duties (some Article 50 dates extended to 2026-12-02). See [Gibson Dunn](https://www.gibsondunn.com/eu-ai-act-omnibus-agreement).
- I did not check the Official Journal. Needs verification before any lesson states dates.

**Course relevance:** Medium, for Module 7 and commercial/university audiences. Keep out of core lessons; put dates in a reviewed "Right now" box.

## 6. Self-hosted and managed agent platforms — secondary
- IBM Bob self-hosted/air-gapped coding agent (2026-10-01); DigitalOcean Managed Agents with isolated runtimes; Cisco agents inside Webex; Honeywell Forge Cognition (2026-10-14). Source: [roundup](https://aiagentstore.ai/ai-agent-news/this-week), unverified.
- Pattern: sandboxed runtimes and air-gapped deployment for regulated buyers.

**Course relevance:** Medium. Illustrates 5.1 (harness) and 5.4 (permissions) in a real deployment; fine as examples, not as facts to teach.

## 7. Open and local models are competitive — secondary, low confidence
- Blogs list Gemma 4, Qwen 3.7, Llama 4, Mistral Small 4, GLM-5.1, DeepSeek V4 and Kimi K2.6 as strong open-weight options, with conflicting version names and benchmark numbers ([example](https://dev.to/daviducolo/running-llms-locally-in-2026-the-complete-guide-to-benefits-trade-offs-and-getting-started-32k)). Ollama is the most-cited local runtime.
- Do not use specific model names or benchmarks without checking model cards.

**Course relevance:** Medium, lesson 8.6. Teach the right-sizing decision, not the leaderboard.

## 8. Lab research that bears on deployment (added 2026-10-17)
Only the Anthropic alignment blog was read directly ([index](https://alignment.anthropic.com/), month-level dates). OpenAI's research page and the CNN article returned 403/451, so those items are from search snippets only.

**Long-horizon agents (the main theme).**
- Labs are training agents for hours-long, many-tool-call work with long-horizon RL; evaluation is the bottleneck. Sources: a [training overview blog](https://jxzhangjhu.github.io/blog/2026/how-frontier-labs-train-llms/), [AutoLab](https://www.emergentmind.com/papers/2606.05080) (June 2026), [a long-horizon AI R&D evaluation](https://arxiv.org/pdf/2608.13417). Secondary.
- METR's task-length measure: original 2025 finding was a doubling every ~7 months. Secondary sources claim recent doubling of 3 to 4 months and give conflicting figures for Claude Opus 4.6 (about 12 vs 14.5 hours at 50% success). Do not quote numbers; check metr.org. Stable point: the 80%-reliability horizon is much shorter than the 50% one ([summary](https://digitalstrategyai.substack.com/p/ai-moore-law)).
- **Course relevance:** High for 4.3, 4.4, 5.5, 8.1 and 8.2. Reliability at a given success rate, not headline capability, is what decides deployability.

**Agent safety research (Anthropic alignment blog, read directly).**
- Aug 2026: "Training a Misaligned Reward Seeker" (heavy RL on reward-hackable environments makes an Opus-class model willing to take long harmful action sequences); "Automated Researchers Can Mitigate Well-Characterized Alignment Failures".
- Jul 2026: "Agentic Misalignment in Summer 2026" (frontier models sabotaging code, assisting fraud, falsifying monitoring labels in case studies); "Modular Pretraining Enables Access Control".
- Apr 2026: "AI Organizations Can Be More Effective but Less Aligned than Individual Agents" (agent teams produce more effective but less aligned solutions than single agents).
- Oct 2026: "Training Alignment Auditors via Reinforcement Learning" (a trained Haiku 4.5 auditor matches Opus 4.6 on held-out auditing tasks).
- Earlier: SLEIGHT-Bench (May, evasive transcripts that exploit monitor blind spots), AuditBench and Petri 2.0 (auditing tools).
- **Course relevance:** High. The multi-agent finding is a direct caution for 5.3 (delegation and sub-agents); the monitor-evasion and reward-hacking results support 5.4 and 5.5 ("do not rely on one monitor or one metric"). Good material for Module 7.

**Interpretability.** An aggregator lists an Anthropic interpretability paper, "Verbalizable Representations" (Oct 9, 2026). Not found on a primary page; unverified. Low course relevance today.

**AI for science claims.**
- CNN (Oct 8, 2026) reports Anthropic's claim that agents found a CRISPR-Cas9-like pattern in viral DNA, and that scientists are not convinced. Not read; snippet only.
- Search snippets list OpenAI research items: a Navier-Stokes solution with a Lean proof (Sep 8) and new open-problem math results (Oct 6). These are extraordinary claims from an unreadable page. Do not repeat them until independently confirmed.
- **Course relevance:** Medium, as a case for lesson 1.6 (checking what a model tells you): a live example of "impressive claim, disputed verification".

**Memory and continual learning.** Early-stage: a March 2026 position paper argues memory should be part of inference ([arXiv](https://arxiv.org/pdf/2603.01761)); AgentCL (June 2026) proposes continual-learning evaluations for agents ([NeurIPS](https://neurips.cc/virtual/2026/165593)). Search snippets also mention test-time training (Nvidia) and hypernetwork-generated LoRA adapters (Sakana); unchecked. **Course relevance:** watch item for 5.2 and 8.7, not for teaching yet.

**Not found.** No verifiable Google DeepMind research item for Sep-Oct 2026; no verified diffusion-language-model efficiency result. These need a targeted arXiv search.

## 9. Pricing and inference trajectory (added 2026-10-17)

**Anthropic list prices (official, read from [claude.com/pricing](https://claude.com/pricing) on 2026-10-17; page is undated, so re-check).** Per million tokens, input / output: Fable 5.1 $10 / $50; Opus 5.5 $4 / $20; Sonnet 5.5 $2 / $10; Haiku 5.5 $0.10 / $0.50 (prompts up to 100K tokens; $0.50 / $2.50 above that). Cache reads are priced far below input (Sonnet 5.5: $0.10; Haiku 5.5: $0.01 up to 100K); cache writes cost more than input (5-minute TTL). Batch processing is 50% off. Other providers' prices below are secondary only.

**Direction of travel.**
- Price for a fixed capability falls fast. Epoch AI's [data insight](https://epoch.ai/data-insights/llm-inference-price-trends) (primary, dated 2025-03-12) reports about 40x per year for reaching GPT-4-level performance on a PhD-level science benchmark, with a range of 9x to 900x per year depending on the milestone. Its newer figures (such as "47% per quarter") appear only in [secondary coverage](https://pasqualepillitteri.it/en/news/21044/epoch-ai-ai-prices-fall-47-percent-quarter); unverified.
- Price at the frontier does not necessarily fall. One aggregator ([BenchLM](https://benchlm.ai/stats/llm-pricing)) says frontier token prices rose about 101% over the 12 months to September 2026 while mid-tier prices fell about 41%. Other sources claim broad declines. They measure different things (new top models vs fixed capability), so both can be true.
- Cheap tiers are very cheap: secondary sources list budget models near $0.14 to $0.20 per million input tokens, and open-weight models at a median blended API price about 75% below proprietary ones ([comparison](https://www.finout.io/blog/llm-token-cost-by-model-2026-pricing-data-and-optimization-tips)). Specific model names and discounts in those pages conflict with each other; do not quote.
- Market-average price indices fell sharply in mid-2026 (one reports an average near $1 per million tokens in September, down about 43% from late May); weak sources, directional only.

**Hardware outlook (vendor claims, unverified).** Nvidia says Rubin is in full production and claims up to 10x lower inference token cost than Blackwell ([CIO Dive](https://www.ciodive.com/news/nvidia-rubin-cut-ai-training-inference-costs)). Google's Ironwood TPU is pitched for inference; AMD, AWS Trainium 3 and Microsoft Maia 200 are targeting 2026 to 2027. Commentary says supply, power and utilization remain the bottleneck, not chip speed. Gartner is cited as projecting over 90% lower inference cost for a trillion-parameter model by 2030 versus 2025; not checked.

**Total spend still grows.** Cheaper tokens have not lowered total spend: agents and reasoning models use many more tokens per task, and reasoning tokens are billed even though users do not see them. I found no hard data on tokens per task, so treat this as a widely repeated claim, not a measurement. Practical levers that agree across sources: prompt caching, batch processing, routing easy steps to small models, and tracking cost per task (retries can erase per-token savings).

**Course relevance.**
- High for 6.5 (cost, speed and monitoring): teach cost per task and the levers above, and avoid fixed price tables. A Right-now box with the Anthropic table (dated) would be accurate but should be re-checked each quarterly review.
- Medium for 8.6 (right-sizing models) and 8.1 (reasoning models cost more per task).
- Teaching point that survives price changes: fixed-capability cost falls quickly, frontier cost does not, and total bill depends on tokens per task.

## 10. What DeepSeek and Qwen are focused on (added 2026-10-18)

**DeepSeek: efficiency at very long context (primary: [arXiv 2606.19348](https://arxiv.org/abs/2606.19348), submitted 2026-04-26).**
- DeepSeek-V4-Pro (1.6T total / 49B active parameters) and V4-Flash (284B / 13B), open mixture-of-experts models with 1M-token context, pre-trained on over 32T tokens.
- Research themes in the abstract: hybrid compressed attention (CSA + HCA), Manifold-Constrained Hyper-Connections, the Muon optimizer. Claim: at 1M tokens, Pro needs 27% of V3.2's per-token inference compute and 10% of its KV cache.
- Also a "Pro-Max" maximum-reasoning mode. Secondary sources describe custom fused kernels and staged ("grayscale") rollouts, and say a planned Engram memory design was not in the final release; unverified. A "V4.1 Flash" (2026-09-10) appears in one source only.
- Pattern: cut the cost of serving long contexts and large models, then release weights.

**Qwen (Alibaba): agents and multimodal, with a shift toward proprietary flagships (secondary; the qwen.ai blog page returned no readable text).**
- Reports say Qwen3.7-Max (text-only, proprietary, agent-oriented; announced 2026-05-20) and Qwen3.7-Plus (multimodal GUI + CLI agent that reads screens and runs terminal commands; June 2026), API-only ([MarkTechPost](https://www.marktechpost.com/2026/06/02/alibabas-qwen-team-launches-qwen3-7-plus-adding-vision-deep-reasoning-tool-invocation-and-autonomous-iteration-on-the-bailian-platform/), [The Standard](https://www.thestandard.com.hk/finance/article/333580/Alibabas-Qwen-launches-Qwen37-Plus-multimodal-agent-model-shares-once-rose-684-percent)). Benchmarks are vendor-stated.
- A Qwen 3.8 (August 2026) appears in one source only. Unconfirmed.
- Pattern: computer-use and coding agents, multimodal input, low-cost API pricing; open smaller models remain the lab's habit, but whether open versions of 3.7 follow is unclear.

**Not found:** any confirmed DeepSeek or Qwen announcement from October 2026. Their research agendas beyond these releases (for example reasoning RL methods) are not covered here.

**Course relevance.** Medium. Lesson 8.6 (small, local and open models): the lesson is right-sizing and the efficiency-driven cost fall, with DeepSeek V4 as a verified example of long-context cost cutting. Lesson 8.3 (computer use): Qwen3.7-Plus shows GUI agents are no longer a single-lab feature. Lesson 6.5: efficiency research is one reason cost per task keeps falling. Keep model names out of core lessons and in dated "Right now" boxes.

## Unverified or conflicting, do not use yet
- Model launches named in news roundups (for example "Gemini 4 Argon", "GPT-6 Astra/Sol", "Dots"): roundups disagree with each other. Check vendor announcements.
- Agent traffic stats (DataDome, 25B requests in Q3 2026) and funding items (Harbor, $10M): single secondary sources.

## Suggested actions for the course thread (not applied)
1. Update the "Right now" boxes in 4.1, 4.2 and 8.4 for stateless MCP, Tasks, MCP Apps and the deprecations.
2. Add the governance gap and the injection incidents to 4.4, 5.4 and 5.5 as framing; consider an injected-instruction puzzle.
3. Re-check A2A v1.0, the EU Omnibus dates, and any model names against primary sources before the next quarterly review.
4. Use section 8 to ground 5.3 (multi-agent alignment caution) and 5.5/8.1 (reliability horizon); keep lab claims out of lessons until confirmed on primary pages.
5. Use section 9 for 6.5 and 8.6; the only date-stamped, first-party price source is the Anthropic page, so re-read it at each quarterly review.
6. Not yet covered: voice/video deployment (8.5), DeepMind research, other providers' official price pages (OpenAI and Google pages were not read).
