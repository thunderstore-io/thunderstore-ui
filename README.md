# Thunderstore UI

## Installation

Run `yarn install` at the root of the project, that's it.

## Repository structure

This repository is intended to function as a monorepo, which contains several
sub-projects inside it. The goal of this structure is to enable easier code
sharing between projects as well as more efficient and higher coverage test
suites

Tools used for enabling this behavior are primarily:

- yarn workspaces, as defined in the root `package.json`
- typescript configuration inheritance and path aliases
- tweaks for module resolution done in other tools such as nextjs or webpack,
  making sure the path aliased packages are appropriately resolved

All sub-projects exist in the `packages` directory, includinig the following:

### components

This project is intended to house common UI components that can be re-used
across different projects, e.g. the Thunderstore Mod Manager as well as the
website

### nextjs

This nextjs-based website project

### storybook

[storybook](https://storybook.js.org/) is used to make the component catalogue
easier to browse.

You can run it with `yarn storybook` within the storybook project, and access it
via localhost at the port provided on the terminal.
