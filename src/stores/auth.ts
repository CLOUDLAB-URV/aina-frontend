import { ref } from "vue";
import { defineStore } from "pinia";
import type { Role } from "@/models";

export const useAuthStore = defineStore("auth", () => {
  const signedIn = ref(false);
  const username = ref<string>();
  const role = ref<Role>();

  return { signedIn, username, role };
});
