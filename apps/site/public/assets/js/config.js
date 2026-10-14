const hostname = window.location.hostname;
const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';

window.LOCALLOOP_CONFIG = {
  apiBase: isLocal ? 'http://127.0.0.1:8088' : 'https://loop-api.urbnia.com'
};
