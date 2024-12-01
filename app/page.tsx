import EmojiSlotMachine from '../components/EmojiSlotMachine'

async function getDailySpecial() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'; // Default for dev
    if (!/^https?:\/\//.test(baseUrl)) {
      throw new Error('Invalid or missing API base URL');
    }

    const res = await fetch(`${baseUrl}/api/daily-special`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data.dailySpecial;
  } catch (error) {
    console.error('Error fetching daily special:', error);
    return ['❓', '❓', '❓', '❓']; // Fallback daily special
  }
}

export default async function Home() {
  const initialDailySpecial = await getDailySpecial();
  console.log("im in here ", initialDailySpecial);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-400 to-red-500 pt-16">
      <h1 className="text-4xl font-bold text-white mb-12 text-center">AWS re:Invent</h1>
      <EmojiSlotMachine initialDailySpecial={initialDailySpecial} />
    </div>
  );
}


