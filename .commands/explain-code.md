---
name: explain-code
description: Get detailed explanations of complex code
usage: "cat algorithm.py | explain-code"
example: "cat advanced.rs | explain-code --level beginner"
---

# Explain Code

Get detailed explanations of complex code, algorithms, and patterns. Adapts to your experience level.

## Usage

```bash
cat algorithm.py | explain-code
cat advanced.rs | explain-code --level beginner
cat pattern.js | explain-code --examples
```

## Options

- `--level <level>` - Explanation depth: beginner, intermediate, advanced (default: intermediate)
- `--examples` - Include additional examples
- `--analogy` - Use real-world analogies
- `--step-by-step` - Break down execution line by line

## What It Explains

- Algorithm logic and flow
- Design patterns used
- Time and space complexity
- Trade-offs and alternatives
- Edge cases and error handling
- Context and typical use cases

## Output

Clear explanation with:
- High-level summary
- Detailed breakdown of key concepts
- Execution flow for main logic paths
- Complexity analysis (Big O)
- Comparison with alternatives
