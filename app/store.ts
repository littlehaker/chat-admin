import { proxy } from "valtio";
import { generateCode, normalize } from "./service";
import _ from "lodash";

interface HistoryItem {
  content: string;
  time: number;
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
  state.submitting = true;
  const res = await generateCode(prompt, _.last(state.history)?.content);
  state.input = "";
  const content = normalize(res.choices[0].message.content);
  state.history.push({
    content,
    time: Date.now(),
  });
  state.submitting = false;
}
