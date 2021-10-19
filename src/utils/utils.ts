import { useState, useCallback } from "react";

export function useLocalStorage(key: string, defaultState?: any) {
  const [state, setState] = useState(() => {
    // NOTE: Not sure if this is ok
    const storedState = localStorage.getItem(key);
    if (storedState) {
      return JSON.parse(storedState);
    }
    return defaultState;
  });

  const setLocalStorageState = useCallback(
    (newState) => {
      const changed = state !== newState;
      if (!changed) {
        return;
      }
      setState(newState);
      if (newState === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newState));
      }
    },
    [state, key]
  );

  return [state, setLocalStorageState];
}

export const fromWeiWithDecimals = (
  web3: any,
  amount: any,
  decimals: number
) => {
  if (decimals === 18) {
    return web3.utils.fromWei(amount);
  } else {
    return amount / Math.pow(10, decimals);
  }
};
