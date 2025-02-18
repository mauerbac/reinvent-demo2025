import React from "react";
import QRCode from "qrcode";



export default async function QRCodePage() {
  // Use a default base URL; replace with a dynamic host if deployed
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const qrCode = await QRCode.toDataURL(baseUrl); // Generate QR code as a base64 image
  const today = new Date();

  const dateString = today.toISOString().split('T')[0];

  console.log("im in an SSR function hello! It is ", dateString)

  return (
    <div className="bg-white p-2 rounded-lg shadow-lg">
      <img src={qrCode} alt="QR Code" className="w-32 h-32" />
      <p className="mt-2 text-center text-sm">{baseUrl}</p>
    </div>
  );
}
