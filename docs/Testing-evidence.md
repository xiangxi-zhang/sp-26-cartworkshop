# Testing Evidence

## Workshop Goals Covered
This file records testing and QA/security evidence for the workshop. The workshop required:
- a reusable testing agent
- backend unit and integration tests
- frontend tests
- one real security or QA fix
- updated AI usage notes and testing evidence
- honest E2E documentation if blocked

## 1. Testing Agent Evidence
Created:
- `TESTING-AGENT.md`

Customized for this repo with:
- backend project path: `backend/`
- backend test project path: `backend.Tests/`
- frontend project path: `frontend/`
- backend test command
- frontend test command
- E2E command
- inspection targets for reducers, validators, controllers, context, and components
- strong assertion rule
- explicit rule not to weaken assertions

## 2. Backend Test Evidence
Command run:

```bash
dotnet test backend.Tests/backend.Tests.csproj