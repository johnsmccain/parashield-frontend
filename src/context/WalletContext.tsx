'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { connectWallet, disconnectWallet, getStoredAddress } from '@/lib/stellar';
import { toUserMessage } from '@/lib/errors';

interface WalletContextValue {
  address:    string | null;
  connected:  boolean;
  connecting: boolean;
  error:      string | null;
  connect:    () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address,    setAddress]    = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredAddress();
    if (stored) setAddress(stored);
  }, []);

  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);
    try {
      const addr = await connectWallet();
      setAddress(addr);
    } catch (err) {
      const msg = toUserMessage(err);
      if (!msg.includes('closed')) setError(msg);
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    disconnectWallet();
    setAddress(null);
    setError(null);
  }, []);

  return (
    <WalletContext.Provider
      value={{ address, connected: !!address, connecting, error, connect, disconnect }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWalletContext must be used inside <WalletProvider>');
  return ctx;
}
