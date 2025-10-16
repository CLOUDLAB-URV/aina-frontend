import { ref } from "vue";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const signedIn = ref(false);
  const username = ref("");

  return { signedIn, username };
});
