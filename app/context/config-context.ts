"use client";
import { createContext } from "react";
import { AdminDSL } from "../dsl/admin-dsl";

export const ConfigContext = createContext<AdminDSL | undefined>(undefined);
