import { useCallback, useState } from "react";
import NamePage from "./pages/NamePage";
import ChatPage from "./pages/ChatPage";

export default function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const enter = (name: string) => {
    setError(null);
    setUsername(name);
  };

  const handleFatalError = useCallback((message: string) => {
    setError(message);
    setUsername(null);
  }, []);

  if (!username) return <NamePage onEnter={enter} error={error} />;

  return <ChatPage username={username} onFatalError={handleFatalError} />;
}
