import { NextResponse } from 'next/server';

const emojis = ['😀', '😎', '🥳', '🚀', '💎', '🍕', '🌈', '🎉'];

export async function GET() {
  try {
    // Generate a daily special combination
    const dailySpecial = Array.from({ length: 4 }, () => emojis[Math.floor(Math.random() * emojis.length)]);

    // Generate today's date string
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    console.log("At", dateString, " we generated ", dailySpecial);

    return NextResponse.json({ dailySpecial, date: dateString });
  } catch (error) {
    console.error('Error generating daily special:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
