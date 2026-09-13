---
name: get-prd
description: Runs a deep structured interview and produces a PRD in a single pass. Use when starting a new application, system, or feature and no requirements document exists yet. Use when the user says "get prd", "bikin PRD", "mau bikin sistem baru", "grill me", or asks to be interviewed toward a spec. Combines design-tree interviewing, intent extraction, capability mapping, and PRD authoring.
---

# Get PRD

## Overview

`get-prd` turns a vague request into an approved PRD in one continuous pass. It merges three workflows that are usually run separately:

1. **Design-tree interviewing** — map every decision as a tree, work the tree frontier by frontier in rounds, and give a recommendation with each question. This is the mechanics that makes an interview converge instead of rambling.
2. **Intent extraction** — capture what the user actually wants, not what they think they should want, with an explicit confidence number at every step. This is the discipline that stops the agent from silently filling in gaps.
3. **Spec authoring** — write the requirements down in a structured artifact with boundaries, success criteria, and an approval gate. This is the deliverable that downstream planning consumes.

The reason to merge them is that splitting them loses context. When interviewing is one skill and spec writing is another, the second skill starts cold: it re-asks what the first skill already learned, or it silently assumes answers that were never given. A PRD written from a stale summary is worse than no PRD, because it looks authoritative.

Two consequences of merging, both intentional:

- **This skill is long.** It carries the full methodology of all three phases rather than deferring to other skills. Follow the steps in order; do not skip to the template.
- **This skill never delegates the interview.** Even if `interview-me` or `spec-driven-development` also exist in the pack, the interview mechanism lives here. Do not invoke another skill to do the questioning.

The output is a PRD saved to `docs/prd/<name>.md`, approved by the user, ready for `planning-and-task-breakdown`.

## When to Use

Use this skill when:

- The user is starting a new application, system, feature, or significant change **and** no requirements document exists yet
- The user says "get prd", "bikin PRD", "buat PRD", "mau bikin sistem baru", or "mau develop X"
- The user asks to be grilled, interviewed, or stress-tested toward a spec
- The request is conventional and underspecified ("build me a dashboard", "make it faster") and you cannot state what done means
- You are about to plan or build something that would take more than a day, and no written requirements exist

**When NOT to use:**

- Bug fixes, typo corrections, renames, and mechanical operations
- A PRD or spec already exists and the user wants to change a small part of it — amend the document directly
- Pure information requests ("how does this work?")
- The user explicitly wants to skip documentation and just start building — respect that, but surface the risk once
- Non-interactive contexts (CI pipelines, scheduled runs, autonomous loops). This skill requires a live, responsive user. If the ask is underspecified in a non-interactive context, flag it as a blocker instead of guessing.

## The Process

`get-prd` runs in eight phases. Each phase has an exit condition. Do not advance past a phase whose exit condition is unmet.

```
0. Scope gate       -> is this one capability or several?
1. Hypothesis seed  -> what do I think they want, and how sure am I?
2. Build the tree   -> what decisions exist, and which are on the frontier?
3. Round questions  -> ask the frontier, one round at a time
4. Intent probe     -> want vs. should-want
5. Restate          -> say it back, in their words
6. Gap check        -> what does the PRD need that the interview did not produce?
7. Write and gate   -> the PRD, then an explicit yes
```

---

### Phase 0: Scope Gate

Most requests describe one capability. If this one does, say so in one line and move to Phase 1. This phase exists for the exception.

**Detection.** Decompose before writing anything when a single request bundles several independently testable capabilities:

- The request names distinct capabilities with their own consumers or data (identity, billing, notifications, reporting)
- Acceptance criteria cluster into groups that could ship and be verified separately
- One capability could be cut or replaced without rewriting the others' requirements

**When detected, propose a capability map before any interview round.** Small and reviewable — a module table plus a build order, not a project plan:

```markdown
# Capability Map: [Initiative Name]

| Module id | Responsibility | Depends on |
|---|---|---|
| identity | Accounts, sessions, SSO | - |
| billing | Plans, invoices, payments | identity |
| notifications | Email and webhook fan-out | identity |
| reporting | Usage dashboards | billing, notifications |

Build order: identity -> billing, notifications -> reporting
```

