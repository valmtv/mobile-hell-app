import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/config';

export const useApi = () => {
  const { userToken, signOut } = useAuth();

  // Generic request function
  const request = async <T>(
    path: string,
    options: {
      method?: string;
      body?: any;
      headers?: Record<string, string>;
    } = {}
  ): Promise<T> => {
    const url = `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };
    
    if (userToken) {
      headers.Authorization = `Bearer ${userToken}`;
    }

    const resp = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (resp.status === 401) {
      signOut();
      throw new Error('Unauthorized');
    }

    const data = await resp.json();

    if (!resp.ok) {
      throw new Error(`API Error ${resp.status}: ${JSON.stringify(data)}`);
    }

    return data as T;
  };

  // Convenience methods
  const get = <T>(path: string) => request<T>(path, { method: 'GET' });
  const post = <T>(path: string, body: any) => request<T>(path, { method: 'POST', body });
  const put = <T>(path: string, body: any) => request<T>(path, { method: 'PUT', body });
  const del = <T>(path: string) => request<T>(path, { method: 'DELETE' });

  return { request, get, post, put, del };
};