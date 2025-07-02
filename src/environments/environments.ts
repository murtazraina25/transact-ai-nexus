const devEnv = {
  baseURL: 'http://localhost:8004',
};

const prodEnv = {
    baseURL: 'http://localhost:8004',
};

export const MICROSOFT_CLIENT_ID = 'c51d09d3-4157-4989-88a6-c830ff0b44c0';

export const GOOGLE_CLIENT_ID =
  '1093179039078-64o3n19idlmh5mkrh61mo4ihsjpm9pdh.apps.googleusercontent.com';

export const GITHUB_CLIENT_ID= 'Ov23lisuiuHXXA27oxZu'

const environment = process.env.NODE_ENV === 'production' ? { ...prodEnv } : { ...devEnv };

export default environment;