---
name: test-generator
description: Generate comprehensive test suites
usage: "cat mycode.py | test-generator"
example: "cat app.js | test-generator --framework jest"
---

# Test Generator

Generate comprehensive test suites for your code. Covers unit tests, integration tests, and edge cases.

## Usage

```bash
cat mycode.py | test-generator
cat app.js | test-generator --framework jest
cat service.go | test-generator --comprehensive
```

## Options

- `--framework <fw>` - Test framework: jest, pytest, go-test, vitest (default: auto-detect)
- `--comprehensive` - Generate exhaustive test suite (more tests, longer runtime)
- `--focus <area>` - Focus on: happy-path, edge-cases, errors, all (default: all)
- `--coverage-target <%>` - Target code coverage percentage (default: 80)

## What It Tests

- Happy path scenarios
- Edge cases and boundary conditions
- Error handling and failure modes
- Input validation
- Integration points
- Performance characteristics (if requested)

## Output

Complete test file with:
- Setup and teardown hooks
- Test cases for all functions/methods
- Edge case coverage
- Mock/stub examples for external dependencies
- Performance benchmarks (if applicable)
- Coverage expectations
