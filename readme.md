# Playwright Test Automation Suite - Hotel Booking Portal

An end-to-end (E2E) testing framework built with [Playwright](https://playwright.dev/) and TypeScript for testing the Hotel Booking web application. This suite utilizes API mocking to isolate test execution from backend dependencies, ensuring consistent, fast, and repeatable tests.

---

## 🛠️ Tech Stack & Architecture

- **Test Framework:** Playwright (TypeScript)
- **Design Pattern:** Page Object Model (POM) with Page Components
- **Mocking Strategy:** Network route interception via custom Playwright fixtures

```
├── components/          # Reusable UI component wrappers
│   └── RoomCard.ts      # Component object for individual room listings
├── data/                # Static data & types for fixtures & mocks
│   ├── Branding.ts      # Mock dataset for hotel branding details
│   ├── Guests.ts        # Sample guest data (valid & invalid)
│   ├── Rooms.ts         # Mock room fixtures
│   └── Apimock.ts       # Central network mocking class
├── fixtures/            # Custom Playwright test fixtures
│   └── Index.ts         # Extended `test` object providing pages & mocks
├── pages/               # Page Object Models (POM)
│   ├── HomePage.ts      # Page actions for the main homepage
│   └── ReservationPage.ts # Actions for room calendar & booking form
├── tests/               # Test suites
│   └── Booking.spec.ts  # E2E room search & booking validation tests
└── utils/               # Utility helper functions
    └── Dates.ts         # Date formatting & calculation helpers
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/msenbaga/HOTELBOOKING.git
   cd HOTELBOOKING
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright Browsers:**
   ```bash
   npx playwright install
   ```

---

## 🧪 Running Tests

- **Run all tests in headless mode:**
  ```bash
  npx playwright test
  ```

- **Run tests with UI mode (Interactive execution):**
  ```bash
  npx playwright test --ui
  ```

- **Run a specific test file:**
  ```bash
  npx playwright test specs/Booking.spec.ts
  ```

- **Debug tests with Playwright Inspector:**
  ```bash
  npx playwright test --debug
  ```

- **View HTML execution report:**
  ```bash
  npx playwright show-report
  ```

---

## 📡 API Mocking Overview

ApiMock is installed by the api fixture. A test gets the mock by asking for api, and it is installed before the test body runs.

### Key Mocked Endpoints

| Endpoint | Method | Response Source / Logic |
| :--- | :--- | :--- |
| `/api/branding` | `GET` | Returns hotel branding data (`mockBranding`). |
| `/api/room` | `GET` | Returns list of configured test rooms. |
| `/api/room/{id}` | `GET` | Returns details for a specific room. |
| `/api/report/room/{id}` | `GET` | Returns unavailable booking date ranges. |
| `/api/booking/summary` | `GET` | Returns existing booking summaries. |
| `/api/booking` | `POST` | Validates payload rules (e.g., name lengths) and stores simulated bookings. |

### Handling Unmocked Requests

Any API call matching `**/api/**` that does not have an explicit rule in `ApiMock` is passed through to the actual server (`route.continue()`) and logged in `unmockedRequests`. 

Upon test teardown, a console warning will display any unmocked API endpoints detected during execution:

```
API calls that were NOT mocked: [ 'GET /example' ]
```

---

## ✍️ Writing New Tests

Tests leverage custom Playwright fixtures defined in `fixtures/Index.ts`. Simply import `test` and `expect` from the fixtures module to gain access to page objects and auto-installed API mocks.

```typescript
import { test, expect } from '../fixtures/Index';

test('example test', async ({ homePage, reservationPage, stay, api }) => {
  await homePage.goto();
  await homePage.checkAvailability(stay.checkin, stay.checkout);
  // Perform assertions...
});
```