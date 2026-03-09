import Room from "./room";

export interface IRoomList {
  getRooms: () => Room[];
  addRoom: (room: Room) => Promise<void>;
  getRoom: (roomId: string) => Room | null;
}

class RoomList implements IRoomList {
  private rooms: Room[];

  constructor() {
    this.rooms = [];
  }

  getRooms(): Room[] {
    return [...this.rooms];
  }

  async addRoom(room: Room): Promise<void> {
    this.rooms = [...this.rooms, room];
  }

  getRoom(roomId: string): Room | null {
    return this.rooms.find((room) => room.roomId === roomId) || null;
  }
}

// Singleton pattern
const globalForRoomList = global as unknown as { roomList?: RoomList };

const roomList = globalForRoomList.roomList ?? new RoomList();

if (!globalForRoomList.roomList) {
  globalForRoomList.roomList = roomList;
}

export default roomList;
