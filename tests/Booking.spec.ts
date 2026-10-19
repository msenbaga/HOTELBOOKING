import { test, expect } from '../fixtures/Index';
import { RoomCard } from '../components/RoomCard';
import { MockRoom, mockRoomsResponse } from '../data/Rooms';
import { shortNameGuest, validGuest } from '../data/Guests';

// Expected TV icon comes from the room's features data
async function expectTvIndicator(card: RoomCard, room: MockRoom) {
  if (room.features.includes('TV')) {
    await expect(card.tvIndicator).toBeVisible();
  } else {
    await expect(card.tvIndicator).toHaveCount(0);
  }
}

test('a room without TV does not show the TV icon', async ({ homePage }) => {
  // Mocked in this browser only, so the real backend data is not changed
  await homePage.mockRooms(mockRoomsResponse);
  await homePage.goto();

  const rooms = mockRoomsResponse.rooms;
  expect(rooms.some((r) => r.features.includes('TV'))).toBe(true); // positive control exists
  expect(rooms.some((r) => !r.features.includes('TV'))).toBe(true);

  await expect(homePage.cards).toHaveCount(rooms.length);
  for (const [index, room] of rooms.entries()) {
    await expectTvIndicator(homePage.roomCard(index), room);
  }
});

test('check availability, book the first room for 2 nights and verify the booking', async ({
  api,
  homePage,
  reservationPage,
  stay,
}) => {
  const expectedRoomId = api.rooms[0].roomid;
 
  await test.step('check availability and open the first room', async () => {
    await homePage.goto();
    await homePage.checkAvailability(stay.checkin, stay.checkout);
 
    // The first card must link to the first room, carrying our dates
    await expect(homePage.firstRoomBookLink).toHaveAttribute(
      'href',
      new RegExp(`/reservation/${expectedRoomId}\\?checkin=${stay.checkin}&checkout=${stay.checkout}`),
    );
 
    await homePage.bookFirstRoom();
    await reservationPage.openBookingForm();
  });
 
  await test.step('names that are too short are rejected', async () => {
    await reservationPage.fillGuestDetails(shortNameGuest);
    await reservationPage.submit();
 
    await expect(reservationPage.firstnameLengthError).toBeVisible();
    await expect(reservationPage.lastnameLengthError).toBeVisible();
    expect(api.createdBookings, 'no booking should be created for invalid names').toHaveLength(0);
  });
 
  await test.step('submit valid details and verify the booking', async () => {
    await reservationPage.fillGuestDetails(validGuest);
    await reservationPage.submit();
 
    // What the page sent to the (mocked) server
    await expect.poll(() => api.createdBookings.length).toBe(1);
    expect(api.createdBookings[0]).toMatchObject({
      roomid: expectedRoomId,
      firstname: validGuest.firstname,
      lastname: validGuest.lastname,
      bookingdates: { checkin: stay.checkin, checkout: stay.checkout },
    });
 
    // What the user sees
    await expect(reservationPage.bookingConfirmed).toBeVisible();
    await expect(reservationPage.confirmedDates(stay.checkin, stay.checkout)).toBeVisible();
  });
});
 