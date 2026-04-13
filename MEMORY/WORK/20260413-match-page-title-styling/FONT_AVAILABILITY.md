# Font Availability Check

## ✅ Fonts Available on Your Site

1. **valkyrie-text** ✅
   - File: cms/public/fonts/valkyrie-light.css
   - Used for: H1 headings

2. **heliotrope-caps** ✅
   - File: cms/public/fonts/heliotrope-light.css
   - Used for: H3 headings

3. **concourse-text** ✅
   - File: cms/public/fonts/concourse-light.css
   - Used for: UI elements, buttons

4. **equity-text** ✅
   - File: cms/public/fonts/equity-light.css
   - Used for: Body text

## ❌ Fonts NOT Available (Daniel Uses These)

1. **advocate-n34** ❌
   - Daniel uses for: H2 headings
   - Your site will fallback to: -apple-system, BlinkMacSystemFont, sans-serif
   - Style: Narrative width (n34), light weight (200)

2. **advocate-c14** ❌
   - Daniel uses for: H4, H5, H6 headings
   - Your site will fallback to: -apple-system, BlinkMacSystemFont, sans-serif
   - Style: Condensed width (c14), light weight (200)

## Impact

The headings will still render correctly with:
- Correct font sizes (121.3%, 128%, 108%, 120%)
- Correct font weights (200, 400, 500)
- Correct text transforms (lowercase for H2-H6)
- Correct margins and padding

**However**, without the actual advocate font files:
- H2, H4, H5, H6 will use system fonts instead of Daniel's custom advocate fonts
- The visual character will be slightly different
- Typography won't be identical to Daniel's site

## Solution Options

To perfectly match Daniel's site, you would need to:

1. **Get Daniel's font files** (from his site or repository):
   - advocate_34_narr_reg.woff2 (narrative width)
   - advocate_14_cond_reg.woff2 (condensed width)

2. **Add them to your site**:
   - Place in: cms/public/fonts/
   - Add @font-face declarations to core-fonts.css

3. **Current fallback** will work fine, just not identical
