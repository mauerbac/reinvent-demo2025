import { NextResponse } from 'next/server';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';

const emojis = ['😀', '😎', '🥳', '🚀', '💎', '🍕', '🌈', '🎉'];

const dynamoDb = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

async function getDynamoItem() {
  try {
    const command = new GetItemCommand({
      TableName: 'test-table',
      Key: {
        items: { S: 'mauerbac' }
      }
    });
    const response = await dynamoDb.send(command);
    console.log('DynamoDB item:', response.Item);
    return response.Item;
  } catch (error) {
    console.error('Error fetching from DynamoDB:', error);
    return null;
  }
}

export async function GET() {
  try {
    // Get item from DynamoDB
    const dynamoItem = await getDynamoItem();
    console.log('Retrieved DynamoDB item:', dynamoItem);

    // Generate a daily special combination
    const dailySpecial = Array.from({ length: 4 }, () => emojis[Math.floor(Math.random() * emojis.length)]);

    // Generate today's date string
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    console.log('At', dateString, ' we generated ', dailySpecial);

    return NextResponse.json({
      dailySpecial,
      date: dateString,
      dynamoItem
    });
  } catch (error) {
    console.error('Error generating daily special:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}