import {persist} from "zustand/middleware";
import {create} from "zustand";
import {Session} from "../types/Session.ts";
import {v4 as uuidv4} from "uuid";

export type SessionStore = {
  sessions: Session[];
  addSession: (session: Session) => void;
  updateSession: (session: Session) => void;
  newSession: (groupId: string, name: string) => string;
  getSession: (sessionId: string) => Session | undefined;
  removeSession: (sessionId: string) => void;
}

export const useSessionStore = create<SessionStore>()(
  persist((set, get) => ({
    sessions: [],
    addSession: (session) => set(() => ({sessions: [...get().sessions, session]})),
    updateSession: (session) => {
      set((state) => ({
        sessions: [...state.sessions.filter(s => s.id !== session.id), session]
      }));
    },
    newSession: (groupId, name) => {
      const newSession: Session = {
        id: uuidv4(), // Generate a unique sessionId
        name,
        groupId,
        participants: [],
        turn: 1,
        activeParticipant: null,
      };
      set((state) => ({ sessions: [...state.sessions, newSession] }));
      return newSession.id;
    },
    getSession: (sessionId) => {
      const sessions = get().sessions
      if(!sessions) return;
      const groupIndex = sessions.findIndex(g => g.id === sessionId);
      return sessions[groupIndex]
    },
    removeSession: (sessionId) => {
      set((state) => ({ sessions: state.sessions.filter(s => s.id !== sessionId) }));
    }
  }),{name: "session-store"}))
