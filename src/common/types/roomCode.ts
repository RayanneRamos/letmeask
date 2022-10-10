export type RoomCodeType = {
  code: string;
}

export type RoomParams = {
  id: string;
}

export type RoomListProps = {
  roomId: string;
  title: string;
  roomIsOpen?: boolean;
}