Rules for the map:

- **Stable module ids.** Kebab-case, chosen once, never renamed. Downstream planning selects work by these ids.
- **Dependency direction, no cycles.** Arrows point one way. If two modules each need the other, they are one module.
- **Interfaces live at the boundary.** The map records that `billing` depends on `identity`; the contract between them belongs in the provider module's PRD.

**The map is gated.** Ask the user to approve module boundaries, dependency direction, and build order before you interview for any single module. Getting the map wrong is expensive; reviewing ten lines is not.

Then run Phases 1-7 **once per module, in build order**, each producing its own `docs/prd/<module-id>.md`. Do not write a monolithic PRD for a multi-module initiative.

**Exit condition:** either the request is single-capability (say so explicitly), or a capability map is approved.

---

### Phase 1: Hypothesis Seed

Before asking anything, write down your current read of the ask and an honest confidence number.

```
HYPOTHESIS: You want a way to answer "how are we doing?" in standup, and "dashboard" was the convention that came to mind.
CONFIDENCE: ~30% - missing: who it's for, what "metrics" means here, and what success looks like
```

Rules:

- One sentence for the hypothesis. If you cannot write it in one sentence, you do not have a read yet.
- The confidence number is a percentage from 0 to 100. It forces honesty: if you cannot predict the user's reaction to the next three questions you would ask, the number is wrong.
- Below ~70%, append a short reason on the same line naming what is still unresolved. This tells the user exactly what the interview needs to surface.
- Update the hypothesis and confidence after every round.

**Exit condition:** a hypothesis with a confidence number is on the record.

---

### Phase 2: Build the Design Tree

Map the decision space before asking anything. Every decision branches into the decisions that hang off it.

```
Goal: personal experiment tracker
    |
    +-- What counts as an experiment?        (define the unit)
    |       |
    |       +-- What fields describe one?    (scope the schema)
    |
    +-- Where does data come from?           (input source)
    |       |
    |       +-- Manual entry or import?      (interaction model)
    |
    +-- When is an experiment "done"?        (lifecycle)
            |
            +-- What signal ends it?         (success definition)
```

**The frontier** is every decision whose prerequisites are already settled: the questions you can ask *now* without guessing at answers you have not heard yet.

Two rules that make this work:

1. **Ask the whole frontier in one round.** Do not ask one question per turn when several are independent. Independent questions are answered faster together, and the user sees the shape of the decision space.
2. **A question whose answer depends on another open question belongs to a later round.** Asking it now locks in the wrong framing.

**Facts are your job, never the user's.** When a frontier question needs a fact from the environment (filesystem, existing code, a library's API, a config value), dispatch a sub-agent to find it. Do not ask the user for anything you could look up yourself. Do not block the round on it: the exploration is an unsettled prerequisite, so only the questions downstream of it wait. Ask the rest of the frontier now. Decisions are the user's; facts are yours.

**Exit condition:** the tree is mapped and the first frontier is identified.

---

### Phase 3: Round Questions

Ask the current frontier. Format each question exactly like this:

```
**Q1 - <question title>**: <question body, possibly multiple paragraphs, often with the candidate options laid out>

-> <your recommended answer, with the reasoning that produced it>
```

Rules:

- **Number every question.** `Q1`, `Q2`, ... Restart numbering per round.
- **Always attach a recommendation.** The user reacts faster to a wrong recommendation than they generate an answer from scratch. It also commits you to a hypothesis you can be visibly wrong about.
- **Wait for the answers** before asking the next round.
- **Recompute the frontier after each round.** Settled decisions push the frontier outward and unblock questions that depended on them.
- **Note corrections.** When the user overrides a recommendation, record both the decision and the reasoning, because the PRD's "Technical Decisions" section draws from it.

Why the recommendation matters, and its failure mode:

