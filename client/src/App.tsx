import { useState } from "react";
import NamePage from "./pages/NamePage";

function App() {
  const [username, setUserName] = useState<null | string>(null);

  if (!username) {
    return <NamePage onEnter={setUserName} error={null} />;
  }
  return <p style={{ padding: "2rem" }}>Welcome {username}!</p>;
}

export default App;
