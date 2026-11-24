const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'
).replace(/\/$/, '');

const TOKEN_KEY = 'hearo_access_token';

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);

export const setAccessToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAccessToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export async function apiRequest(path, { method = 'GET', body, ...options } = {}) {
  const token = getAccessToken();
  const { headers: customHeaders = {}, ...fetchOptions } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    method,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...customHeaders,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const payload = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const validationMessage = payload && Object.values(payload)
      .flat()
      .find((value) => typeof value === 'string');
    const error = new Error(
      payload?.message || validationMessage || `Permintaan gagal (${response.status}).`
    );
    error.status = response.status;
    throw error;
  }

  return payload;
}

const roleEndpoints = {
  MURID: '/login',
  GURU: '/guru/login',
  'ORANG TUA': '/orang-tua/login',
};

export function normalizeUser(response, roleFallback) {
  const user = response?.data_orang_tua || response?.data || response?.user || {};
  const rawRole = String(user.role || roleFallback || '').toUpperCase().replaceAll('_', ' ');
  const role = rawRole === 'SISWA' ? 'MURID' : rawRole;

  return {
    ...user,
    id: user.id_siswa || user.id_guru || user.id_orang_tua || user.id,
    name: user.nama || user.name || '',
    fullName: user.nama || user.name || '',
    email: user.email || '',
    phone: user.no_telepon || user.phone || '',
    role,
    nisn: user.nisn || '',
    nip: user.nip || '',
    kelas: user.kelas || '',
  };
}

export async function loginUser(email, password, role) {
  const endpoint = roleEndpoints[role];
  if (!endpoint) throw new Error('Peran akun tidak dikenali.');

  const response = await apiRequest(endpoint, {
    method: 'POST',
    body: { email, password },
  });

  if (!response?.access_token) {
    throw new Error('Server tidak mengembalikan token login.');
  }

  return {
    token: response.access_token,
    user: normalizeUser(response, role),
  };
}

export async function registerUser(role, data) {
  const endpointByRole = {
    MURID: '/register',
    GURU: '/guru/register',
    'ORANG TUA': '/orang-tua/register',
  };
  const endpoint = endpointByRole[role];
  if (!endpoint) throw new Error('Peran akun tidak dikenali.');

  const response = await apiRequest(endpoint, { method: 'POST', body: data });
  if (!response?.access_token) {
    throw new Error('Server tidak mengembalikan token setelah pendaftaran.');
  }

  return {
    token: response.access_token,
    user: normalizeUser(response, role),
    response,
  };
}
