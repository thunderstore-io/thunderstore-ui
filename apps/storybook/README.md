# Storybook

[Storybook](https://storybook.js.org/) is a sandbox for building UI components in
isolation, without starting the whole stack. It also showcases existing components
to encourage reuse.

From the thunderstore-ui repo root:

```bash
pnpm --filter @thunderstore/storybook run storybook
```

Storybook is then available at [http://localhost:6006](http://localhost:6006).

When adding components to `@thunderstore/cyberstorm`, add stories for them under
[`src/stories`](src/stories) — see the existing files for examples. To upgrade
Storybook when it reports a new version, run the suggested
`npx storybook@latest upgrade` command in this directory.

Every exported Cyberstorm component should have a story — Storybook is the gate
that catches component breakage. Use the **Theme** toolbar toggle to view any
story with `@thunderstore/cyberstorm-theme` on (the production look) or off (the
barebones `@thunderstore/cyberstorm`-only render), which verifies components still
work without the theme.

## Chromatic

[Chromatic](https://www.chromatic.com/docs/) runs in CI to host Storybook and
detect visual changes to stories. Every story is captured in **two theme modes**
— `themed` (the production look) and `barebones` (theme off) — via the
`@chromatic-com/storybook` addon and the modes defined in
[`.storybook/modes.ts`](.storybook/modes.ts), so breakage is caught both with
and without the theme.

The `chromatic-deployment` job in
[`../../.github/workflows/chromatic.yml`](../../.github/workflows/chromatic.yml)
builds and uploads Storybook. It does **not** run on every branch push.

When a build runs:

- **Pull requests** from this repository, and **pushes to `master`**. A push to
  any other branch still runs the Test workflow and does not upload snapshots.
  Fork and Dependabot pull requests do not upload. Forks never receive
  `CHROMATIC_CYBERSTORM_TOKEN`. Dependabot-triggered workflows only receive
  Dependabot secrets, so the Actions secret is missing there too. Both still
  get a successful **UI Tests** status from
  [`ui-tests-fork.yml`](../../.github/workflows/ui-tests-fork.yml) and
  [`ui-tests-dependabot.yml`](../../.github/workflows/ui-tests-dependabot.yml)
  so the required check does not stay pending. That status is not a visual
  review.
- **After Test succeeds** on that commit. The job waits for the **Test** check
  and does not install or upload while tests are still running. A failed Test
  check does not spend snapshots. The skipped Test check that a same-repo pull
  request posts is ignored; the run that counts is the one from the branch push.
- **Only when UI files changed.** The diff (against the pull request base, or
  the previous `master` commit) must touch `apps/storybook`,
  `packages/cyberstorm`, or `packages/cyberstorm-theme`. A change to
  `pnpm-lock.yaml`, `apps/storybook/.storybook/preview.tsx`, or
  `apps/storybook/.storybook/prefixCyberstormThemeCss.ts` forces a full capture
  instead of TurboSnap. Any other diff skips capture.
- A newer commit on the same pull request (or on `master`) cancels an upload
  that has not finished.

When UI files did change, TurboSnap (`onlyChanged`) captures the stories
affected by the diff. Stories still import the `@thunderstore/cyberstorm`
barrel, so a component change marks every story until composition snapshots
land. `externals` lists `packages/cyberstorm/**` and
`packages/cyberstorm-theme/**`. Chromatic matches those globs from the
repository root, not from `workingDir`. A change that matches them disables
TurboSnap for that build, so every story is retaken.

On `master`, `autoAcceptChanges` accepts new baselines so a merge does not wait
for a second visual review. That flag does not reduce how many snapshots are
taken.

`exitZeroOnChanges: true` is intentional: this Actions job is **not** the
visual-change gate. It stays green when Chromatic finds diffs so reviewers can
accept baselines in Chromatic without re-running CI. The merge gate is Chromatic's
separately posted **UI Tests** check. Accepting the baselines turns **UI Tests**
green without a CI re-run.

How the checks behave:

1. **No relevant UI changes** — Chromatic is called with `skip`, so no snapshots
   are taken. **UI Tests** is still reported and is **successful**: there is
   nothing new to review, and a required **UI Tests** check does not stay
   pending.
2. **Relevant changes, no visual diff** — `chromatic-deployment` and **UI Tests**
   both pass.
3. **Visual changes on a pull request** — `chromatic-deployment` still passes.
   **UI Tests** stays yellow (_"N changes must be accepted as baselines"_). Open
   **Details**, review in Chromatic, and accept or reject. Once accepted,
   **UI Tests** turns green without a CI re-run.
4. **Storybook/Chromatic build or capture failure** — `chromatic-deployment`
   fails (red) and **UI Tests** fails.
5. **Fork or Dependabot pull request** — Chromatic does not run. **UI Tests**
   is posted as successful and its description says it was skipped. Visual
   changes on these pulls are not reviewed. To snapshot a fork, push that
   branch to this repository and open the pull request from there.
6. **Push to `master`** — visual changes are accepted automatically.

**Branch protection:** require Chromatic's **UI Tests** check. Fork and
Dependabot pulls satisfy that check with the skip status above; other pulls
still block until visual changes are accepted. That is the only status that
stays non-green on unapproved visual changes. Requiring
`chromatic-deployment` _instead of_ **UI Tests** will not block visual diffs.
Optionally also require `chromatic-deployment` so an install/build failure that
never reaches Chromatic still blocks merge at the Actions level.

`pnpm --filter @thunderstore/storybook exec chromatic` uploads a Storybook manually
(rarely needed, since CI automates it). The Chromatic CLI reads the project
token from the `CHROMATIC_PROJECT_TOKEN` environment variable (or pass
`--project-token`); in CI the token comes from the `CHROMATIC_CYBERSTORM_TOKEN`
Actions secret.
