# Explain Code

Get detailed explanations of complex code to improve understanding.

## Usage

```bash
cat algorithm.py | explain-code
cat advanced.rs | explain-code --level beginner
cat pattern.js | explain-code --examples
```

## Features

- **Variable Complexity**: Adapts explanation depth to code complexity
- **Multiple Levels**: Beginner, intermediate, and advanced explanations
- **Code Examples**: Provides illustrative examples for complex patterns
- **Pattern Recognition**: Identifies and explains design patterns
- **Best Practices**: Highlights good practices and potential improvements

## Options

- `--level <level>`: Explanation depth (beginner, intermediate, advanced)
- `--examples`: Include code examples in explanation
- `--patterns`: Identify and explain design patterns
- `--line-by-line`: Provide line-by-line breakdown

## Examples

Beginner-friendly explanation:
```bash
cat binary-search.js | explain-code --level beginner
```

With examples:
```bash
cat factory-pattern.ts | explain-code --examples --patterns
```

## Output Format

Explanations include:
1. **Overview**: High-level summary of code purpose
2. **Key Concepts**: Important concepts and patterns used
3. **Line-by-Line**: Detailed breakdown (optional)
4. **Examples**: Illustrative code examples (optional)
5. **Improvements**: Suggestions for enhancement (if applicable)
