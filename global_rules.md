# Global Development Standards

## Code Quality

- Follow Clean Code principles.
- Follow SOLID principles.
- Prefer readability and maintainability over premature optimization.
- Use meaningful and descriptive names for variables, methods, classes, and files.
- Avoid code duplication (DRY).
- Keep functions focused on a single responsibility.
- Prefer composition over inheritance where applicable.
- Remove dead code and unused imports.

## Security

- Never hardcode secrets, API keys, passwords, or connection strings.
- Validate and sanitize all external inputs.
- Follow the principle of least privilege.
- Use secure defaults.

## Testing

- Write tests for business-critical logic.
- Do not introduce code that breaks existing tests.
- Mock external dependencies during unit testing.

## Documentation

- Document public APIs and complex business logic.
- Add comments only when they provide value beyond self-documenting code.

## AI Behavior

- Generate production-ready code.
- Generate complete implementations, not placeholders.
- When modifying code, preserve existing functionality unless explicitly instructed otherwise.
- Prefer established patterns over experimental solutions.
- Follow the project's existing architecture and conventions.