---
name: code-review
description: Comprehensive code review for security, performance, and best practices
usage: "cat myfile.py | code-review"
example: "cat app.py | code-review --focus security"
---

# Code Review

Comprehensive code review analyzing security vulnerabilities, performance issues, and best practices violations.

## Usage

```bash
cat myfile.py | code-review
cat app.py | code-review --focus security
cat main.go | code-review --json  # For CI/CD
```

## Options

- `--focus <area>` - Focus on specific area: security, performance, readability, all (default: all)
- `--json` - Output JSON format for CI/CD integration
- `--severity <level>` - Minimum severity: low, medium, high, critical (default: medium)

## What It Checks

- Security vulnerabilities (SQL injection, XSS, auth flaws, etc.)
- Performance issues (N+1 queries, memory leaks, inefficient algorithms)
- Code smell and maintainability issues
- Best practices violations
- Error handling completeness
- Resource management (file handles, connections, etc.)

## Output

Human-readable report with:
- Issue severity and location
- Explanation of the problem
- Recommended fix with code example
- Links to relevant documentation
