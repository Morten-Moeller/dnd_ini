import { GroupFields } from "./GroupFields.ts";
import { ICharacter } from "./ICharacter.ts";

export interface IGroup {
  [GroupFields.GroupName]: string;
  [GroupFields.Characters]: ICharacter[];
}
