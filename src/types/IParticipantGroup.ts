import { IParticipant } from "./IParticipant.ts";
import { ParticipantsGroupFields } from "./ParticipantsGroupFields.ts";

export interface IParticipantGroup {
  [ParticipantsGroupFields.Participants]: IParticipant[];
  [ParticipantsGroupFields.GroupName]: string;
  [ParticipantsGroupFields.Player]: IParticipant[];
}
