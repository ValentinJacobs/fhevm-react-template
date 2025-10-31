'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface BankingExampleProps {
  onEncrypt?: (amount: number) => Promise<void>;
  onDecrypt?: (encryptedValue: string) => Promise<number>;
}

export const BankingExample: React.FC<BankingExampleProps> = ({
  onEncrypt,
  onDecrypt,
}) => {
  const [amount, setAmount] = useState('');
  const [encryptedBalance, setEncryptedBalance] = useState<string>('');
  const [decryptedBalance, setDecryptedBalance] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const handleEncrypt = async () => {
    if (!amount || isNaN(Number(amount))) {
      setError('Please enter a valid amount');
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      if (onEncrypt) {
        await onEncrypt(Number(amount));
      }
      // Simulate encrypted value (in real app, this would come from FHE)
      setEncryptedBalance('0x' + Math.random().toString(16).substring(2, 18));
      setDecryptedBalance(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Encryption failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecrypt = async () => {
    if (!encryptedBalance) {
      setError('No encrypted balance to decrypt');
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      if (onDecrypt) {
        const decrypted = await onDecrypt(encryptedBalance);
        setDecryptedBalance(decrypted);
      } else {
        // Simulate decryption
        setDecryptedBalance(Number(amount));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Decryption failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card
      title="Banking Example"
      description="Demonstrate encrypted financial transactions"
    >
      <div className="space-y-4">
        <div>
          <Input
            label="Account Balance"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount in USD"
            error={error}
            disabled={isProcessing}
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={handleEncrypt}
            isLoading={isProcessing}
            disabled={!amount}
          >
            Encrypt Balance
          </Button>
          <Button
            variant="secondary"
            onClick={handleDecrypt}
            isLoading={isProcessing}
            disabled={!encryptedBalance}
          >
            Decrypt Balance
          </Button>
        </div>

        {encryptedBalance && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Encrypted Balance
            </h4>
            <p className="text-xs text-gray-600 break-all font-mono">
              {encryptedBalance}
            </p>
          </div>
        )}

        {decryptedBalance !== null && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h4 className="text-sm font-semibold text-green-700 mb-2">
              Decrypted Balance
            </h4>
            <p className="text-lg font-bold text-green-900">
              ${decryptedBalance.toFixed(2)}
            </p>
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-700 mb-2">Use Case</h4>
          <p className="text-sm text-blue-900">
            This example demonstrates how banking applications can use FHE to:
          </p>
          <ul className="mt-2 text-sm text-blue-800 list-disc list-inside space-y-1">
            <li>Store account balances privately on-chain</li>
            <li>Process transactions without revealing amounts</li>
            <li>Enable compliance checks on encrypted data</li>
            <li>Maintain user privacy while ensuring auditability</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default BankingExample;
