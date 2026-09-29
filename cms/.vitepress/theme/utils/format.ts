/**
 * Format a date string to a human-readable format
 * @param date - ISO date string
 * @returns Formatted date string or original string if parsing fails
 */
export function formatDate(date: string): string {
  try {
    const parsed = new Date(date)
    if (isNaN(parsed.getTime())) {
      console.warn('Invalid date format:', date)
      return date
    }
    // Short "24 Sep 2026" form, matching the prototype's post-list/sidebar
    // date formatting exactly (fm-date / bsl-fm-created / sm-row-age).
    return parsed.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  } catch (error) {
    console.warn('Error formatting date:', date, error)
    return date
  }
}

/**
 * Parse tags from frontmatter (can be string or array)
 * @param tags - Tags as string (pipe-separated) or array
 * @returns Array of tag strings
 */
export function parseTags(tags: string[] | string | undefined): string[] {
  if (!tags) return []
  if (Array.isArray(tags)) return tags
  if (typeof tags === 'string') {
    return tags.split('|').map(t => t.trim()).filter(Boolean)
  }
  return []
}
