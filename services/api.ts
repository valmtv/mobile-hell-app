import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/config';

export const useApi = () => {
  const { userToken, signOut } = useAuth();

  // Generic request function
  const request = async <T = any>(
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
      // Token expired or unauthorized; optionally sign out
      signOut();
      throw new Error('Unauthorized');
    }
    const text = await resp.text();
    // Try JSON parse
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      // Non-JSON response
      data = text;
    }
    if (!resp.ok) {
      const msg = typeof data === 'object' ? JSON.stringify(data) : data;
      throw new Error(`API Error ${resp.status}: ${msg}`);
    }
    return data as T;
  };

  // Convenience methods:
  const get = <T = any>(path: string) => request<T>(path, { method: 'GET' });
  const post = <T = any>(path: string, body: any) => request<T>(path, { method: 'POST', body });
  const put = <T = any>(path: string, body: any) => request<T>(path, { method: 'PUT', body });
  const del = <T = any>(path: string) => request<T>(path, { method: 'DELETE' });

  return { request, get, post, put, del };
};

