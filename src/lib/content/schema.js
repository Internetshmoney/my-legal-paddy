/**
 * Schema validation for markdown posts
 * Validates only the metadata we currently use
 */

const POST_SCHEMA = {
  title: { type: 'string', required: true },
  slug: { type: 'string', required: true },
  excerpt: { type: 'string', required: true },
  date: { type: 'string', required: true },
  cover: { type: 'string', required: true },
  featured: { type: 'boolean', required: false },
  published: { type: 'boolean', required: false },
};

/**
 * Validate post metadata against schema
 * @param {Object} metadata - Parsed frontmatter metadata
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validatePost(metadata) {
  const errors = [];

  // Check required fields
  for (const [field, config] of Object.entries(POST_SCHEMA)) {
    if (config.required && !metadata.hasOwnProperty(field)) {
      errors.push(`Missing required field: "${field}"`);
      continue;
    }

    if (metadata.hasOwnProperty(field)) {
      const value = metadata[field];
      const expectedType = config.type;

      // Type validation
      if (expectedType === 'string' && typeof value !== 'string') {
        errors.push(
          `Field "${field}" must be a string, got ${typeof value}`
        );
      } else if (expectedType === 'boolean' && typeof value !== 'boolean') {
        errors.push(
          `Field "${field}" must be a boolean, got ${typeof value}`
        );
      }

      // Specific field validations
      if (field === 'date') {
        if (value && isNaN(Date.parse(value))) {
          errors.push(`Field "date" must be a valid date, got "${value}"`);
        }
      }

      if (field === 'slug') {
        if (value && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
          errors.push(
            `Field "slug" must be lowercase alphanumeric with hyphens, got "${value}"`
          );
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get schema documentation
 * @returns {Object} Schema definition
 */
export function getSchema() {
  return POST_SCHEMA;
}
