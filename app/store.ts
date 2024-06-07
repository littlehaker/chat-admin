import { proxy, subscribe } from "valtio";
import { generateCode, normalize } from "./service";
import _ from "lodash";

interface HistoryItem {
  userPrompt: string;
  content: string;
  time: number;
}

const lsKey = "valtioStore";
const lsState = localStorage.getItem(lsKey);

const initState = {
  input: "",
  submitting: false,

  history: [] as HistoryItem[],
};
const currentState: typeof initState = lsState
  ? JSON.parse(lsState)
  : initState;

export const state = proxy(currentState);
subscribe(state, () => {
  localStorage.setItem(lsKey, JSON.stringify(state));
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
    userPrompt: prompt,
    content,
    time: Date.now(),
  });
  state.submitting = false;
}
