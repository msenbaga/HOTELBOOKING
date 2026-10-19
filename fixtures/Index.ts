import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ReservationPage } from '../pages/ReservationPage';
import { addDays, iso } from '../utils/Dates';
import { ApiMock } from '../data/Apimock';
import { ROOM_WITH_TV, ROOM_WITHOUT_TV } from '../data/Rooms';

interface Stay {
  checkin: string;
  checkout: string;
  nights: number;
}

interface Fixtures {
  homePage: HomePage;
  reservationPage: ReservationPage;
  stay: Stay;
  api: ApiMock;
}

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  reservationPage: async ({ page }, use) => {
    await use(new ReservationPage(page));
  },

  // Expected dates for a 2 night stay starting today
  stay: async ({}, use) => {
    const today = new Date();
    await use({ checkin: iso(today), checkout: iso(addDays(today, 2)), nights: 2 });
  },

  // Mocked API, installed before the test body runs. Tests opt in by asking for `api`.
  api: async ({ page }, use) => {
    const api = new ApiMock(page, [ROOM_WITH_TV, ROOM_WITHOUT_TV]);
    await api.install();
    await use(api);
    if (api.unmockedRequests.length > 0) {
      console.warn('API calls that were NOT mocked:', [...new Set(api.unmockedRequests)]);
    }
  },
});

export { Page, expect } from '@playwright/test';