- The user can react to a wrong guess in seconds but may take minutes to produce an answer from nothing.
- It surfaces *your* assumptions, which is the point of the interview.
- **The risk is sycophancy** — a polite user agreeing with your guess to be agreeable. Mitigate by being visibly willing to be wrong, and occasionally recommend a direction you expect the user to push back on. If every recommendation is accepted on the first try, suspect sycophancy.

Why one round at a time, not everything at once:

- The third question often depends on the answer to the first; asking everything at once locks in the wrong framing.
- The user's energy for careful thinking is finite. Spend it round by round.
- A batch of fifteen questions reads as a survey, not an interview, and gets skimmed.

**Exit condition:** the round's questions are answered and the frontier is recomputed.

---

### Phase 4: Intent Probe (want vs. should-want)

The most dangerous answers are the ones where the user says what a thoughtful answer *sounds like* rather than what they actually want. Watch for:

- Answers that pattern-match best-practice talk ("I want it to be scalable", "clean architecture") without specifics
- Answers that defer to convention ("the way most apps do it", "the standard approach")
- Phrases like "I should probably...", "I think I'm supposed to...", "good engineering practice says..."
- Buzzwords as goals — when "modern", "scalable", or "robust" is the answer instead of a specific outcome

When you hear any of these, ask:

> *"If you didn't have to justify this to anyone, what would you actually want?"*

That single question often does more work than the previous five. Run it at least once whenever a sophistication-signaling answer appears. Record both the stated answer and the probed answer — the PRD should reflect the second.

**Exit condition:** at least one probe ran if any sophistication-signaling answer appeared, and the real answer is on the record.

---

### Phase 5: Restate Intent

When the tree is nearly settled, write back what you now think the user wants. Keep it tight, use their language, and structure it so they can confirm or correct line by line.

```
Here's what I now think you want:

- Outcome:      <one line>
- User:         <one line - who benefits>
- Why now:      <one line - what changed>
- Success:      <one line - how we know it worked>
- Constraint:   <one line - the binding limit>
- Out of scope: <one line - what we are explicitly not doing>

Yes / no / refine?
```

Rules:

- **"Out of scope" is non-negotiable.** Half of misalignment is silent disagreement about what is *not* being built.
- Five to eight lines total. If it runs longer, the interview is not done.
- Use the user's words where possible; their vocabulary is the shared contract.

**Exit condition:** a concrete restate in the user's words is on the record.

---

### The Stop Condition

You are done interviewing when **both** of these are true:

1. **Can you predict the user's reaction to the next three questions you would ask?** If yes, you have shared understanding.
2. **Is the frontier empty?** Every branch of the tree visited, nothing silently assumed.

If either is false, ask the next round.

There is a floor. If you have run several rounds and the frontier is not shrinking, that is information about the ask, not a reason to keep grinding. Stop and tell the user: *"I've asked N rounds and the decision space is not converging. Something foundational is missing. Want to step back?"*

---

### Phase 6: Gap Check

The interview produces intent. The PRD needs more than intent. Before writing, compare what you have against the nine mandatory PRD areas.

| # | Area | Question to ask yourself |
|---|---|---|
| 1 | Problem Statement | Can I state the user's problem from their perspective? |
| 2 | Solution | Can I state the solution from their perspective, in plain language? |
| 3 | User Stories | Do I have a concrete list of actor/feature/benefit statements? |
| 4 | Objective | Do I know who the user is and what success looks like? |
| 5 | Technical Decisions | Do I know the modules, interfaces, schema changes, and contracts? |
| 6 | Project Structure | Do I know where source, tests, and docs live? |
| 7 | Commands | Do I know the build, test, lint, and dev commands? |
| 8 | Testing Strategy | Do I know the framework, test levels, and what a good test looks like here? |
| 9 | Boundaries | Do I know what is always done, what is asked first, and what is never done? |

For each gap, classify it:

- **Answerable by you** — look it up (existing repo conventions, framework defaults). Do it, do not ask.
- **Answerable only by the user** — a decision. Ask.
- **Not yet known** — write it into the PRD's "Open Questions" section and move on.

