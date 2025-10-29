import create from 'zustand';

const useChatStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  users: [],
  setUsers: (users) => set({ users }),
  selectedUser: null,
  setSelectedUser: (id) => set({ selectedUser: id }),
}));

export default useChatStore;
