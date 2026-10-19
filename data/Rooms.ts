export interface MockRoom {
  roomid: number;
  roomName: string;
  type: string;
  accessible: boolean;
  image: string;
  description: string;
  features: string[];
  roomPrice: number;
}

export const ROOM_WITH_TV: MockRoom = {
  roomid: 901,
  roomName: '901',
  type: 'Double',
  accessible: true,
  image: '/images/room2.jpg',
  description: 'Room with TV',
  features: ['WiFi', 'TV', 'Safe'],
  roomPrice: 120,
};

export const ROOM_WITHOUT_TV: MockRoom = {
  ...ROOM_WITH_TV,
  roomid: 902,
  roomName: '902',
  description: 'Room without TV',
  features: ['WiFi', 'Safe'],
  roomPrice: 100,
};

export const mockRoomsResponse = { rooms: [ROOM_WITH_TV, ROOM_WITHOUT_TV] };