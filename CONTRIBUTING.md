# Contributing to AI Study Buddy 🎓

Thank you for your interest in contributing to AI Study Buddy! We welcome pull requests for bug fixes, new features, educational content, and new learning games.

## Development Workflow
1. Fork the repository and create a feature branch (`git checkout -b feature/amazing-feature`).
2. Follow clean code practices and run tests before committing:
   ```bash
   python -m pytest backend/tests
   cd frontend && npm run build
   ```
3. Commit your changes with descriptive messages:
   ```bash
   git commit -m "feat(games): add new game mode"
   ```
4. Push to your branch and open a Pull Request.

## Code Standards
- Backend: Follow PEP 8 guidelines and use Pydantic models for request/response validation.
- Frontend: Use modern React functional components with Tailwind CSS utility classes.
- Security: Never commit API keys or secrets.
