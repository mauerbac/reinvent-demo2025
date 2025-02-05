import { NextResponse } from 'next/server';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const emojis = ['😀', '😎', '🥳', '🚀', '💎', '🍕', '🌈', '🎉'];

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

export async function GET() {
  try {
    // Try to get a secret value
    const secretValue = await getSecret('prod/secret-test');
    console.log('Raw secret value:', secretValue); // Log raw value
    console.log('Secret value type:', typeof secretValue); // Log type
    console.log('Secret value stringified:', JSON.stringify(secretValue)); // Log stringified version

    // Generate a daily special combination
    const dailySpecial = Array.from({ length: 4 }, () => emojis[Math.floor(Math.random() * emojis.length)]);

    // Generate today's date string
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    console.log('At', dateString, ' we generated ', dailySpecial);

    // Include the secret value explicitly in the response
    return NextResponse.json({
      dailySpecial,
      date: dateString,
      secret: secretValue, // Changed from secretValue to explicit property name
      secretType: typeof secretValue // Add type information
    });
  } catch (error) {
    console.error('Error generating daily special:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}