export interface GuestDetails {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}

export const validGuest: GuestDetails = {
  firstname: 'Senbaga',
  lastname: 'Muthiah',
  email: 'qa.tester@example.com',
  phone: '02012345678',
};

// Names below the minimum length, everything else valid
export const shortNameGuest: GuestDetails = {
  ...validGuest,
  firstname: 'Jo',
  lastname: 'Li',
};