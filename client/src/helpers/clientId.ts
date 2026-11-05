const KEY = "chat app client id";
export function getClientId(): string {
  let id = sessionStorage.getItem(KEY);

  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(KEY, id);
  }
  return id;
}
