import { Participant } from "../types/Participant.ts";
import { Character } from "../types/Character.ts";

export const convertCharactersToParticipants = (characters: Character[]): Participant[] => {
  return characters.map((character) => ({
    id: character.id,
    name: character.name,
    ini: 0,
    isDefeated: false,
    dex: character.dex,
    isCharacter: true,
  }));
}
