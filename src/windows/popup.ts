import { emit, listen } from "@tauri-apps/api/event";
import {
  cursorPosition,
  monitorFromPoint,
  PhysicalPosition,
} from "@tauri-apps/api/window";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

const POPUP_LABEL = "popup";
const POPUP_ROUTE = "/#/popup";
const POPUP_WIDTH = 420;
const POPUP_HEIGHT = 300;

export const MAIN_EVENT_NAME = "popup:to-main";
export const POPUP_EVENT_NAME = "main:to-popup";
const POPUP_READY_EVENT = "popup:ready";

let popupReadyUnlisten: (() => void) | null = null;
let pendingPayload: unknown | null = null;

function getPopupUrl() {
  return `${window.location.origin}${POPUP_ROUTE}`;
}

async function getPopupPosition() {
  try {
    const cursor = await cursorPosition();
    const monitor = await monitorFromPoint(cursor.x, cursor.y);
    const offset = 12;
    let x = cursor.x + offset;
    let y = cursor.y + offset;
    if (monitor) {
      const area = monitor.workArea;
      const minX = area.position.x;
      const minY = area.position.y;
      const maxX = area.position.x + area.size.width - POPUP_WIDTH;
      const maxY = area.position.y + area.size.height - POPUP_HEIGHT;
      if (x > maxX) x = cursor.x - POPUP_WIDTH - offset;
      if (y > maxY) y = cursor.y - POPUP_HEIGHT - offset;
      x = Math.min(Math.max(x, minX), maxX);
      y = Math.min(Math.max(y, minY), maxY);
    }
    return new PhysicalPosition(Math.round(x), Math.round(y));
  } catch {
    return null;
  }
}

export async function openPopup(payload?: unknown): Promise<void> {
  const position = await getPopupPosition();
  const existing = await WebviewWindow.getByLabel(POPUP_LABEL);

  if (existing) {
    if (position) {
      await existing.setPosition(position);
    }
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
    width: POPUP_WIDTH,
    height: POPUP_HEIGHT,
    resizable: true,
    focus: true,
    visible: false,
    ...(position ? { x: position.x, y: position.y } : {}),
  });

  if (payload !== undefined) {
    pendingPayload = payload;
  }

  popupReadyUnlisten?.();
  popupReadyUnlisten = await listen(POPUP_READY_EVENT, async () => {
    await popup.show();
    await popup.setFocus();
    if (pendingPayload !== null) {
      await sendToPopup(pendingPayload);
      pendingPayload = null;
    }
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