**Report the gaps as a list, then ask the user whether to resolve them now or record them as Open Questions.** Do not silently invent answers. Do not turn this into a second full interview: only the gaps get questioned, one round maximum.

**Exit condition:** every one of the nine areas is either filled, explicitly asked, or recorded as an open question.

---

### Phase 7: Write the PRD and Gate

Write the PRD using the template in the next section. Then:

1. **Save it to `docs/prd/<name>.md`.** Create `docs/prd/` if it does not exist. For a multi-module initiative, one file per module id.
2. **Ask for an explicit yes.** The following are **not** a yes:
   - "Whatever you think is best." -> The user is delegating, not deciding. Re-ask with two concrete options framed as a choice.
   - "Sounds good." -> Ambiguous. Ask: "Anything you'd refine?"
   - "Sure, let's go." -> Often a polite exit, not an endorsement. Same follow-up.
   - Silence followed by "okay let's start." -> The user has given up, not converged. Stop and ask whether you missed something.
3. **If corrected, fold it in and restate.** Loop until you get an explicit yes.
4. **After approval, hand off.** Point the user at `planning-and-task-breakdown` to break the PRD into ordered tasks. Mention other skills likely to apply: `api-and-interface-design` if modules have boundaries, `frontend-ui-engineering` if there is UI, `security-and-hardening` if there is auth or user input.

**Exit condition:** the PRD file exists at the agreed path and the user has given an explicit yes.

## PRD Template

Fill every section. If a section is genuinely not applicable, write "Not applicable" and a one-line reason — never leave it blank or delete it.

```markdown
# PRD: [Project or Feature Name]

## Problem Statement

The problem the user is facing, from the user's perspective. Not the technical
symptom — the situation they are in that makes them want this.

## Solution

The solution from the user's perspective. Plain language. No implementation
detail.

## User Stories

A numbered list of user stories covering all aspects of the feature. Each in
the form: As an <actor>, I want a <feature>, so that <benefit>.

1. As a <actor>, I want <feature>, so that <benefit>
2. As a <actor>, I want <feature>, so that <benefit>

Be extensive. A PRD with three user stories usually has not thought about the
feature. Edge cases, failure states, and administrative actions are all stories.

## Objective

What we are building and why. Who the user is. What success looks like in one
or two sentences. This is the anchor every later decision is measured against.

## Technical Decisions

The decisions made during the interview. Include:

- Modules to be built or modified
- Interfaces of those modules that change
- Schema changes
- API contracts
- Specific interactions worth pinning down

Do NOT include file paths or code snippets — they go stale fast. Exception: if
a decision is more precisely expressed as a type shape, schema, or state
machine than as prose, inline just that fragment and note it encodes a decision.

## Project Structure

Where source code lives, where tests go, where docs belong. A short tree with
one-line descriptions.

    src/        -> Application source
    src/lib     -> Shared utilities
    tests/      -> Unit and integration tests
    docs/prd/   -> This PRD and its siblings

## Commands

Full executable commands with flags, not tool names.

    Build: <command>
    Test:  <command>
    Lint:  <command>
    Dev:   <command>

## Testing Strategy

What makes a good test here: test external behavior, not implementation
details. Which modules will be tested. Where similar tests already exist
(prior art). Coverage expectations and which test levels cover which concerns.

## Boundaries

- **Always:** <things done on every change - run tests before commit, follow
  naming conventions, validate inputs>
- **Ask first:** <things requiring human sign-off - schema changes, new
  dependencies, CI config changes>
- **Never:** <hard prohibitions - commit secrets, edit vendor directories,
  remove failing tests without approval>

## Out of Scope

Explicitly what is not being built. Silent disagreement about non-goals is half
of misalignment, so state them.

## Success Criteria

Specific, testable conditions that define done.

- [ ] <testable condition>
- [ ] <testable condition>

## Open Questions

Anything unresolved that needs human input before or during implementation.
```

### Filling notes

