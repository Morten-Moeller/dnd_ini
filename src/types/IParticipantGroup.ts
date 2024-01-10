import { IParticipant } from "./IParticipant.ts";

export interface IParticipantGroup {
  participants: IParticipant[];
  groupName: string;
}
