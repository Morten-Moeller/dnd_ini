import { Participant } from "../types/Participant";

import { create, StateCreator } from "zustand";
import { useGroupStore } from "./useGroupStore";
import { convertCharactersToParticipants } from "../utils/convertCharactersToParticipants";
import { useSessionStore } from "./useSessionStore";
import { message } from "antd";

type ActiveSessionStore = {
  sessionId: string | null;
  loadSession: (sessionId: string) => void;
  saveSession: () => void;
  resetSession: () => void;
  groupId: string;
  setGroupId: (groupId: string) => void;

  participants: Participant[];
  addParticipant: (participant: Participant) => void;
  removeParticipant: (participantId: string) => void;
  updateParticipant: (participant: Participant) => void;
  updateParticipantInitiative: (participantId: string, ini: number) => void;
  updateParticipantDefeated: (participantId: string, isDefeated: boolean) => void;
  toast: (text: string) => void;

  activeParticipant: string | null;
  setActiveParticipant: (participantId: string) => void;
  nextActiveParticipant: () => void;
  previousActiveParticipant: () => void;

  turn: number;
  setTurn: (turn: number) => void;
  incrementTurn: () => void;
  decrementTurn: () => void;
  resetTurn: () => void;

  name: string;
};

function saveSessionMiddleware<T extends ActiveSessionStore>(config: StateCreator<T>): StateCreator<T> {
  return (set, get, api) => config((args) => {
    if (typeof args === 'function') {
      set((previousState) => {
        const result = args(previousState);
        get().saveSession();
        return result;
      });
    } else {
      set(args);
      get().saveSession();
    }
  }, get, api);
}
function participantSort(a: Participant, b: Participant) {
  const iniA = a.ini || 0;
  const iniB = b.ini || 0;

  return iniB - iniA;
}

const initialState: ActiveSessionStore = {
  sessionId: null,
  loadSession: () => {},
  saveSession: () => {},
  resetSession: () => {},
  groupId: "",
  setGroupId: () => {},

  participants: [],
  addParticipant: () => {},
  removeParticipant: () => {},
  updateParticipant: () => {},
  updateParticipantInitiative: () => {},
  updateParticipantDefeated: () => {},
  toast: () => {},

  activeParticipant: null,
  setActiveParticipant: () => {},
  nextActiveParticipant: () => {},
  previousActiveParticipant: () => {},

  turn: 1,
  setTurn: () => {},
  incrementTurn: () => {},
  decrementTurn: () => {},
  resetTurn: () => {},

  name: "",
};

export const useActiveSessionStore = create<ActiveSessionStore>(saveSessionMiddleware((set, get) => ({
  ...initialState,
  loadSession: (sessionId: string) => {
    const session = useSessionStore.getState().getSession(sessionId);
    if (!session) {
      console.error("Session not found");
      return;
    }

    set({
      name: session.name,
      sessionId: session.id,
      groupId: session.groupId,
      participants: session.participants,
      activeParticipant: session.activeParticipant,
      turn: session.turn,
    });

    // if there are no participants in the session, set the groupId and initialize the participants
    if (get().participants.length === 0 ) {
      get().setGroupId(session.groupId);
    }

  },
  saveSession: () => {
    const { sessionId, groupId, participants, turn, activeParticipant, name } = get();
    if (!sessionId) {
      console.error("No active session to save");
      return;
    }

    const sessionToSave = {
      id: sessionId,
      name,
      groupId,
      participants,
      turn,
      activeParticipant,
    };

    useSessionStore.getState().updateSession(sessionToSave);
  },
  resetSession: () => {
    const sessionId = get().sessionId
    const groupId = get().groupId
    const participants = get().participants.filter(p => p.isCharacter)
    const newSession = {
      id: sessionId,
      groupId,
      participants,
      turn: 1,
      activeParticipant: null,
    }
    set(newSession);
  },
  setGroupId: (groupId) => {
    set({ groupId });
    const group = useGroupStore.getState().getGroup(groupId);
    if (!group) return console.log("Group not found");
    const participants = convertCharactersToParticipants(group.characters).sort(participantSort);
    set((state) => ({ participants: [...state.participants, ...participants] }));
  },

  addParticipant: (participant) => {
    set((state) => {

      let newParticipant = { ...participant, ini: participant.ini ?? 0 };
      let newName = participant.name;
      const sameNameParticipants = state.participants.filter(p => p.name.startsWith(newName));

      if (sameNameParticipants.length > 0) {
        const numbers = sameNameParticipants.map(p => {
          const match = p.name.match(/(\d+)$/);
          return match ? parseInt(match[1], 10) : 0;
        });
        let maxNumber = Math.max(...numbers) ;
        const hasOriginalName = sameNameParticipants.some(p => p.name === newName);

        if (hasOriginalName && maxNumber === 0) {
          maxNumber = 1;
        }

        newName = `${newName} ${maxNumber + 1}`;
      }
      newParticipant = { ...newParticipant, name: newName };
      console.log('test')
      get().toast(`Participant added: ${newName}`);
      return {
        participants: [...state.participants, newParticipant].sort(participantSort)
      };
    });
  },
  toast: (text) => {
    message.info(text);
  },
  removeParticipant: (participantId) => set((state) => ({ participants: state.participants.filter((p) => p.id !== participantId) })),
  updateParticipant: (participant) => set((state) => ({participants: state.participants.map((p) => p.id === participant.id ? participant : p)})),
  updateParticipantInitiative: (participantId, ini) =>
    set((state) => ({
        participants: state.participants
          .map((p) => p.id === participantId ? { ...p, ini } : p)
          .sort(participantSort)
      })),
  updateParticipantDefeated: (participantId, isDefeated) =>
    set((state) => ({
      participants: state.participants
        .map((p) => p.id === participantId ? { ...p, isDefeated } : p)
        .sort(participantSort)
    })),

  setActiveParticipant: (participantId) => set({ activeParticipant: participantId }),
  nextActiveParticipant: () => {
    const { participants, activeParticipant } = get();
    const currentParticipantIndex = participants.findIndex(p => p.id === activeParticipant);
    let nextActiveIndex = -1;

    for (let i = 1; i <= participants.length; i++) {
      const index = (currentParticipantIndex + i) % participants.length;
      if (!participants[index].isDefeated) {
        nextActiveIndex = index;
        break;
      }
    }

    if (nextActiveIndex !== -1) {
      set({ activeParticipant: participants[nextActiveIndex].id });
    }

    if (nextActiveIndex <= currentParticipantIndex) {
      set((state) => ({ turn: state.turn + 1 }));
    }
  },
  previousActiveParticipant: () => {
    const { participants, activeParticipant, turn } = get();
    const currentParticipantIndex = participants.findIndex(p => p.id === activeParticipant);
    let previousActiveIndex = -1;

    for (let i = 1; i <= participants.length; i++) {
      const index = (currentParticipantIndex - i + participants.length) % participants.length;
      if (!participants[index].isDefeated) {
        previousActiveIndex = index;
        break;
      }
    }

    if (previousActiveIndex !== -1) {
      set({ activeParticipant: participants[previousActiveIndex].id });
    }

    if (previousActiveIndex >= currentParticipantIndex || currentParticipantIndex === 0) {
      set({ turn: turn - 1 });
    }
  },

  setTurn: (turn) => set({ turn }),
  incrementTurn: () => set((state) => ({ turn: state.turn + 1 })),
  decrementTurn: () => set((state) => ({ turn: state.turn - 1 })),
  resetTurn: () => set({ turn: 1 }),
})));
