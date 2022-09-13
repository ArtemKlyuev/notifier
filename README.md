# Notifier

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
lerna run --concurrency 1 --stream precommit --since HEAD --exclude-dependents
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
