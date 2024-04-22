import {Group} from "@/types/Group";
import {create} from "zustand";
import {persist} from "zustand/middleware";

type GroupStore = {
  groups: Group[];
  addGroup: (group: Group) => void;
  getGroup: (groupId: string) => Group;
  removeGroup: (groupId: string) => void;
}

export const useGroupStore = create<GroupStore>()(
  persist(
    (set, get) => ({
      groups: [],
      addGroup: (group) => set(() => ({groups: [...get().groups, group]})),
      getGroup: (groupId) => {
        const groups = get().groups
        const groupIndex = groups.findIndex(g => g.id === groupId);
        return groups[groupIndex]
},
      removeGroup: (groupId) => {
        set((state) => ({ groups: state.groups.filter(g => g.id !== groupId) }));
      }
    }), {
      name: "group-store"
    }
  )
)
