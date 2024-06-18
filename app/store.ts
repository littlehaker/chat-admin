"use client";

import { proxy, subscribe, useSnapshot } from "valtio";
import { buildDSL, generateCode, normalize, testDSL } from "./service";
import _ from "lodash";
import { useMemo } from "react";

interface HistoryItem {
  userPrompt: string;
  content: string;
  time: number;
  isError?: true;
}

export const initState = {
  input: "",
  submitting: false,

  currentHistoryItem: 0, // currentTimestamp

  history: [] as HistoryItem[],
};
type State = typeof initState;
// const currentState: State = lsState ? JSON.parse(lsState) : initState;

export const state = proxy(initState);
function getCurrentItem(snap: State) {
  return snap.history.find((x) => x.time === snap.currentHistoryItem);
}
function getConfigFromItem(item?: HistoryItem) {
  if (!item) {
    return undefined;
  } else {
    return buildDSL(item.content);
  }
}
export function setState(newState: State) {
  state.input = newState.input;
  state.history = newState.history;
  state.currentHistoryItem = newState.currentHistoryItem;
}
export function useCurrentConfig() {
  const snap = useSnapshot(state);

  const current = useMemo(() => {
    return getCurrentItem(snap as State);
  }, [snap.currentHistoryItem]);

  const config = useMemo(() => {
    return getConfigFromItem(current);
  }, [current]);
  return { config: config?.dsl, item: current, advices: config?.advices };
}

export function changeInput(val: string) {
  state.input = val;
}

export async function sendPrompt(prompt: string) {
  state.input = prompt;
  await send();
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
    if (testDSL(content)) {
      state.history.push({
        userPrompt: prompt,
        content,
        time,
      });
      state.currentHistoryItem = time;
    } else {
      state.history.push({
        userPrompt: prompt,
        content,
        time,
        isError: true,
      });
    }
  } finally {
    state.submitting = false;
  }
}

export function selectHistoryItem(time: number) {
  state.currentHistoryItem = time;
}
