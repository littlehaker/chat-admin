"use client";

import { proxy, subscribe, useSnapshot } from "valtio";
import { generateCode, normalize } from "./service";
import _ from "lodash";
import { useMemo } from "react";
import { buildConfig } from "./context/config-context";

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
type State = typeof initState;
const currentState: State = lsState ? JSON.parse(lsState) : initState;

export const state = proxy(currentState);
function getCurrentItem(snap: State) {
  return snap.history.find((x) => x.time === snap.currentHistoryItem);
}
function getConfigFromItem(item?: HistoryItem) {
  if (!item) {
    return undefined;
  } else {
    return buildConfig(item.content);
  }
}
export function useCurrentConfig() {
  const snap = useSnapshot(state);

  const current = useMemo(() => {
    return getCurrentItem(snap as State);
  }, [snap.currentHistoryItem]);

  const config = useMemo(() => {
    return getConfigFromItem(current);
  }, [current]);
  return { config, item: current };
}

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
    const item = getCurrentItem(state);
    const res = await generateCode(prompt, item?.content);
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
