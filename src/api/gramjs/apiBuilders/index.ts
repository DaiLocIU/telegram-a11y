
import type { ApiCountry } from '../../../api/types';

function buildApiCountry(country: any, code: any) {
  const {
    hidden, iso2, defaultName, name,
  } = country;
  const { countryCode, prefixes, patterns } = code || {};

  return {
    isHidden: hidden,
    iso2,
    defaultName,
    name,
    countryCode,
    prefixes,
    patterns,
  };
}

export function buildApiCountryList(countries: any) {
  const nonHiddenCountries = countries.filter((country: { hidden: boolean }) => !country.hidden);
  const listByCode = nonHiddenCountries
    .map((country: any) => (
      country.countryCodes.map((code: any) => buildApiCountry(country, code))
    ))
    .flat()
    .sort((a: ApiCountry, b: ApiCountry) => (
      a.name ? a.name.localeCompare(b.name!) : a.defaultName.localeCompare(b.defaultName)
    ));

  const generalList = nonHiddenCountries
    .map((country: any) => buildApiCountry(country, country.countryCodes[0]))
    .sort((a: ApiCountry, b: ApiCountry) => (
      a.name ? a.name.localeCompare(b.name!) : a.defaultName.localeCompare(b.defaultName)
    ));

  return {
    phoneCodes: listByCode,
    general: generalList,
  };
}
