# Commit Messages(in Pull Reqeust) Checker with regex

![Version](https://img.shields.io/github/v/release/gsactions/commit-message-checker?style=flat-square)
![Test](https://github.com/gsactions/commit-message-checker/workflows/build-test/badge.svg)

A GitHub action that checks that commit messages match a regex patter. The
action is able to act on pull request and push events and check the pull
request title and body or the commit message of the commits of a push.

On pull requests the title and body are concatenated delimited by two line
breaks.

Designed to be very flexible in usage you can split checks into various
workflows, using action types on pull request to listen on, define branches
for pushes etc. etc.

## Configuration

More information about `pattern` and `flags` can be found in the
[JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp).

`flags` is optional and defaults to `gm`.

### Example Workflow

```yml
name: 'Commit Message Check'
on:
  pull_request:
    types:
      - opened
      - edited
      - reopened
      - synchronize

jobs:
  check-commit-message:
    name: Check Commit Message
    runs-on: ubuntu-latest
    steps:
      - name: Get PR Commits
        id: 'get-pr-commits'
        uses: tim-actions/get-pr-commits@master
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Check Subject Line Length
        uses: tim-actions/commit-message-checker-with-regex@v0.1.0
        with:
          commits: ${{ steps.get-pr-commits.outputs.commits }}
          pattern: '^.{0,75}(\n.*)*$'
          error: 'Subject too long (max 75)'

      - name: Check Body Line Length
        if: ${{ success() || failure() }}
        uses: tim-actions/commit-message-checker-with-regex@v0.1.0
        with:
          commits: ${{ steps.get-pr-commits.outputs.commits }}
          pattern: '^.+(\n.{0,72})*$'
          error: 'Body line too long (max 72)'

      - name: Check Fixes
        if: ${{ success() || failure() }}
        uses: tim-actions/commit-message-checker-with-regex@v0.1.0
        with:
          commits: ${{ steps.get-pr-commits.outputs.commits }}
          pattern: '\s*Fixes\s*:?\s*(#\d+|github\.com\/kata-containers\/[a-z-.]*#\d+)'
          error: 'No "Fixes" found'

      - name: Check subsystem
        if: ${{ success() || failure() }}
        uses: tim-actions/commit-message-checker-with-regex@v0.1.0
        with:
          commits: ${{ steps.get-pr-commits.outputs.commits }}
          pattern: '^[\h]*([^:\h]+)[\h]*:'
          error: 'Failed to find subsystem in subject'


```

## Development

### Quick Start

```sh
git clone https://github.com/gsactions/commit-message-checker.git
npm install
npm run build
```

That's it, just start editing the sources...

### Commands

Below is a list of commands you will probably find useful during the development
cycle.

#### `npm run build`

Builds the package to the `lib` folder.

#### `npm run format`

Runs Prettier on .ts and .tsx files and fixes errors.

#### `npm run format-check`

Runs Prettier on .ts and .tsx files without fixing errors.

#### `npm run lint`

Runs Eslint on .ts and .tsx files.

#### `npm run pack`

Bundles the package to the `dist` folder.

#### `npm run test`

Runs Jest test suites.

#### `npm run all`

Runs all of the above commands.

## License

This project is released under the terms of the [MIT License](LICENSE)
