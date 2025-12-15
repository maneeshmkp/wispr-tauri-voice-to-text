/* This file is created by tauri. Do not edit. */

const WINDOWS_PROTOCOL = window.__TAURI_PROTOCOL__;

const ASSET_PREFIX = `${WINDOWS_PROTOCOL}://localhost`;

export const invoke = window.__TAURI__.invoke;

const ResourceDir =
  ASSET_PREFIX +
  (window.__TAURI__.resourceDir
    ? "/" + window.__TAURI__.resourceDir.split("\\").join("/")
    : "");

export const resolveResource = async (resourcePath) => {
  if (typeof resourcePath === "string") {
    const response = await fetch(ASSET_PREFIX + resourcePath);
    return response.url;
  }

  return null;
};
