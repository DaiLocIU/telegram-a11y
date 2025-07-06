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

  const phoneHashCode = ref<string | null>(null);

  const onRequestPhoneNumber = () => {
    authState.value = "authorizationStateWaitPhoneNumber";
    return new Promise<string>((resolve, reject) => {
      authController.resolve = resolve;
      authController.reject = reject;
    });
  };

  const onRequestCode = (phoneHash: string) => {
    authState.value = "authorizationStateWaitCode";
    phoneHashCode.value = phoneHash;
    console.log("requesting codeeeeeeee");
    return new Promise<string>((resolve, reject) => {
      authController.resolve = resolve;
      authController.reject = reject;
    });
  };
  return {
    authState,
    phoneHashCode,
    onRequestPhoneNumber,
    onRequestCode
  };
});
