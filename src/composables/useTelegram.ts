import { ref } from "vue";
import { buildApiCountryList } from "../api/gramjs/apiBuilders";

const apiId = parseInt(import.meta.env.VITE_API_ID);
const apiHash = import.meta.env.VITE_API_HASH;

const client = ref<any>(null);
const sessionKey = "telegram-session";

export function useTelegram() {
  const { Api } = (window as any).telegram;
  async function initClient() {
    console.log("Initializing Telegram client...");
    const { TelegramClient, sessions } = (window as any).telegram;
    const { StringSession } = sessions;

    const savedSession = localStorage.getItem(sessionKey) || "";
    const stringSession = new StringSession(savedSession);

    client.value = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });

    await client.value.start({
      phoneNumber: async () => prompt("Phone number:"),
      password: async () => prompt("2FA Password:"),
      phoneCode: async () => prompt("Verification code:"),
      onError: (err: any) => console.error(err),
    });

    // Save session for next login
    localStorage.setItem(sessionKey, client.value.session.save());
    console.log("Connected!");
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
    console.log("Building API country list...", buildApiCountryList(countryList?.countries));
    return buildApiCountryList(countryList?.countries);
  }

  return {
    initClient,
    getClient,
    fetchCountryList,
  };
}
