# AI Usage Log

## Project
sp-26-cartworkshop

## Workshop Context
This log documents how GitHub Copilot was used during the AI-Assisted Security, QA & Testing workshop. The goal was to use Copilot deliberately for testing, security review, and documentation, while reviewing every diff and verifying results by actually running tests.

## AI Tools Used
- GitHub Copilot Chat (Agent mode)
- Reusable instruction file: `TESTING-AGENT.md`

## Reusable Testing Agent
I created a custom `TESTING-AGENT.md` for this repo. It included:
- backend test command
- frontend test command
- E2E command
- real project paths
- files to inspect before generating tests
- a rule that Copilot must not weaken assertions to make tests pass

## Example Prompt Used
One prompt I used with my testing agent was:

> Using TESTING-AGENT.md, now create exactly 1 backend integration test.
> Requirements:
> 1. Use the real backend and backend.Tests projects in this repo.
> 2. Use WebApplicationFactory<Program> or the closest valid integration test setup.
> 3. Do not invent endpoints or auth flows that do not exist.
> 4. Prefer a real existing cart endpoint.
> 5. Keep the diff minimal.
> 6. Run dotnet test after creating it and show me the result.
> 7. Do not modify frontend files.
> 8. Do not weaken assertions.

## How AI Helped
Copilot helped with:
- setting up frontend test infrastructure with Vitest and React Testing Library
- generating frontend tests for:
  - `cartReducer`
  - `CartContext`
  - `AddToCartButton`
- generating backend validator tests
- generating one backend integration test with `WebApplicationFactory<Program>`
- reviewing auth/security configuration
- identifying a real security issue in `CartController`
- helping move JWT signing key usage to User Secrets instead of committed config
- drafting documentation structure for testing evidence

## What Copilot Got Wrong
Copilot made several mistakes that I had to catch and correct:

### 1. Frontend context test issue
A `CartContext` test initially failed because it used direct `button.click()` behavior and did not properly account for React state updates. I caught this because the test failed and React reported an update not wrapped correctly. I corrected it by switching to the proper user interaction approach and rerunning the test.

### 2. Backend integration test database provider issue
The first backend integration test setup failed because both SQLite and EF Core InMemory providers were registered. I caught this from the `dotnet test` error output and had Copilot revise the setup.

### 3. Duplicate seeded product issue
The integration test then failed because the test tried to insert a product that was already seeded, causing a SQLite unique constraint failure on `Products.Id`. I caught this from the test output and had Copilot change the test to use existing seeded data instead of duplicating setup.

### 4. Incomplete auth fix
Copilot first suggested adding `[Authorize]` and removing the hardcoded user ID without adding the minimal JWT setup. I rejected that partial fix because it would have broken functionality without giving the app a usable authentication pipeline.

### 5. Secret storage issue
Copilot initially placed `Jwt:Key` in `appsettings.Development.json`. I rejected that because the workshop specifically required the signing key to come from User Secrets or environment configuration rather than committed config.

## Review Standard I Followed
I did not accept Copilot output blindly. I checked whether it:
- invented files, endpoints, or claims
- weakened assertions
- introduced breaking changes without the minimum required supporting setup
- stored secrets in committed configuration
- actually passed the required test commands after changes

## Final Outcome
By the end of this session, Copilot-assisted work contributed to:
- frontend tests passing
- backend unit and integration tests passing
- a real security fix for hardcoded cart user identity
- JWT key moved to User Secrets
- a manual unauthorized request returning `401 Unauthorized`

## Notes
I manually reviewed diffs before keeping changes and used actual test runs as the source of truth.