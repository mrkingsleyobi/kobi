# Code Review

This command performs comprehensive code review for security, performance, and best practices.

## Usage

```bash
cat myfile.py | code-review
cat app.js | code-review --focus security
cat main.go | code-review --json # For CI/CD
```

## Features

- **Security Analysis**: Identifies potential security vulnerabilities
- **Performance Review**: Suggests performance optimizations
- **Best Practices**: Checks adherence to coding standards
- **Type Safety**: Validates type usage and consistency
- **Code Smell Detection**: Identifies problematic patterns

## Options

- `--focus <area>`: Focus on specific area (security, performance, style)
- `--json`: Output results in JSON format for CI/CD integration
- `--strict`: Enable stricter rules and warnings

## Examples

Review a Python file:
```bash
cat app.py | code-review --focus security
```

Review JavaScript with JSON output:
```bash
cat client.js | code-review --json > review-results.json
```

## Integration

This command integrates with the project's pre-commit hooks and CI pipeline.
