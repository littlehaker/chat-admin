"use client";

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

  currentHistoryItem: 0, // currentTimestamp

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

  try {
    const res = await generateCode(prompt, _.last(state.history)?.content);
    state.input = "";
    const content = normalize(res.choices[0].message.content);
    const time = Date.now();
    state.history.push({
      userPrompt: prompt,
      content,
      time: time,
    });
    state.currentHistoryItem = time;
  } finally {
    state.submitting = false;
  }
}

export function selectHistoryItem(time: number) {
  state.currentHistoryItem = time;
}
