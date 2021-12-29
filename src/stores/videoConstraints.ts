import { writable } from "svelte/store";

export const videoConstraints = writable({ facingMode: "user" });
