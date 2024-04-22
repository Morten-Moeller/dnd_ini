import {Participant} from "./Participant";

export type Session = {
  id: string,
  name: string,
  groupId: string,
  participants: Participant[]
  turn: number,
  activeParticipant: string | null,
}
