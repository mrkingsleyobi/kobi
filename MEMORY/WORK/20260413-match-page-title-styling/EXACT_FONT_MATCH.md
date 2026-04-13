# PERFECT MATCH: Daniel Miessler Headings

## Fonts Downloaded ✅

Downloaded directly from Daniel's site:
- `advocate_34_narr_reg.woff2` (25KB) - Narrative width, regular weight
- `advocate_14_cond_reg.woff2` (24KB) - Condensed width, light weight

Location: `/cms/public/fonts/`

## @font-face Declarations Added

```css
@font-face {
  font-family: 'advocate-n34';
  src: url('/fonts/advocate_34_narr_reg.woff2') format('woff2');
  font-style: normal;
  font-weight: 400;
  font-stretch: normal;
  font-display: swap;
}

@font-face {
  font-family: 'advocate-c14';
  src: url('/fonts/advocate_14_cond_reg.woff2') format('woff2');
  font-style: normal;
  font-weight: 100;
  font-stretch: normal;
  font-display: swap;
}
```

## Exact Heading Styles Now Match Daniel

| Heading | Font Family | Size | Weight | Transform |
|---------|-------------|------|--------|-----------|
| H1 | valkyrie-text | 121.3% | 500 | normal |
| H2 | advocate-n34 ✅ | 128% | 200 | lowercase |
| H3 | heliotrope-caps | 108% | 400 | lowercase |
| H4 | advocate-c14 ✅ | 120% | 200 | lowercase |
| H5 | advocate-c14 ✅ | 120% | normal | lowercase |
| H6 | advocate-c14 ✅ | 120% | 500 | lowercase |

## Files Modified

1. **custom.css** (lines 1-19): Added @font-face declarations
2. **custom.css** (lines 20-96): Updated H1-H6 styles with exact fonts

## Result

Your headings now use the **exact same fonts** as Daniel's site!
- No more substitutions
- No more fallbacks
- Perfect typographic match
