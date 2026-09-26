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

Every exported Cyberstorm component should have a story — Storybook is the
catalog for controls and local browsing. Those stories show the themed render.
The barebones render is the right-hand column of a composition, not a toolbar
toggle.

Chromatic does not snapshot those per-component stories. It snapshots the
compositions under [`src/stories/compositions`](src/stories/compositions). Each
composition renders its layout twice in one snapshot, themed on the left and
barebones on the right.

**Featuring rule.** Every exported Cyberstorm component is featured in at least
one composition. A component with no composition slot is not covered by
Chromatic.

- Feature a component only once by default. A change then diffs that one
  composition.
- Feature it again only when a second appearance is mandatory for the layout,
  or is the reasonable way to show a state the first slot does not cover.
  Shared primitives (Button, Icon, Heading, Link) are the usual case: a form
  with no submit button is the wrong layout. Overlay components are the other
  case: closed in one page composition, open in their own story. Do not repeat
  them beyond that.
- Do not put Navigation, header, or footer on every composition. One chrome
  change would dirty every snapshot.
- A component rendered inside another (Button inside Modal, Pagination, or a
  card) still diffs the composition that features the outer component. That
  inner use is not a second featuring. Do not strip those out.
- RelativeTime and LocalDateTime are not featured. Their labels depend on the
  clock or the viewer's timezone, so a snapshot would not stay stable.
  LocalDateTime has a catalog story with snapshots off.

## Chromatic

[Chromatic](https://www.chromatic.com/docs/) runs in CI to host Storybook and
detect visual changes. Captured stories are the four page compositions (Chrome,
Listings, Form, Feedback) and six open-state overlay stories (modal, drawer,
dropdown, menu, tooltip, toast). Both themes are in each snapshot, side by
side, rather than as separate Chromatic modes. A full capture is 10 snapshots.
Accepting a snapshot accepts both themes together.

The `chromatic-deployment` job in
[`../../.github/workflows/chromatic.yml`](../../.github/workflows/chromatic.yml)
builds and uploads Storybook. It does **not** run on every branch push.

When a build runs:

- **Pull requests** from this repository, and **pushes to `master`**. A push to
  any other branch still runs the Test workflow and does not upload snapshots.
  Fork and Dependabot pull requests do not upload. Forks never receive
  `CHROMATIC_CYBERSTORM_TOKEN`. Dependabot-triggered workflows only receive
  Dependabot secrets, so the Actions secret is missing there too. Both still
  get successful **UI Tests: cyberstorm** and **UI Review: cyberstorm**
  statuses from
  [`ui-tests-fork.yml`](../../.github/workflows/ui-tests-fork.yml) and
  [`ui-tests-dependabot.yml`](../../.github/workflows/ui-tests-dependabot.yml)
  so those required checks do not stay pending. Those statuses are not a
  visual review.
- **After Test succeeds** on that commit. The job waits for the **Test** check
  and does not install or upload while tests are still running. A failed Test
  check does not spend snapshots. The skipped Test check that a same-repo pull
  request posts is ignored; the run that counts is the one from the branch push.
- **Only when UI files changed.** The diff (against the pull request base, or
  the previous `master` commit) must touch a rendering file under
  `apps/storybook`, `packages/cyberstorm`, or `packages/cyberstorm-theme`.
  Markdown, `.gitignore`, `apps/storybook/Dockerfile`,
  `apps/storybook/nginx.conf`, and unit tests do not count. A change to
  `pnpm-lock.yaml`, `apps/storybook/.storybook/preview.tsx`, or
  `apps/storybook/.storybook/prefixCyberstormThemeCss.ts` forces a full capture
  instead of TurboSnap. Any other diff skips capture.
- A newer commit on the same pull request (or on `master`) cancels an upload
  that has not finished.

When UI files did change, TurboSnap (`onlyChanged`) captures the compositions
affected by the diff. Those stories import the component modules they render,
and the preview imports theme and Cyberstorm CSS from source stylesheets rather
than `dist`. `externals` lists `packages/cyberstorm/**` and
`packages/cyberstorm-theme/**`. Chromatic matches those globs from the
repository root, not from `workingDir`. A change that matches them disables
TurboSnap for that build, so every captured story is retaken.

On `master`, `autoAcceptChanges` accepts new baselines so a merge does not wait
for a second visual review. That flag does not reduce how many snapshots are
taken.

`exitZeroOnChanges: true` is intentional: this Actions job is **not** the
visual-change gate. It stays green when Chromatic finds diffs so reviewers can
accept baselines in Chromatic without re-running CI. The merge gates are the
statuses Chromatic posts, named exactly **UI Tests: cyberstorm** and **UI
Review: cyberstorm**. A status named only **UI Tests** does not satisfy them.
Accepting the baselines turns **UI Tests: cyberstorm** green without a CI
re-run.

How the checks behave:

1. **No relevant UI changes** — Chromatic is not called and no snapshots are
   taken. The workflow posts **UI Tests: cyberstorm** and **UI Review:
   cyberstorm** as successful, so those required checks do not stay pending.
2. **Relevant changes, no visual diff** — `chromatic-deployment` and **UI
   Tests: cyberstorm** both pass.
3. **Visual changes on a pull request** — `chromatic-deployment` still passes.
   **UI Tests: cyberstorm** stays yellow (_"N changes must be accepted as
   baselines"_). Open **Details**, review in Chromatic, and accept or reject.
   Once accepted, **UI Tests: cyberstorm** turns green without a CI re-run.
4. **Storybook/Chromatic build or capture failure** — once Chromatic has
   started, `chromatic-deployment` fails (red) and **UI Tests: cyberstorm**
   fails. An install or `pnpm run build` failure before that step leaves **UI
   Tests: cyberstorm** and **UI Review: cyberstorm** pending; only the Actions
   job reports failure.
5. **Fork or Dependabot pull request** — Chromatic does not run. **UI Tests:
   cyberstorm** and **UI Review: cyberstorm** are posted as successful and the
   description says they were skipped. Visual changes on these pulls are not
   reviewed. To snapshot a fork, push that branch to this repository and open
   the pull request from there.
6. **Push to `master`** — visual changes are accepted automatically.

**Branch protection:** require **UI Tests: cyberstorm** and **UI Review:
cyberstorm**. Those are the status names Chromatic writes. Fork and Dependabot
pulls satisfy both with the skip statuses above; other pulls still block until
visual changes are accepted. **UI Tests: cyberstorm** is the status that stays
non-green on unapproved visual changes. Requiring `chromatic-deployment` in
place of **UI Tests: cyberstorm** will not block visual diffs. Optionally also
require `chromatic-deployment` so an install/build failure that never reaches
Chromatic still blocks merge at the Actions level (both Chromatic statuses stay
pending in that case). The historical matrix name
`chromatic-deployment (apps/storybook, CHROMATIC_CYBERSTORM_TOKEN)` is still
reported, because branch protection requires that exact check.

`pnpm --filter @thunderstore/storybook exec chromatic` uploads a Storybook manually
(rarely needed, since CI automates it). The Chromatic CLI reads the project
token from the `CHROMATIC_PROJECT_TOKEN` environment variable (or pass
`--project-token`); in CI the token comes from the `CHROMATIC_CYBERSTORM_TOKEN`
Actions secret.
