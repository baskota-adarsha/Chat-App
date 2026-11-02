import { useState, type FormEvent } from "react";
interface Props {
  onSend: (text: string) => void;
}
export default function MessageInput({ onSend }: Props) {
  const [text, setText] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    const clean = text.trim();
    if (!clean) return;
    onSend(clean);
    setText("");
  }

  return (
    <form className="composer" onSubmit={submit}>
      <input
        type="text"
        placeholder="Say something nice"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={500}
        autoComplete="off"
      />
      <button type="submit">Send</button>
    </form>
  );
}
