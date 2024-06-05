import { proxy } from "valtio";
import { generateCode, normalize } from "./service";

interface HistoryItem {
  content: string;
  time: Date;
}

export const state = proxy({
  input: "",
  submitting: false,

  history: [] as HistoryItem[],
});

export function changeInput(val: string) {
  state.input = val;
}

export async function send() {
  const prompt = state.input;
  state.input = "";
  state.submitting = true;
  const res = await generateCode(prompt);
  const content = normalize(res.choices[0].message.content);
  state.history.push({
    content,
    time: new Date(),
  });
  state.submitting = false;
}
