# 🚀 React Native Upgrader

CLI that upgrades a React Native project to a target version. It fetches the official [rn-diff-purge](https://github.com/react-native-community/rn-diff-purge) diff between your current version and the target, then applies it to your project with git-style 3-way merges.

## ✨ How It Works

1. **Detects** your current React Native version, app name, and app package from the project.
2. **Downloads** the rn-diff-purge diff for `current..target`.
3. **Shows** the list of files that will change.
4. **Checks git.** If the project isn't a git repo, it offers to create one with a backup commit. If there are uncommitted changes, it asks before continuing.
5. **Applies** each change:
   - Files you haven't changed are updated to the target template.
   - Files you've edited get a 3-way merge (base = old template, yours = your file, theirs = target template).
   - New files are added, and removed files are deleted.
   - Binary files are downloaded from the target version.
6. **Stages** the results the way `git merge` does (see [Merge conflicts](#-merge-conflicts)).
7. **Prints** next steps: reinstall dependencies, pods, rebuild, and any manual follow-ups.

Your app-specific names and package IDs are carried over into the template changes.

## 📦 Installation & Usage

### 🚀 Quick Start

Run it from your project root, or point it at a project with `--root`:

```bash
npx @codersauthority/react-native-upgrade --to 0.84.0
```

### 📋 Options

- `--to <version>` **(required)** - Target React Native version to upgrade to
- `--root <path>` - Project root directory (default: current directory)

### 📝 Examples

**Upgrade the current project to React Native 0.84.0:**

```bash
npx @codersauthority/react-native-upgrade --to 0.84.0
```

**Upgrade a project in another directory:**

```bash
npx @codersauthority/react-native-upgrade --to 0.84.0 --root ./my-app
```

**Upgrade to React Native 0.73.0:**

```bash
npx @codersauthority/react-native-upgrade --to 0.73.0
```

## 🔀 Merge conflicts

When your edits overlap with changes in the target version, the CLI can't merge the file cleanly. It writes standard conflict markers into the file and leaves it **unmerged in the git index**, the same state `git merge` leaves behind:

```
<<<<<<< yours
  ...your version...
=======
  ...target version...
>>>>>>> 0.84.0
```

- `git status` lists the file under **Unmerged paths** (`UU`).
- Files that merged cleanly are **staged** (`M`, `A`, `D`).

To finish up:

1. Open each conflicted file and remove the markers, keeping the code you want.
2. Run `git add <file>` for each one.
3. Check `git status` to confirm nothing is still unmerged.

You can also take one side for a whole file with `git checkout --ours <file>` or `git checkout --theirs <file>`.

## ⚠️ Files that need manual work

The CLI reports these at the end of the run and doesn't change them:

- **Failed changes:** the target diff couldn't be applied to a file, usually because it doesn't exist in your project. The output lists each one, along with a link to the [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) for manual steps.
- **Protected files:** `App.tsx`, `App.js`, and `App.jsx` are never modified, so your app code stays intact.

The exit code is `0` even when some changes fail, so check the summary, not the exit code, in scripts.

## 🛠️ Requirements

- Node.js 18 or newer
- `git` on your PATH (the upgrade uses `git merge-file` and the index)
- Network access to GitHub (to download the diff) and to the target template files

## 🧪 Testing

```bash
npm test                    # unit tests, offline
RN_INTEGRATION=1 npm test   # also scaffolds real bare RN projects and upgrades them
```

The integration tests download the React Native templates from npm and the diff from GitHub, so they take a few minutes and need network access.

## 🤝 Contributing

Contributions are welcome. To test changes locally:

- Clone the project
- Run `npm install`
- Run `npm run dev -- --to 0.74.1` to run the CLI from source against the current directory, or `npm run dev -- --to 0.84.0 --root ./my-app` for a specific project
- Run `npm test` before opening a PR

Then create a branch, make your changes, and open a PR.

## 🙏 Acknowledgments

This project is inspired by and builds on ideas from:

- [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) - A comprehensive guide for upgrading React Native projects
- [rn-diff-purge](https://github.com/react-native-community/rn-diff-purge) - Purged React Native diffs for every release

## 📄 License and Code of Conduct

This project is released under the MIT license. It also adopts the Contributor Covenant Code of Conduct, and all contributors are expected to follow it.
