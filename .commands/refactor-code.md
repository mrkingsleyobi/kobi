---
name: refactor-code
description: Improve code readability, performance, and maintainability
usage: "cat messy.py | refactor-code"
example: "cat legacy.js | refactor-code --focus readability"
---

# Refactor Code

Improve code quality while preserving functionality. Focuses on readability, performance, and maintainability.

## Usage

```bash
cat messy.py | refactor-code
cat legacy.js | refactor-code --focus readability
cat service.go | refactor-code --pattern solid
```

## Options

- `--focus <area>` - Focus area: readability, performance, maintainability, all (default: all)
- `--pattern <pattern>` - Apply specific pattern: solid, dry, kiss, clean-architecture
- `--aggressive` - Apply more aggressive refactoring (may change structure significantly)
- `--tests` - Generate tests for refactored code

## What It Improves

- Naming clarity (variables, functions, classes)
- Function length and complexity
- Code duplication (DRY principle)
- Separation of concerns
- Error handling consistency
- Type safety and validation
- Documentation and comments

## Output

Refactored code with:
- Improved structure and naming
- Reduced complexity
- Better separation of concerns
- Comments explaining changes
- Before/after comparison for significant changes
