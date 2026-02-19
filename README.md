# 🚀 React Native Upgrader (v1)

CLI that analyzes a React Native project and generates a safe upgrade plan.

## ✨ How It Works

The tool analyzes your project, compares it to a target React Native version, and produces a structured set of changes to apply. Public release is planned soon, and full usage documentation will be added at that time.

## 📦 Installation & Usage

### 🚀 Quick Start

Upgrade your React Native project to a specific version:

```bash
npx react-native-upgrade --to 0.84.0
```

### 📋 Options

- `--to <version>` **(required)** - Target React Native version to upgrade to
- `--root <path>` - Project root directory (default: current directory)

### 📝 Examples

**Upgrade current project to React Native 0.84.0:**

```bash
npx react-native-upgrade --to 0.84.0
```

**Upgrade a specific project directory:**

```bash
npx react-native-upgrade --to 0.84.0 --root ./my-app
```

**Upgrade to React Native 0.73.0:**

```bash
npx react-native-upgrade --to 0.73.0
```

## 🤝 Contributing

Contributions are welcome. If you want to help, fork the project and follow these steps to test it locally:

- Clone the project
- Run `npm install`
- Run `npm run dev -- --to 0.74.1`

After that, create a branch, make your changes, and open a PR.

## 🙏 Acknowledgments

This project is inspired by and builds on ideas from:

- [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) - A comprehensive guide for upgrading React Native projects
- [rn-diff-purge](https://github.com/react-native-community/rn-diff-purge) - Purged React Native diffs for every release

## 📄 License and Code of Conduct

This project is released under the MIT license. It also adopts the Contributor Covenant Code of Conduct, and all contributors are expected to follow it.
