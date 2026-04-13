# H1-H6 Heading Styles Updated

## Changes Made to custom.css (lines 20-96)

### What Changed

**BEFORE:**
```css
.VPDoc h1, .VPDoc h2, .VPDoc h3, .VPDoc h4, .VPDoc h5, .VPDoc h6,
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading) !important;
}
```

All headings used the same font family (valkyrie-text).

**AFTER:**
Each heading now has its own unique styling matching Daniel's site:

```css
/* H1 - Main heading */
h1 {
  font-family: 'valkyrie-text';
  font-size: 121.3%;
  font-weight: 500;
  margin-top/bottom: 1.25rem;
  padding-top/bottom: .4rem;
}

/* H2 - Large subheadings */
h2 {
  font-family: 'advocate-n34';
  font-size: 128%;
  font-weight: 200;  /* Extra light */
  text-transform: lowercase;
  margin-top/bottom: 1.25rem;
  padding-top/bottom: .4rem;
}

/* H3 - Medium subheadings */
h3 {
  font-family: 'heliotrope-caps';
  font-size: 108%;
  font-weight: 400;
  text-transform: lowercase;
  margin-top/bottom: 1.25rem;
  padding-top/bottom: .4rem;
}

/* H4 - Small subheadings */
h4 {
  font-family: 'advocate-c14';
  font-size: 120%;
  font-weight: 200;  /* Extra light */
  text-transform: lowercase;
  margin-top/bottom: 1.25rem;
  padding-top/bottom: .4rem;
}

/* H5 - Minor headings */
h5 {
  font-family: 'advocate-c14';
  font-size: 120%;
  text-transform: lowercase;
  margin-top/bottom: 1.25rem;
  padding-top/bottom: .35rem;
}

/* H6 - Smallest headings */
h6 {
  font-family: 'advocate-c14';
  font-size: 120%;
  font-weight: 500;
  text-transform: lowercase;
  margin-top/bottom: 1.15rem;
  padding-top/bottom: .35rem;
}
```

## Font Families Used

1. **valkyrie-text** - H1 only (your main heading font)
2. **advocate-n34** - H2 (narrative width, light weight)
3. **heliotrope-caps** - H3 (small caps style)
4. **advocate-c14** - H4, H5, H6 (condensed width)

## Key Visual Differences

- **H2 is largest** at 128% (vs H1 at 121.3%)
- **H2 uses lightest weight** (200) for elegance
- **All except H1 use lowercase** for subtle, refined look
- **Each level has unique font family** for visual hierarchy
- **Consistent padding** (.4rem for H1-H4, .35rem for H5-H6)

## Note on Font Files

Your site already has these font files loaded:
- ✅ valkyrie-text (valkyrie_a_regular.woff2)
- ✅ advocate-n34 (advocate_34_narr_reg.woff2)
- ✅ heliotrope-caps (heliotrope_3_caps_regular.woff2)
- ✅ advocate-c14 (advocate_14_cond_reg.woff2)

All fonts are available, so the changes will render immediately!
