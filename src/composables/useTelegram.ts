import { ref } from "vue";
import { buildApiCountryList } from "../api/gramjs/apiBuilders";
import useAuthStore from "../stores/auth";
import useConnectionStore from "../stores/connection";

const apiId = parseInt(import.meta.env.VITE_API_ID);
const apiHash = import.meta.env.VITE_API_HASH;

const client = ref<any>(null);
const sessionKey = "telegram-session";

export function useTelegram() {
  const { Api } = (window as any).telegram;
  const authStore = useAuthStore();
  const connectionStore = useConnectionStore();
  async function initClient() {

    const { TelegramClient, sessions } = (window as any).telegram;
    const { StringSession } = sessions;


    const savedSession = localStorage.getItem(sessionKey) || "";
    const stringSession = new StringSession(savedSession);

    client.value = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });
    
    await client.value.connect();
    console.log('client/value', client.value);

    connectionStore.updateConnectionState('connectionStateReady');

    await client.value.start({
      phoneNumber: authStore.onRequestPhoneNumber,
      phoneCode: authStore.onRequestCode,
      onError: (err: any) => console.error(err),
    });

    console.log("Telegram client initialized");


    localStorage.setItem(sessionKey, client.value.session.save());
  }

  function getClient() {
    return client.value;
  }
  
  async function fetchCountryList({ langCode = "en" }: { langCode?: string }) {
    const client = getClient();

    const countryList = await client.invoke(
      new Api.help.GetCountriesList({
        langCode,
      })
    );

    if (!(countryList instanceof Api.help.CountriesList)) {
      return undefined;
    }
    return buildApiCountryList(countryList?.countries);
  }

  async function sendCode(phoneNumber: string) {
    const client = getClient();
    const sendCodeResult = await client.invoke(
      new Api.auth.SendCode({
        phoneNumber,
        apiId,
        apiHash,
        settings: new Api.CodeSettings(),
      })
    )
    console.log('sendCodeResult', sendCodeResult);
    return sendCodeResult;
  }

  return {
    initClient,
    getClient,
    fetchCountryList,
    sendCode
  };
}
