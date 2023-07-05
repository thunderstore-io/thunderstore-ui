# Build Secrets

This directory exists to house secrets that should not be committed to git but
should be available when building, such as the .npmrc file.

The docker compose configuration should expect any such build-time secrets to
be in this directory.
