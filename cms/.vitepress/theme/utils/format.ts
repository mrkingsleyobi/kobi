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
    return parsed.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
