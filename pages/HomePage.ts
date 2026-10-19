import { Locator, Page } from '@playwright/test';
import { RoomCard } from '../components/RoomCard';
import { isoToDmy } from '../utils/Dates';

export class HomePage {
    private readonly roomCards: Locator;
    private readonly bookNow: Locator;
    private readonly checkInInput: Locator;
    private readonly checkOutInput: Locator;
    private readonly checkAvailabilityButton: Locator;

    constructor(private readonly page: Page) {
        this.roomCards = page.locator('div.card.h-100.shadow-sm.room-card');
        this.bookNow = this.roomCards.first().getByRole('link', { name: /book now/i });
        const dateField = (label: string) =>
            page.locator('div.col-md-6').filter({ hasText: label }).locator('input.form-control');
        this.checkInInput = dateField('Check In');
        this.checkOutInput = dateField('Check Out');
        this.checkAvailabilityButton = page.getByRole('button', { name: 'Check Availability' });
    }

    async goto(): Promise<void> {
        await this.page.goto('/');
    }

    /** Replace the rooms response in this browser only. Backend data is never touched. */
    async mockRooms(response: unknown): Promise<void> {
        await this.page.route('**/api/room', (route) => route.fulfill({ json: response }));
    }

    /** Dates are passed as YYYY-MM-DD and typed in the format the inputs use (DD/MM/YYYY). */
    async checkAvailability(checkin: string, checkout: string): Promise<void> {
        await this.checkInInput.fill(isoToDmy(checkin));
        await this.checkInInput.press('Tab');
        await this.checkOutInput.fill(isoToDmy(checkout));
        await this.checkOutInput.press('Tab');
        await this.checkAvailabilityButton.click();
    }

    /** All room cards, for count assertions in the tests. */
    get cards(): Locator {
        return this.roomCards;
    }

    roomCard(index: number): RoomCard {
        return new RoomCard(this.roomCards.nth(index));
    }
    get firstRoomBookLink(): Locator {
        return this.roomCards.first().getByRole('link', { name: /book now/i });
    }

    async bookFirstRoom(): Promise<void> {
        await this.firstRoomBookLink.click();
    }
}