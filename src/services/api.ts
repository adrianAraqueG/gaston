const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ApiError {
  statusCode: number;
  message: string | string[];
}

async function handleResponse<T>(response: Response, skip401Redirect = false): Promise<T> {
  if (!response.ok) {
    if (response.status === 401) {
      // Solo redirigir si no estamos ya en login y no se solicita omitir la redirección
      if (!skip401Redirect && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }

    let error: ApiError;
    try {
      error = await response.json();
    } catch {
      error = {
        statusCode: response.status,
        message: response.statusText,
      };
    }
    throw error;
  }

  // Si la respuesta está vacía, retornar void
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return undefined as T;
  }

  return response.json();
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & { skip401Redirect?: boolean } = {}
): Promise<T> {
  const { skip401Redirect, ...fetchOptions } = options;
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    credentials: 'include', // CRÍTICO: Permite enviar cookies
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  });

  return handleResponse<T>(response, skip401Redirect);
}

