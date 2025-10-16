import { AuthenticationApi } from "@/apis/AuthenticationApi";
import { Configuration, type ConfigurationParameters } from "@/runtime";
import { useAuthStore } from "@/stores/auth";

export async function getCurrentUser() {
  let confParam: ConfigurationParameters = {
    accessToken: () => {
      const accessToken = localStorage.getItem("accessToken");
      return `Bearer ${accessToken}`;
    },
  };

  let authStore = useAuthStore();
  let conf = new Configuration(confParam);
  let auth = new AuthenticationApi(conf);
  let data = await auth.readUsersMeApiV1AuthMeGet();
  if (data?.username) {
    authStore.username = data.username;
    authStore.signedIn = true;
  } else {
    throw new Error("Something went wrong, please check the input.");
  }
  console.log(data);
  return true;
}
