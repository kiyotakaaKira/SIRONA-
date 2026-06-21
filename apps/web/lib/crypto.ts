// AES-256-GCM Client-Side Encryption Utilities

export async function generateVaultKey(): Promise<CryptoKey> {
  return await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encryptFile(
  file: File,
  key: CryptoKey
): Promise<{ encryptedBlob: Blob; iv: Uint8Array }> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const arrayBuffer = await file.arrayBuffer();

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv as any },
    key,
    arrayBuffer
  );

  const encryptedBlob = new Blob([encryptedBuffer], { type: "application/octet-stream" });
  return { encryptedBlob, iv };
}

export async function decryptFile(
  encryptedBlob: Blob,
  key: CryptoKey,
  iv: Uint8Array,
  originalType: string
): Promise<Blob> {
  const arrayBuffer = await encryptedBlob.arrayBuffer();

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv as any },
    key,
    arrayBuffer
  );

  return new Blob([decryptedBuffer], { type: originalType });
}

function uint8ToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToUint8(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function exportKey(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey("raw", key);
  return uint8ToBase64(new Uint8Array(exported));
}

export async function importKey(base64Key: string): Promise<CryptoKey> {
  const keyBuffer = base64ToUint8(base64Key);
  return await window.crypto.subtle.importKey(
    "raw",
    keyBuffer as any,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}
