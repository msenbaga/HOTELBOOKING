import { expect, Locator, Page } from '@playwright/test';
import { GuestDetails } from '../data/Guests';

const TODAY_CLASS = 'rbc-today';

export class ReservationPage {
  // CONFIRM these with `npm run codegen` if the site differs
  private readonly calendarDays: Locator;
  private readonly reserveButton: Locator;
  private readonly firstname: Locator;
  private readonly lastname: Locator;
  private readonly email: Locator;
  private readonly phone: Locator;

  readonly firstnameLengthError: Locator;
  readonly lastnameLengthError: Locator;
  readonly bookingConfirmed: Locator;

  constructor(private readonly page: Page) {
    this.calendarDays = page.locator('.rbc-day-bg');
    this.reserveButton = page.getByRole('button', { name: 'Reserve Now' });
    this.firstname = page.getByPlaceholder('Firstname');
    this.lastname = page.getByPlaceholder('Lastname');
    this.email = page.getByPlaceholder('Email');
    this.phone = page.getByPlaceholder('Phone');

    this.firstnameLengthError = page.getByText(/between\s+3\s+and\s+18/i);
    this.lastnameLengthError = page.getByText(/between\s+3\s+and\s+30/i);
    this.bookingConfirmed = page.getByText(/booking confirmed/i);
  }

  /** Drag across the calendar starting today. 2 nights means today,tomorrow and day after are selected. */
  async selectNightsFromToday(nights: number): Promise<void> {
    await expect(this.calendarDays.first()).toBeVisible();

    const todayIndex = await this.calendarDays.evaluateAll(
      (els, cls) => els.findIndex((el) => el.classList.contains(cls)),
      TODAY_CLASS,
    );
    expect(todayIndex, 'today should be visible in the calendar').toBeGreaterThanOrEqual(0);

    const start = await this.calendarDays.nth(todayIndex).boundingBox();
    const end = await this.calendarDays.nth(todayIndex + nights).boundingBox();
    if (!start || !end) throw new Error('Could not find the calendar cells to select');

    await this.page.mouse.move(start.x + start.width / 2, start.y + start.height / 2);
    await this.page.mouse.down();
    await this.page.mouse.move(end.x + end.width / 2, end.y + end.height / 2, { steps: 10 });
    await this.page.mouse.up();
  }

  async openBookingForm(): Promise<void> {
    await this.reserveButton.click();
  }

  async fillGuestDetails(guest: GuestDetails): Promise<void> {
    await this.firstname.fill(guest.firstname);
    await this.lastname.fill(guest.lastname);
    await this.email.fill(guest.email);
    await this.phone.fill(guest.phone);
  }

  async submit(): Promise<void> {
    await this.reserveButton.click();
  }

  confirmedDates(checkin: string, checkout: string): Locator {
    return this.page.getByText(`${checkin} - ${checkout}`);
  }
}