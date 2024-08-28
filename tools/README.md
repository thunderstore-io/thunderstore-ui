
# Visual diff tooling

## Summary

The visual diffing pipeline consists of several components/steps which can be
found in the tools directory here (+ the github actions `visual-diff.yml`
workflow)

The steps to produce visual diffs are as follows:

1. Installing appropriate node & python versions
2. Installing poetry dependencies of the `visual-diff-ci` project directory
3. Running the `poetry run python run_ci_script.py` command in the
`visual-diff-ci` directory, (which needs `PERCY_TOKEN` to be set in the
environment for the snapshots to be uploaded). The script will proceed with
the following operations:
   1. Install dependencies of the `cyberstorm-remix` app
   2. Build the `cyberstorm-remix` app
   3. Start the `visual-diff-backend` docker compose stack
      - This will create a fresh Thunderstore instance with automatically
        populated test data included.
   4. Wait for the Thunderstore backend to come online
   5. Start the `cyberstorm-remix` frontend app
   6. Wait for the `cyberstorm-remix` frontend to come online
   7. Install dependencies for the `cyberstorm-playwright` project
   8. Run the `cyberstorm-playwright` tests/snapshot capture process
      - This will upload the captured snapshots to percy if `PERCY_TOKEN` was
        set in the environment
   9. Tear down the started processes

## Caveats

- Might be fragile, as not much code has been added to account for edge cases
(e.g. some failure flows might lead to the booted processes to be left running,
which breaks further runs.)
- Includes a lot of hardcoded assumptions (e.g. port numbers, thunderstore
docker image version, etc) that might need to be updated at some point.

## Adding new snapshots

Adding new snapshots is easy enough, just add more playwright tests at
`cyberstorm-playwright/tests`. Refer to playwright + percy documentation
for examples (playwright in general, percy+playwright for integration details).

**NOTE:** If you run the `cyberstorm-remix` project locally, make sure to host
it at `http://127.0.0.1:3000` for the playwright setup to be able to connect
to it.

## Project directories included

### visual-diff-backend

The `visual-diff-backend` directory includes a minimal docker setup of the
Thunderstore backend, which when run, will bootstrap a fresh Thunderstore
instance and populate it with test content.

If changes to the Thunderstore API / data used with test screenshot generation
are needed, this is what you will need to edit.

**NOTE:** Currently the thunderstore docker image version is hardcoded and will
not pull the latest. To upgrade, modify the docker-compose.yml

**NOTE:** Includes hardcoded port mapping for the API to be hosted at port
8000

### visual-diff-ci

The `visual-diff-ci` directory contains a python script which can be run on the
CI or locally to run the visual diff screenshot generation pipeline & upload
results to percy

Can be run by `poetry run python run_ci_script.py`, will need a `PERCY_TOKEN`
environment variable to be set in order for the snapshots to get uploaded
for review (this is automated on the CI).

**NOTE:** This project currently includes a handful of hardcoded assumptions in
regards to where server(s) are hosted in order to glue everything together.

### cyberstorm-playwright

The `cyberstormp-playwright` directory includes a setup for taking snapshots
of the `cyberstorm-remix` project.

**NOTE:** The `cyberstorm-remix` project is expected to be accessible at
`http://127.0.0.1:3000/` for the run to succeed. The `visual-diff-ci` script
will automatically
