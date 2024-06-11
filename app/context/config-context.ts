"use client";
import { createContext } from "react";
import { admin } from "../dsl/admin-dsl";
import { exampleDSL } from "../service";

export function buildConfig(code: string) {
  const fn = new Function("admin", `return ${code.replace(/^[\n]+/, "")}`);
  return fn(admin);
}

export const adminConfig = buildConfig(exampleDSL);

export const ConfigContext = createContext(adminConfig);
