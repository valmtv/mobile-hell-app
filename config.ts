import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Hardcoded from ifconfig
const MAC_IP = '10.60.81.201';
const HTTP_PORT = 80; // From hell-app .env

function getHostIpFromExpo(): string | null {
  // Try new Expo SDK first
  const manifest = Constants.expoConfig;
  if (manifest?.hostUri) {
    const [host] = manifest.hostUri.split(':');
    return host;
  }
  
  // Fallback for older Expo versions
  const debuggerHost = Constants.manifest?.debuggerHost;
  if (debuggerHost) {
    const [host] = debuggerHost.split(':');
    return host;
  }
  
  return null;
}

let API_BASE_URL: string;

if (__DEV__) {
  // For development, use Mac's IP
  const detectedHost = getHostIpFromExpo();
  const host = detectedHost || MAC_IP;
  
  // Use HTTP mobile API endpoint to avoid certificate issues
  API_BASE_URL = `http://${host}:${HTTP_PORT}/mobile-api/v1`;
  
  console.log('🔗 API_BASE_URL:', API_BASE_URL);
  console.log('📱 Detected host from Expo:', detectedHost);
  console.log('HARDCODED: Fallback host (Mac IP):', MAC_IP);
} else {
  // Production in case i would like to play here more 
  API_BASE_URL = 'https://your-production-domain.com/api/v1';
}

export { API_BASE_URL };
