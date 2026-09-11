# Font Substitution Analysis

## Daniel's Site Uses (NOT AVAILABLE)

❌ **advocate-n34** - Narrative width, regular weight
- Used for: H2 headings
- Not found in: Plans/website/fonts/

❌ **advocate-c14** - Condensed width, light weight (100)
- Used for: H4, H5, H6 headings
- Not found in: Plans/website/fonts/

## Available Fonts (CAN USE AS SUBSTITUTES)

✅ **advocate-c41** - Condensed width, regular weight
- Available in: core-fonts.css
- Can substitute for: advocate-c14
- Difference: Regular weight (400) vs light (100)

✅ **heliotrope-text** - Already loaded
- Available in: heliotrope-light.css
- Can substitute for: advocate-n34
- Similar: Sans-serif, narrative style

✅ **valkyrie-text** - Already used for H1
- Available in: valkyrie-light.css
- Current usage: H1

✅ **heliotrope-caps** - Already used for H3
- Available in: heliotrope-light.css
- Current usage: H3

## Recommended Substitutions

```css
/* H2 - Use heliotrope-text instead of advocate-n34 */
h2 {
  font-family: 'heliotrope-text', -apple-system, sans-serif;
  font-size: 128%;
  font-weight: 200;  /* Keep Daniel's light weight */
  text-transform: lowercase;
}

/* H4-H6 - Use advocate-c41 instead of advocate-c14 */
h4, h5, h6 {
  font-family: 'advocate-c41', -apple-system, sans-serif;
  font-size: 120%;
  text-transform: lowercase;
}
```

This will closely approximate Daniel's look using available fonts.
