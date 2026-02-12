# General Code Review Standards

## Intent and scope

- What is the high-level goal this PR is trying to achieve? Request clarification if the intent is unclear
- PR should contain changes directly supporting achieving the goal
- PR shouldn't contain changes unrelated to the goal or scope creep
- Point out potential wrong assumptions that could lead to bugs or incorrect behavior later on

## Consistency

- Follow repo conventions and respect module boundaries
- Reuse existing utilities and patterns instead of re-implementing them
- Create new APIs that are consistent with existing abstractions, naming, and patterns

## Maintainability

- Prefer solutions that are as simple as possible
- Avoid unnecessary boilerplate and abstractions
- Prefer concise code, but not at the cost of maintainability
- Prefer readable code over clever/cryptic logic and recommend refactors where clarity is low
- Include tests for unexpected inputs, failure modes, and regressions
- Test should validate behaviour, not implementation details
- Use intent-revealing names that are consistent with domain and repo conventions
- Use comments to explain "why" (unsuitable simpler alternatives, tradeoffs), not to restate "what"
  - Prefer rewriting for clarity rather than adding "what" comments due to cryptic code
- Use commit messages that state the intent of the change, and when not trivial, explain why the change is needed

## Pitfalls

- Point out performance pitfalls (extra I/O, N+1 queries, redundant computation)
- Point out unintended consequences of the changes elsewhere (coupling, side effects, concurrency, compatibility)
