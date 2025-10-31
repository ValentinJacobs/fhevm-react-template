'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface MedicalExampleProps {
  onEncrypt?: (value: number) => Promise<void>;
  onDecrypt?: (encryptedValue: string) => Promise<number>;
}

export const MedicalExample: React.FC<MedicalExampleProps> = ({
  onEncrypt,
  onDecrypt,
}) => {
  const [bloodPressure, setBloodPressure] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [encryptedData, setEncryptedData] = useState<{
    bp?: string;
    hr?: string;
  }>({});
  const [decryptedData, setDecryptedData] = useState<{
    bp?: number;
    hr?: number;
  }>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const handleEncryptVitals = async () => {
    if (!bloodPressure || !heartRate) {
      setError('Please enter both blood pressure and heart rate');
      return;
    }

    if (isNaN(Number(bloodPressure)) || isNaN(Number(heartRate))) {
      setError('Please enter valid numbers');
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      if (onEncrypt) {
        await onEncrypt(Number(bloodPressure));
        await onEncrypt(Number(heartRate));
      }

      // Simulate encrypted values
      setEncryptedData({
        bp: '0x' + Math.random().toString(16).substring(2, 18),
        hr: '0x' + Math.random().toString(16).substring(2, 18),
      });
      setDecryptedData({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Encryption failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecryptVitals = async () => {
    if (!encryptedData.bp || !encryptedData.hr) {
      setError('No encrypted data to decrypt');
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      if (onDecrypt) {
        const bpDecrypted = await onDecrypt(encryptedData.bp);
        const hrDecrypted = await onDecrypt(encryptedData.hr);
        setDecryptedData({ bp: bpDecrypted, hr: hrDecrypted });
      } else {
        // Simulate decryption
        setDecryptedData({
          bp: Number(bloodPressure),
          hr: Number(heartRate),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Decryption failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const getHealthStatus = (bp: number, hr: number): string => {
    if (bp > 140 || hr > 100) return 'Abnormal - Consult Doctor';
    if (bp > 130 || hr > 90) return 'Pre-hypertension - Monitor';
    return 'Normal - Healthy Range';
  };

  return (
    <Card
      title="Medical Records Example"
      description="Demonstrate encrypted health data management"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Blood Pressure (systolic)"
            type="number"
            value={bloodPressure}
            onChange={(e) => setBloodPressure(e.target.value)}
            placeholder="e.g., 120"
            helperText="mmHg"
            disabled={isProcessing}
          />
          <Input
            label="Heart Rate"
            type="number"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
            placeholder="e.g., 75"
            helperText="bpm"
            disabled={isProcessing}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={handleEncryptVitals}
            isLoading={isProcessing}
            disabled={!bloodPressure || !heartRate}
          >
            Encrypt Vitals
          </Button>
          <Button
            variant="secondary"
            onClick={handleDecryptVitals}
            isLoading={isProcessing}
            disabled={!encryptedData.bp || !encryptedData.hr}
          >
            Decrypt Vitals
          </Button>
        </div>

        {(encryptedData.bp || encryptedData.hr) && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Encrypted Health Data
            </h4>
            <div className="space-y-2">
              {encryptedData.bp && (
                <div>
                  <p className="text-xs text-gray-500">Blood Pressure</p>
                  <p className="text-xs text-gray-600 break-all font-mono">
                    {encryptedData.bp}
                  </p>
                </div>
              )}
              {encryptedData.hr && (
                <div>
                  <p className="text-xs text-gray-500">Heart Rate</p>
                  <p className="text-xs text-gray-600 break-all font-mono">
                    {encryptedData.hr}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {(decryptedData.bp !== undefined && decryptedData.hr !== undefined) && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h4 className="text-sm font-semibold text-green-700 mb-2">
              Decrypted Vitals
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-green-600">Blood Pressure</p>
                <p className="text-xl font-bold text-green-900">
                  {decryptedData.bp} mmHg
                </p>
              </div>
              <div>
                <p className="text-sm text-green-600">Heart Rate</p>
                <p className="text-xl font-bold text-green-900">
                  {decryptedData.hr} bpm
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-green-200">
              <p className="text-sm text-green-700">
                <strong>Status:</strong>{' '}
                {getHealthStatus(decryptedData.bp, decryptedData.hr)}
              </p>
            </div>
          </div>
        )}

        <div className="mt-4 p-4 bg-purple-50 rounded-lg">
          <h4 className="text-sm font-semibold text-purple-700 mb-2">Use Case</h4>
          <p className="text-sm text-purple-900">
            This example demonstrates how healthcare applications can use FHE to:
          </p>
          <ul className="mt-2 text-sm text-purple-800 list-disc list-inside space-y-1">
            <li>Store patient vitals privately on-chain</li>
            <li>Enable secure health data sharing between providers</li>
            <li>Perform health checks on encrypted medical records</li>
            <li>Maintain HIPAA compliance with encrypted storage</li>
            <li>Allow research on health data without exposing PII</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default MedicalExample;
