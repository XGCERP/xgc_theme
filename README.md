### XGC Theme App

XGC ONEUI

## ONEUI source files
xgc_theme/xgc_theme/OneUI/README.md

Frappe theme app creation /Users/dzb/Dev/GitHub/xgc_theme/frappe-theme.md

### Installation

You can install this app using the [bench](https://github.com/frappe/bench) CLI:

```bash
cd $PATH_TO_YOUR_BENCH
bench get-app $URL_OF_THIS_REPO --branch develop
bench install-app xgc_theme
```

### Contributing

This app uses `pre-commit` for code formatting and linting. Please [install pre-commit](https://pre-commit.com/#installation) and enable it for this repository:

```bash
cd apps/xgc_theme
pre-commit install
```

Pre-commit is configured to use the following tools for checking and formatting your code:

- ruff
- eslint
- prettier
- pyupgrade

### License
Private XGC CORP.
