export interface ApiCountry {
  isHidden?: boolean;
  iso2: string;
  defaultName: string;
  name?: string;
  countryCodes?: ApiCountryCode[];
}

export interface ApiCountryCode extends ApiCountry {
  countryCode: string;
  prefixes?: string[];
  patterns?: string[];
}