- **Problem Statement vs. Objective.** The problem is the user's situation today; the objective is what we intend to change. Both are required; they are not the same sentence.
- **User Stories vs. Success Criteria.** Stories describe desired capabilities; criteria describe verifiable outcomes. A story is rarely a criterion.
- **Technical Decisions is where the interview pays off.** Every recommendation the user accepted, and every correction they made, becomes a line here. This is the section that stops the team from re-deciding during implementation.
- **Boundaries are three-tier on purpose.** "Never" without an escape hatch gets ignored; "always" without teeth is decoration.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The ask is clear enough, skip the interview" | If you cannot write the user's desired outcome in one sentence right now, the ask is not clear. Run Phase 1 before deciding. |
| "Asking many questions wastes their time" | Four to six targeted rounds cost minutes. Building the wrong thing costs weeks, and the user bears that cost. |
| "I'll figure it out as I build" | Switching costs after code exists are an order of magnitude higher. Discovery during implementation is rework. |
| "They said 'whatever you think', so I should just decide" | "Whatever you think" is delegation, not decision. Re-ask with two concrete options framed as a choice. |
| "I should give them several options to pick from" | Options work when the user knows what they want and is choosing between trade-offs. In Phase 3 they may not know yet. Asking narrows the search; listing options widens it. |
| "I attach my guess, so I'm leading them" | Leading is the point. Reacting is faster than generating. The risk is sycophancy, not leading; mitigate by being visibly willing to be wrong. |
| "We have talked enough, I get it" | Test it: can you predict their reaction to the next three questions? If not, you do not get it. |
| "The user said yes, we are done" | If the yes followed a vague restate or an open-ended "sounds good", the yes is hollow. Restate concretely and re-confirm. |
| "This is one big feature, splitting it is overhead" | If acceptance criteria cluster into independently testable groups, a monolithic PRD forces every downstream task to reason over the whole contract. A ten-line capability map is the cheap alternative. |
| "I will decompose during planning" | Planning slices tasks within one approved artifact. Module boundaries and dependency direction must be decided before the PRD is written, not after. |
| "The PRD template is long, I will fill what I can" | A blank section is a silent assumption. Write "Not applicable" with a reason, or fill it. |
| "I will save the PRD at the end, after everything is settled" | Unsaved work does not survive context compaction. Save drafts early; the document is the shared contract, not a memory aid. |
| "The user is in a hurry, I will write the PRD without the gate" | An unapproved PRD is a guess with a cover page. The gate is one question long. |
| "Skip the confidence number, it feels arbitrary" | The number is the honesty mechanism. Without it, "I understand" is unfalsifiable. |

## Red Flags

- More than one question asked outside the round structure (unstructured drift)
- A question without your recommendation attached: that is surveying, not committing
- Asking the user for a fact you could look up (paths, versions, existing conventions)
- Three or more rounds without the confidence number visibly rising: you are asking the wrong questions; reframe the tree
- A confidence number below ~70% with no reason attached
- Accepting "whatever you think is best" as a terminal answer
- Producing the PRD file before the user confirmed the restate
- A blank PRD section with no "Not applicable" note
- User Stories with fewer than five entries for a whole application
- A "Technical Decisions" section that is empty after a full interview (the interview produced nothing usable)
- A multi-module initiative written as one monolithic PRD
- Stating success criteria that are not testable ("it should be fast")
- Writing the PRD into an unnamed, unagreed path
- Marking the work done while the frontier still has open branches

## Verification

Before declaring `get-prd` complete:

- [ ] A hypothesis with a confidence number was stated before the first question
- [ ] Every confidence number below ~70% carried a one-line reason
- [ ] The design tree was mapped and the frontier recomputed each round
- [ ] Questions were asked in rounds, each numbered with a recommendation attached
- [ ] Facts were looked up by the agent, not asked of the user
- [ ] At least one want-vs-should-want probe ran if a sophistication-signaling answer appeared
- [ ] A concrete restate (Outcome / User / Why now / Success / Constraint / Out of scope) was written back
- [ ] Both stop conditions held: reactions predictable for the next three questions, and the frontier empty
- [ ] All nine mandatory PRD areas were filled, asked, or recorded as open questions
- [ ] The PRD is saved at `docs/prd/<name>.md`
- [ ] Every template section is filled or marked "Not applicable" with a reason
- [ ] The user gave an explicit yes (not "whatever you think", not "sounds good", not silence)
- [ ] The handoff to `planning-and-task-breakdown` was made explicit

