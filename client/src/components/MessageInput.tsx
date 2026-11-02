import { useState, type FormEvent } from "react";
interface Props {
  onSend: (text: string) => void;
}
export default function MessageInput({ onSend }: Props) {
  const [text, setText] = useState("");
}
