import type { ApiCountryCode } from "../api/types";

export function getCountryFromPhoneNumber(phoneCodeList: ApiCountryCode[], input = '') {
  let phoneNumber = input.replace(/[^\d+]+/g, '');
  if (phoneNumber.startsWith('+')) {
    phoneNumber = phoneNumber.substr(1);
  }

  const possibleCountries = phoneCodeList
    .filter((country) => phoneNumber.startsWith(country.countryCode));
  const codesWithPrefix: { code: string; country: ApiCountryCode }[] = possibleCountries
    .map((country) => (country.prefixes || ['']).map((prefix) => {
      return {
        code: `${country.countryCode}${prefix}`,
        country,
      };
    }))
    .flat();

  const bestMatches = codesWithPrefix
    .filter(({ code }) => phoneNumber.startsWith(code))
    .sort((a, b) => a.code.length - b.code.length);

  return bestMatches[bestMatches.length - 1]?.country;
}