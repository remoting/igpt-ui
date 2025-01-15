import { fetch } from '@tauri-apps/plugin-http';
import global from './global';
const httpFetch = global.isTauri() ? fetch : window.fetch;
export default httpFetch