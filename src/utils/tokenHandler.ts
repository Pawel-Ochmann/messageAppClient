export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function saveToken(token: string): void {
  localStorage.setItem('token', token);
}

export function deleteToken(): void {
  localStorage.removeItem('token');
}
