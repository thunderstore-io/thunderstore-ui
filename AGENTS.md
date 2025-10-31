# When in Agent or Plan mode
## Creating new files
- When creating a new file and encountering an line endings related issue; stop and ask for the user to fix the line endings.

## Code readibility
- Ensure all classes and functions have up-to-date JSDoc annotations.

# When working with audit document or asked to audit
## Audit documentation
- Capture work in the existing docs under `docs/` (or create a new markdown file there) before making code changes.
- Record the scope, impacted surface area, and the date so future contributors can see what was completed and why.
- Use tables when summarizing scope, status, and follow-ups so progress stays easy to scan.
- Default table columns: `Path`, `Current pattern`, `Risk`, `Suggested next step`.
- Fill each row with:
	- `Path`: the file, route, or module under review.
	- `Current pattern`: concise description of the observed behavior or implementation.
	- `Risk`: qualitative severity (e.g., Low/Medium/High) with optional brief rationale.
	- `Suggested next step`: the planned action or completion note with date when done.
- When work progresses, update the same entry instead of creating duplicates; note pending follow-ups and mark them complete once verified.
- Update each row accordingly:
	- `Path`: the new file, route, or module, if it has changed.
	- `Current pattern`: concise description of the current (often new after changes) observed behavior or implementation.
	- `Risk`: up-to-date qualitative severity (e.g., Low/Medium/High) with optional brief rationale.
	- `Suggested next step`: the planned next action or "-" when done.