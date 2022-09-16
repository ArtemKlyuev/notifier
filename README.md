# Notifier

A low-level engine to manage notifications.

Notifier is a low-level engine to create and manage your app notifications. It's supposed to be used on the frontend, but you're not limited by the platform anyway.

## Table of contents

- [Packages](#packages)
- [Changes](#changes)
- [Examples](#examples)
- [Maintaining](#maintaining)
  - [Package manager](#package-manager)
  - [Commits](#commits)
  - [Scripts](#scripts)
  - [pre-commit hook](#pre-commit-hook)

## Packages

This repository is a monorepo containing the following packages:

- [`@notifierjs/core`](/packages/core) — platform and framework agnostic engine that
  helps you build your own notifications system
- [`@notifierjs/react`](/packages/react) — [`@notifierjs/core`](/packages/core) binding for [`react`](https://github.com/facebook/react)

## Changes

Detailed release notes for a given version can be found [on a releases page](https://github.com/ArtemKlyuev/notifier/releases).

## Examples

Check [live demo](https://codesandbox.io/s/notifierjs-react-react-spring-example-q6o1u3?file=/src/App.tsx)

Check out [`examples`](/examples) folder for more usage examples.

## Maintaining

### Package manager

This project uses [`yarn v1`](https://classic.yarnpkg.com/) package manager, please make
sure you have it installed and ready to use.

### Commits

This project uses [`commitizen`](https://github.com/commitizen/cz-cli) please use the
[`cm` script](#scripts) to run it.

### Scripts

List of available scripts to run from the project root:

- `add:root` — add dependency to the project root `package.json`
- `lint` — lint all files with [`eslint`](https://eslint.org/)
- `lint:fix` — fix all problematic files with [`eslint`](https://eslint.org/)
- `cm` — launch commit workflow with [`commitizen`](https://github.com/commitizen/cz-cli)
- `package:core` — launch any command from the [`@notifierjs/core`](/packages/core) package root
- `package:react` — launch any command from the [`@notifierjs/react`](/packages/react) package root

### pre-commit hook

pre-commit hooks set up thanks to [sudo-suhas](https://github.com/sudo-suhas)
and his [lint-staged-multi-pkg project](https://github.com/sudo-suhas/lint-staged-multi-pkg) repo

helpful `lerna` options:

https://github.com/lerna/lerna/tree/main/core/global-options#--concurrency

https://github.com/lerna/lerna/tree/main/core/filter-options#--since-ref

`husky` is installed in the root `package.json` as recommended in
[husky docs](https://github.com/typicode/husky/tree/main/docs#monorepo).

The pre-commit hook is configured with the script

```sh
yarn lerna run --concurrency 1 --stream precommit --since HEAD --exclude-dependents
```

in the [`.husky/pre-commit`](/.husky/pre-commit) file

This executes the `precommit` script for each package (if it exists). Execution is
limited to only those packages with modified files, however the
`--since HEAD --exclude-dependents` option does not consider whether
the file is staged. To further limit `precommit` to only staged files please
look at the discussion in
[sudo-suhas/lint-staged-multi-pkg#4](https://github.com/sudo-suhas/lint-staged-multi-pkg/issues/4).
Furthermore, concurrent execution is disabled because it can cause problems
during `git add` (see [okonet/lint-staged#225](https://github.com/okonet/lint-staged/issues/225)).

Each package has its own `lint-staged` config file and `precommit` script which is
triggered by `lerna`.
