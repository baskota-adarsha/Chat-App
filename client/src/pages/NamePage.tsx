import { useState, type FormEvent } from "react";

import { isValidNickName } from "../helpers/validate";

interface Props {
  onEnter: (name: string) => void;
  error: string | null;
}

export default function NamePage({ onEnter, error }: Props) {
  const [name, setName] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (isValidNickName(cleanName)) {
      setLocalError(null);
      onEnter(cleanName);
    } else {
      setLocalError(
        "Nickname must be 2-15 letters, numbers and should not contain spaces",
      );
    }
  };

  // pahile aafno error, natra server le pathayeko error
  const shownError = localError ?? error;

  return (
    <div className="center">
      <div className="card">
        <h1> Chat App</h1>
        <p className="sub">Pick a nickname and hop into a room</p>
        {shownError && <p className="error">{shownError}</p>}
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Enter your nickname"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={15}
            autoFocus
          />
          <button type="submit">Enter</button>
        </form>
      </div>
    </div>
  );
}
