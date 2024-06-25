"use client";

import { proxy, useSnapshot } from "valtio";
import { buildDSL, generateCode, normalize, testDSL } from "./service";
import _ from "lodash";
import { ChangeEvent, useMemo } from "react";

interface HistoryItem {
  userPrompt: string;
  content: string;
  time: number;
  isError?: true;
}

export const initState = {
  visible: false,

  input: "",
  submitting: false,

  currentHistoryItem: 0, // currentTimestamp

  history: [] as HistoryItem[],

  // OpenAI API Config
  api: {
    visible: true,
    endpoint: "",
    key: "",
  },
};
type State = typeof initState;

export const state = proxy<State>(initState);
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

export function resetState(newState: State) {
  Object.keys(newState).forEach((_key) => {
    const key = _key as keyof State;
    (state as any)[key] = newState[key];
  });
}
export function useCurrentConfig() {
  const snap = useSnapshot(state);

  const current = useMemo(() => {
    return getCurrentItem(snap as State);
  }, [snap, snap.currentHistoryItem]);

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

export function open() {
  state.visible = true;
}

export function close() {
  state.visible = false;
}

export function openAPISetting() {
  state.api.visible = true;
}

export function closeAPISetting() {
  if (state.api.endpoint && state.api.key) {
    state.api.visible = false;
  }
}

export function inputAPIEndpoint(e: ChangeEvent<HTMLInputElement>) {
  state.api.endpoint = e.target.value;
}

export function inputAPIKey(e: ChangeEvent<HTMLInputElement>) {
  state.api.key = e.target.value;
}
