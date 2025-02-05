import React from "react";
import QRCode from "qrcode";
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';


const secretsManager = new SecretsManagerClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

async function getSecret(secretName: string) {
  try {
    const command = new GetSecretValueCommand({
      SecretId: secretName,
    });
    const response = await secretsManager.send(command);
    if (response.SecretString) {
      try {
        return JSON.parse(response.SecretString);
      } catch {
        return response.SecretString;
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching secret:', error);
    return null;
  }
}

export default async function QRCodePage() {
  // Use a default base URL; replace with a dynamic host if deployed
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const qrCode = await QRCode.toDataURL(baseUrl); // Generate QR code as a base64 image
  const today = new Date();

  const dateString = today.toISOString().split('T')[0];

  console.log("im in an SSR function hello! It is ", dateString)

  // Try to get a secret value
  const secretValue = await getSecret('prod/secret-test');
  console.log('Raw secret value:', secretValue); // Log raw value
  console.log('Secret value type:', typeof secretValue); // Log type
  console.log('Secret value stringified:', JSON.stringify(secretValue)); // Log stringified version


  return (
    <div className="bg-white p-2 rounded-lg shadow-lg">
      <img src={qrCode} alt="QR Code" className="w-32 h-32" />
      <p className="mt-2 text-center text-sm">{baseUrl}</p>
    </div>
  );
}
