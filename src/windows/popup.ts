import { emit, listen } from "@tauri-apps/api/event";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

const POPUP_LABEL = "popup";
const POPUP_ROUTE = "/#/popup";

export const MAIN_EVENT_NAME = "popup:to-main";
export const POPUP_EVENT_NAME = "main:to-popup";
const POPUP_READY_EVENT = "popup:ready";

let popupReadyUnlisten: (() => void) | null = null;

function getPopupUrl() {
  return `${window.location.origin}${POPUP_ROUTE}`;
}

export async function openPopup(payload?: unknown): Promise<void> {
  const existing = await WebviewWindow.getByLabel(POPUP_LABEL);

  if (existing) {
    await existing.show();
    await existing.setFocus();
    if (payload !== undefined) {
      await sendToPopup(payload);
    }
    return;
  }

  const popup = new WebviewWindow(POPUP_LABEL, {
    url: getPopupUrl(),
    title: "Popup",
    width: 420,
    height: 300,
    resizable: true,
    focus: true,
    visible: false,
  });

  popup.once("tauri://created", async () => {
    if (payload !== undefined) {
      await sendToPopup(payload);
    }
  });

  popupReadyUnlisten?.();
  popupReadyUnlisten = await listen(POPUP_READY_EVENT, async () => {
    await popup.show();
    await popup.setFocus();
    popupReadyUnlisten?.();
    popupReadyUnlisten = null;
  });

  popup.once("tauri://error", (error) => {
    popupReadyUnlisten?.();
    popupReadyUnlisten = null;
    console.error("Failed to create popup window", error);
  });
}

export async function sendToPopup(payload: unknown): Promise<void> {
  await emit(POPUP_EVENT_NAME, payload);
}
