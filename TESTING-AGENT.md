# Testing Agent Guidelines for sp-26-cartworkshop

## Project Structure
- **Backend Project**: `backend/` (C# ASP.NET Core with EF Core, SQLite)
- **Backend Tests**: `backend.Tests/` (xUnit, FluentValidation.TestHelper, Moq, EF Core InMemory)
- **Frontend Project**: `frontend/` (React + TypeScript + Vite)
- **Frontend Tests**: `frontend/src/**/*.test.*` (Vitest, React Testing Library)

## Test Commands
- **Backend**: `dotnet test backend.Tests/backend.Tests.csproj`
- **Frontend**: `cd frontend && npm run test`
- **E2E**: `npx playwright test` (if configured)

## Pre-Test Inspection Files
Before generating tests, inspect these key files to understand logic and dependencies:
- Backend: `backend/Controllers/CartController.cs`, `backend/Validators/AddCartItemRequestValidator.cs`, `backend/Validators/UpdateCartItemRequestValidator.cs`, `backend/Models/Cart.cs`, `backend/Models/CartItem.cs`, `backend/DTOs/AddCartItemRequest.cs`, `backend/DTOs/UpdateCartItemRequest.cs`
- Frontend: `frontend/src/reducers/cartReducer.ts`, `frontend/src/context/CartContext.tsx`, `frontend/src/components/AddToCartButton.tsx`, `frontend/src/types/cart.ts`

## Assertion Style
Use strong assertions that verify exact behavior. Do not weaken assertions to make tests pass—fix the code or test logic instead.

## Rules
- Do not invent files, endpoints, claims, or helpers that do not exist in the repo.
- Prefer existing reducers, validators, controllers, context, and components for tests.
- Always run tests after generating them to validate.
- If a test fails, fix the test or underlying code honestly without weakening assertions.