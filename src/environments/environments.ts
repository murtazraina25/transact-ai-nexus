const devEnv = {
  baseURL: 'https://6cea-106-51-51-220.ngrok-free.app',
};

const prodEnv = {
    baseURL: 'https://6cea-106-51-51-220.ngrok-free.app',
};

export const MICROSOFT_CLIENT_ID = '4d1cc203-c773-471f-87c7-e76a2f19787e';

export const GOOGLE_CLIENT_ID =
  '1093179039078-64o3n19idlmh5mkrh61mo4ihsjpm9pdh.apps.googleusercontent.com';

export const GITHUB_CLIENT_ID= 'Ov23lisuiuHXXA27oxZu'

const environment = process.env.NODE_ENV === 'production' ? { ...prodEnv } : { ...devEnv };

export default environment;