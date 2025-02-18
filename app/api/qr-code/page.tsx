import React from "react";
import QRCode from "qrcode";
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';

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



export default async function QRCodePage() {
  // Use a default base URL; replace with a dynamic host if deployed
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const qrCode = await QRCode.toDataURL(baseUrl); // Generate QR code as a base64 image
  const today = new Date();

  const dateString = today.toISOString().split('T')[0];

  console.log("im in an SSR function hello! It is ", dateString)
   // Get item from DynamoDB
   const dynamoItem = await getDynamoItem();
   const highScore = Number(dynamoItem.high_score.N);
   console.log('Retrieved DynamoDB item:', dynamoItem);



  return (
    <div className="bg-white p-2 rounded-lg shadow-lg">
    <h3>High Score: {highScore}</h3>
      <img src={qrCode} alt="QR Code" className="w-32 h-32" />
      <p className="mt-2 text-center text-sm">{baseUrl}</p>
    </div>
  );
}
