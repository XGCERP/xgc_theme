# XGC Theme Tests

This directory contains tests for the XGC Theme application.

## Directory Structure

- **unit/**: Unit tests for specific functionality and edge cases
  - Theme registration tests
  - CSS variable tests
  - Component style tests
  - JavaScript initialization tests

- **property/**: Property-based tests for universal correctness properties
  - CSS variable completeness tests
  - Brand color contrast compliance tests
  - Component consistency tests
  - Responsive behavior tests
  - Typography hierarchy tests

- **visual/**: Visual regression tests
  - Desk interface screenshots
  - Website interface screenshots
  - Theme variant comparisons
  - Responsive breakpoint tests

## Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run property tests only
npm run test:property

# Run visual regression tests
npm run test:visual
```

## Test Requirements

- All property-based tests must run minimum 100 iterations
- Each property test must reference its design document property number
- Tests must validate requirements specified in the design document
