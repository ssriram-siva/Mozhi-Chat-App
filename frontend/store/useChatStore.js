import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstanace } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore.js";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,

  // GET USERS
  getUsers: async () => {
    set({ isUserLoading: true });

    try {
      const res = await axiosInstanace.get("/messages/users");

      set({ users: res.data || [] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching users");
    } finally {
      set({ isUserLoading: false });
    }
  },

  // GET MESSAGES
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstanace.get(`/messages/${userId}`);

      console.log("GET MESSAGES RESPONSE:", res.data);

      set({
        messages: res.data.messages || res.data.data || res.data || [],
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching messages");
      set({ messages: [] });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // SEND MESSAGE
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    try {
      const res = await axiosInstanace.post(
        `/messages/send/${selectedUser._id}`,
        messageData,
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      if (
        newMessage.senderId !== selectedUser._id &&
        newMessage.receiverId !== selectedUser._id
      )
        return;

      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
  },

  // SELECT USER
  setSelectedUser: (selectedUser) =>
    set({
      selectedUser,
      messages: [], // 👈 important: reset chat when switching user
    }),
}));
