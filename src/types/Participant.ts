import {Status} from "./Status.ts";

export type Participant = {
  // The id of the participant equals the character id if the participant is a character
  id: string,
  name: string,
  ini: number,
  isDefeated: boolean,
  status?: Status,
  dex?: number,
  isCharacter?: boolean,
}
