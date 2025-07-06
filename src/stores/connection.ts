import { ref } from "vue";
import { defineStore } from "pinia";

type ApiUpdateConnectionStateType = (
  'connectionStateConnecting' |
  'connectionStateReady' |
  'connectionStateBroken'
);
export default defineStore("connection", () => {
  const connectionState = ref<ApiUpdateConnectionStateType>('connectionStateConnecting');

  const updateConnectionState = (state: ApiUpdateConnectionStateType) => {
    connectionState.value = state;
 };

  return {
    connectionState,
    updateConnectionState,
  };
})