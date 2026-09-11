# Blog Home Updates

## Changes Made to BlogHome.vue

### 1. Post Title Font Change (line 806)

**BEFORE:**
```css
.post-title {
  font-family: heliotrope-t3, sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

**AFTER:**
```css
.post-title {
  font-family: heliotrope-caps, sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: lowercase;
  letter-spacing: 0.05em;
}
```

**Changes:**
- Font: heliotrope-t3 → heliotrope-caps ✅
- Transform: uppercase → lowercase ✅

### 2. Reduced Image Gap (line 753)

**BEFORE:**
```css
.post-container {
  gap: 1rem;
}
```

**AFTER:**
```css
.post-container {
  gap: 0.5rem;
}
```

**Changes:**
- Gap reduced by 50% (1rem → 0.5rem) ✅

## Visual Impact

- Post titles on blog home now use heliotrope-caps (small caps font)
- Titles are lowercase for subtlety
- Images are closer to titles, creating tighter layout
- More compact, refined appearance matching Daniel's aesthetic

## Location

File: cms/.vitepress/theme/components/BlogHome.vue
Lines: 753, 806-821
