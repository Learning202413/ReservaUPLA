import { useSyncExternalStore } from 'react';

export type Handedness = 'right' | 'left';

const DEVICE_KEY = 'reservaupla_handedness';

export function getDeviceHandedness(): Handedness {
  try {
    const saved = localStorage.getItem(DEVICE_KEY);
    if (saved === 'left' || saved === 'right') {
      return saved;
    }
  } catch {}
  return 'right';
}

let currentHandedness: Handedness = getDeviceHandedness();
const listeners = new Set<() => void>();

function applyHandednessClass(handedness: Handedness) {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('left-handed', handedness === 'left');
    document.documentElement.setAttribute('data-handedness', handedness);
  }
}

applyHandednessClass(currentHandedness);

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export function setHandedness(handedness: Handedness) {
  try {
    localStorage.setItem(DEVICE_KEY, handedness);
  } catch {}

  if (currentHandedness !== handedness) {
    currentHandedness = handedness;
    applyHandednessClass(handedness);
    emitChange();
  }
}

export function toggleHandedness() {
  setHandedness(currentHandedness === 'left' ? 'right' : 'left');
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot(): Handedness {
  return currentHandedness;
}

function getServerSnapshot(): Handedness {
  return 'right';
}

export function useHandedness() {
  const handedness = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    handedness,
    isLeftHanded: handedness === 'left',
    setHandedness,
    toggleHandedness,
  };
}
