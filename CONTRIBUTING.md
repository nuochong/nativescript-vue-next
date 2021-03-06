# Contributing to nativescript-vue-next

If you feel like contributing to this project, that is awesome! This guide should help you get started.

# Pull Request Guidelines

- It's OK to submit PR against the `master` branch
- It's OK to have multiple commits per PR (will be squashed during merge)
- Please describe the changes in every PR, to make it easier to review. (No empty PR descriptions please)
- Commit messages must follow the [commit message convention](./github/commit-convention.md) so that changelogs can be automatically generated. Commit messages are automatically validated before commit (by invoking [Git Hooks](https://git-scm.com/docs/githooks) via [yorkie](https://github.com/yyx990803/yorkie)).

We will re-iterate these guidelines as the project matures.

# Contributing to docs

COMPLETE

# Development setup

You will need Node.js (>=10.18.1) and Yarn installed, as well as NativeScript.

Please make sure you are using Nativescript 6.x

After cloning the repo, run:

```bash
$ cd nativescript-vue-next
$ yarn
$ yarn build
```

# Testing with the sample application

Before testing the sample apps, please change the package manager that NativeScript uses to yarn:

```bash
$ tns package-manager set yarn
```

Finally, run the sample app with:

```bash
$ cd apps/test
$ tns run android  # or
$ tns run ios
```

# Executing unit tests

```bash
$ yarn test
```

# Upgrading dependencies

```bash
$ yarn upgrade-interactive --latest
```

# Project Structure

- `apps`: Sample {N} applications for testing
- `packages`: Contains `nativescript-vue` specific platform code
  - `compiler`: This is where template compilation logic will go (vue template -> render function)
  - `runtime`: {N} specific Vue backend
- `scripts`: Directory for the custom tooling for managing and building the project

# Troubleshooting

COMPLETE