'use client';

export type WalletAddress = string;

let _publicKey: WalletAddress | null = null;

export function getConnectedWallet(): WalletAddress | null {
  return _publicKey;
}

export async function connectFreighter(): Promise<WalletAddress> {
  if (typeof window === 'undefined') throw new Error('Browser required');
  // Stub — replace with stellar-wallets-kit when backend is live
  const mock = 'GDEMO' + Math.random().toString(36).slice(2, 52).toUpperCase();
  _publicKey = mock;
  return mock;
}

export function disconnectWallet(): void {
  _publicKey = null;
}

export function shortenAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function fromStroops(stroops: bigint | string, decimals = 7): string {
  const n = BigInt(stroops);
  const divisor = 10n ** BigInt(decimals);
  const whole = n / divisor;
  const frac  = n % divisor;
  return `${whole}.${frac.toString().padStart(decimals, '0')}`;
}

export function toStroops(display: string, decimals = 7): bigint {
  const [whole = '0', frac = ''] = display.split('.');
  const fracPadded = frac.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(whole) * 10n ** BigInt(decimals) + BigInt(fracPadded);
}
