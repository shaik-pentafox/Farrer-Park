import { create } from "zustand";
import { persist } from "zustand/middleware";

let convCounter = 1;

export const useChatStore = create(
  persist(
    (set, get) => ({
      conversations: [],

      // create a new conversation with auto label + id
      addConversation: (label) => {
        const newConv = {
          id: convCounter++,
          label: label || `Conversation ${convCounter - 1}`,
          messages: [],
        };
        set((state) => ({
          conversations: [...state.conversations, newConv],
        }));
        return newConv.id; // return id so caller can use
      },

      // add message to a conversation
      addMessage: (convId, message) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === convId ? { ...c, messages: [...c.messages, message] } : c
          ),
        })),

      // get a single conversation
      getConversation: (convId) =>
        get().conversations.find((c) => c.id === convId),

      // update label
      updateLabel: (convId, newLabel) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === convId ? { ...c, label: newLabel } : c
          ),
        })),

      // delete conversation
      deleteConversation: (convId) =>
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== convId),
        })),

      // get only labels + ids (for sidebar, dropdown etc.)
      getConversationList: () =>
        get().conversations.map((c) => ({ id: c.id, label: c.label })),
    }),
    {
      name: "chat-storage", // key in localStorage
    }
  )
);