## Worked Example

A short before-and-after, condensing a real session.

**Without `get-prd`:**

```
User:  build me a dashboard for our metrics
Agent: <starts proposing chart libraries and layouts>
```

The agent has assumed who it is for, what metrics means, and what success looks like. Every assumption is a place the user can later say "that is not what I meant."

**With `get-prd`:**

```
User: build me a dashboard for our metrics

Agent:
HYPOTHESIS: You want a way to answer "how are we doing?" in standup, and
"dashboard" came to mind because that is the conventional answer.
CONFIDENCE: ~30% - missing: who it is for, what "metrics" are in context, and
what success looks like.

**Q1 - Audience**: When you say "how are we doing?", who is asking - you
alone, the engineering team in standup, or up the chain (manager, exec, board)?

-> Engineering team in standup, because "we" usually scopes that way and
standups are where this question gets asked. If it is for execs, both the
metrics and the framing change a lot.

**Q2 - Data source**: Where do the numbers live today - one tool, or several?

-> Several, which is why a single view is wanted. If it were one tool we would
probably not be having this conversation.

User: Q1: actually it is just for me. Q2: they are spread across different docs.
I keep losing track of which experiments are running.

Agent:
Updated read: not a team dashboard at all. It is a personal experiment
tracker. Confidence: ~60% - still missing: what "experiment" means here and
what a finished one looks like.

**Q1 - Unit definition**: What makes something an experiment rather than a
task or a doc? Is it anything with a hypothesis, or something narrower?

-> Anything you would stop or continue based on a result. That is what makes it
an experiment rather than a chore.

**Q2 - Lifecycle**: When an experiment ends, what happens to it - archive,
delete, or stay visible with a result attached?

-> Stay visible with a result. Deleting history is the mistake that makes
trackers useless after a month.
```

Ten minutes in, the actual ask turns out to be "a list of experiments with their signals", not "a dashboard". Different artifact, different scope, different work. The dashboard would have been wrong.

The PRD then opens:

```markdown
# PRD: Experiment Tracker

## Problem Statement

I run several experiments at once and have no single place that says which ones
are running and what their early signal looks like. The information exists but
is spread across different documents, so answering "what am I running?" means
reconstructing it from scratch each time.

## Solution

A personal list that is the single source of truth for running experiments.
Each entry records what the experiment is and what signal it produces, and
finished experiments remain visible with their result attached.
...
```

## Interaction with Other Skills

- **`planning-and-task-breakdown`**: downstream and mandatory. The approved PRD is its input. Every task it produces should trace back to a PRD section.
- **`interview-me`**: overlapping by design. This skill carries the same intent-extraction discipline inline. Do not invoke `interview-me` from inside `get-prd`; the interview happens here.
- **`spec-driven-development`**: overlapping by design. This skill produces a PRD that satisfies the same purpose. Both may coexist; choose per task, not per section.
- **`idea-refine`**: upstream alternative. If the user has several candidate directions and has not chosen one, `idea-refine` explores the space first. Once a direction is chosen, `get-prd` takes over.
- **`api-and-interface-design`**: downstream, conditional. Invoke when the PRD's Technical Decisions section defines module boundaries or external contracts.
- **`frontend-ui-engineering`**: downstream, conditional. Invoke when the PRD includes user-facing interface work.
- **`security-and-hardening`**: downstream, conditional. Invoke when the PRD includes authentication, user input, or third-party integration.
- **`constraint-driven-development`**: adjacent. `get-prd` owns product requirements; `constraint-driven-development` owns the standing quality bar (formatters, lint rules, test gates) that applies across all work.
