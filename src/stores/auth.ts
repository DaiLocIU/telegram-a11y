import { defineStore } from "pinia";
import { ref } from "vue";
export type ApiUpdateAuthorizationStateType =
  | "authorizationStateLoggingOut"
  | "authorizationStateWaitPhoneNumber"
  | "authorizationStateWaitCode"
  | "authorizationStateWaitPassword"
  | "authorizationStateWaitRegistration"
  | "authorizationStateReady"
  | "authorizationStateClosing"
  | "authorizationStateClosed"
  | "authorizationStateWaitQrCode";

const authController: {
  resolve?: AnyToVoidFunction;
  reject?: (error: Error) => void;
} = {};

export default defineStore("auth", () => {
  const authState = ref<ApiUpdateAuthorizationStateType>(
    "authorizationStateWaitPhoneNumber"
  );

  const userFullInfo = ref<any | null>(null);

  const userInfo = ref<any | null>(null);

  const phoneHashCode = ref<string | null>(null);
  const phoneNumber = ref<string | null>(null);

  const onRequestPhoneNumber = () => {
    authState.value = "authorizationStateWaitPhoneNumber";
    return new Promise<string>((resolve, reject) => {
      authController.resolve = resolve;
      authController.reject = reject;
    });
  };

  const onRequestCode = ({ phoneHash, phone }: { phoneHash: string; phone: string }) => {
    authState.value = "authorizationStateWaitCode";
    phoneHashCode.value = phoneHash;
    phoneNumber.value = phone;
    console.log("requesting codeeeeeeee");
    return new Promise<string>((resolve, reject) => {
      authController.resolve = resolve;
      authController.reject = reject;
    });
  };

  const onAuthReady = () => {
    authState.value = "authorizationStateReady";
  };

  const updateCurrentUser = (userFull: any) => {
    const user = userFull.users[0];
    userFullInfo.value = userFull
    userInfo.value = user;
  };
  return {
    authState,
    phoneNumber,
    phoneHashCode,
    userFullInfo,
    userInfo,
    onRequestPhoneNumber,
    onRequestCode,
    onAuthReady,
    updateCurrentUser
  };
});
