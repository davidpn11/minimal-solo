declare type PlayerAvatar = {
  positionX: number;
  positionY: number;
  scale: number;
};

declare type PlayerStatus = "READY" | "NOT_READY" | "ADMIN";
declare type SessionPlayer = {
  name: string;
  hand: string[];
  position: number;
  avatar: PlayerAvatar;
  status: PlayerStatus;
};

declare type SessionPlayerWithId = SessionPlayer & ID;

declare type Player = {
  id: string;
  hand: Record<string, Card>;
};
