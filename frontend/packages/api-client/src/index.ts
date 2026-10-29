export type ApiResponse<T> = {
  data?: T;
  error?: string;
};

export function getApiUrl(): string {
  return import.meta.env.VITE_API_URL || 'http://localhost:8004';
}

const HEALTH_CHECK_INTERVAL_MS = 5 * 60 * 1000;

export function startHealthChecks(): void {
  const checkHealth = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/health`, { cache: 'no-store' });
      if (!response.ok) {
        console.warn(`Backend health check failed (HTTP ${response.status})`);
      }
    } catch (error) {
      console.warn('Backend health check failed:', error);
    }
  };

  void checkHealth();
  window.setInterval(() => {
    void checkHealth();
  }, HEALTH_CHECK_INTERVAL_MS);
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & { authToken?: string | null } = {},
): Promise<ApiResponse<T>> {
  const { authToken, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string> | undefined),
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${getApiUrl()}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { error: error.detail || 'Request failed' };
    }

    if (response.status === 204) {
      return { data: undefined as T };
    }

    const data = (await response.json()) as T;
    return { data };
  } catch {
    return { error: 'Network error' };
  }
}
