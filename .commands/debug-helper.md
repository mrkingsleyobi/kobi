---
name: debug-helper
description: AI-powered debugging assistant
usage: '"TypeError: Cannot read property" | debug-helper --code myfile.js'
example: 'cat error.log | debug-helper --code app.py'
---

# Debug Helper

AI-powered debugging assistant. Analyzes errors, stack traces, and logs to identify root causes and solutions.

## Usage

```bash
echo "TypeError: Cannot read property" | debug-helper --code myfile.js
cat error.log | debug-helper --code app.py
debug-helper --interactive  # Interactive debugging mode
```

## Options

- `--code <file>` - Source code file to analyze alongside error
- `--interactive` - Interactive mode with guided troubleshooting
- `--stack-trace` - Include stack trace analysis
- `--similar` - Search for similar known issues

## What It Analyzes

- Error messages and types
- Stack traces and call paths
- Log patterns and anomalies
- Code context around error locations
- Common pitfalls in your language/framework
- Resource exhaustion issues

## Output

Debugging analysis with:
- Root cause identification
- Explanation of why the error occurred
- Specific fix recommendations with code
- Prevention strategies for similar issues
- Related documentation links
- Additional diagnostics to run if needed
