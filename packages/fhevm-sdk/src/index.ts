/**
 * Universal FHEVM SDK
 *
 * Framework-agnostic development kit for building confidential dApps
 * with Zama's Fully Homomorphic Encryption technology.
 *
 * @packageDocumentation
 */

// Core client
export { FhevmClient } from './client/FhevmClient';

// Types
export type {
  FhevmConfig,
  EncryptedData,
  EncryptedInput,
  EncryptedResult,
  EncryptionUtils,
  DecryptionUtils,
  PublicDecryptionUtils,
} from './types';

// Standalone utility functions for framework-agnostic usage
export async function createFhevmClient(config: import('./types').FhevmConfig) {
  const { FhevmClient } = await import('./client/FhevmClient');
  return FhevmClient.create(config);
}
