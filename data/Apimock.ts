import { Page, Route } from '@playwright/test';
import { MockRoom } from '../data/Rooms';
import { mockBranding } from './Branding';

export interface BookingPayload {
  roomid: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
}

export interface CreatedBooking {
  bookingid: number;
  roomid: number;
  firstname: string;
  lastname: string;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
}

/**
 * Replaces the site's API in this browser only, so backend data is never touched.
 * Anything not mocked is passed through to the real server and recorded in unmockedRequests.
 */
export class ApiMock {
  readonly createdBookings: CreatedBooking[] = [];
  readonly unmockedRequests: string[] = [];
  private nextBookingId = 1;

  constructor(
    private readonly page: Page,
    readonly rooms: MockRoom[],
  ) {}

  async install(): Promise<void> {
    await this.page.route('**/api/**', (route) => this.handle(route));
  }

  private async handle(route: Route): Promise<void> {
    const request = route.request();
    const method = request.method();
    const path = new URL(request.url()).pathname.replace(/^.*\/api/, '');

    // GET /api/room and GET /api/room?checkin=...&checkout=...
    if (method === 'GET' && path === '/room') {
      return route.fulfill({ json: { rooms: this.rooms } });
    }

    // GET /api/room/{id}
    const roomMatch = path.match(/^\/room\/(\d+)$/);
    if (method === 'GET' && roomMatch) {
      const room = this.rooms.find((r) => r.roomid === Number(roomMatch[1]));
      return room ? route.fulfill({ json: room }) : route.fulfill({ status: 404, json: {} });
    }

    // GET /api/booking/summary?roomid=...  (dates already booked for a room)
    if (method === 'GET' && path === '/booking/summary') {
      return route.fulfill({ json: { bookings: [] } });
    }

    // POST /api/booking
    if (method === 'POST' && path === '/booking') {
      return this.createBooking(route, request.postDataJSON() as BookingPayload);
    }
    // GET /api/branding
    if (method === 'GET' && path === '/branding') {
      return route.fulfill({ json: mockBranding });
    }
    // GET /api/report/room/{id}
    const reportMatch = path.match(/^\/report\/room\/(\d+)$/);
    if (method === 'GET' && reportMatch) {
      return route.fulfill({
        json: {
          report: [
            {
              end: "2026-02-05",
              start: "2026-02-01",
              title: "Unavailable"
            }
          ]
        }
      });
    }
    // Not mocked yet: let it through and remember it
    this.unmockedRequests.push(`${method} ${path}`);
    return route.continue();
  }

  private async createBooking(route: Route, payload: BookingPayload): Promise<void> {
    // Mirrors the server's name length rules (CONFIRM the exact messages against the real API)
    const errors: string[] = [];
    if (payload.firstname.length < 3 || payload.firstname.length > 18) {
      errors.push('size must be between 3 and 18');
    }
    if (payload.lastname.length < 3 || payload.lastname.length > 30) {
      errors.push('size must be between 3 and 30');
    }
    if (errors.length > 0) {
      return route.fulfill({ status: 400, json: { errors } });
    }

    const booking: CreatedBooking = {
      bookingid: this.nextBookingId++,
      roomid: payload.roomid,
      firstname: payload.firstname,
      lastname: payload.lastname,
      depositpaid: payload.depositpaid,
      bookingdates: payload.bookingdates,
    };
    this.createdBookings.push(booking);
    return route.fulfill({ status: 201, json: booking });
  }
}