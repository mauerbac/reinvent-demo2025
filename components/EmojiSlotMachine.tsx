"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"

const emojis = ['😀', '😎', '🥳', '🚀', '💎', '🍕', '🌈', '🎉']

export default function EmojiSlotMachine({ initialDailySpecial }: { initialDailySpecial: string[] }) {
  const [slots, setSlots] = useState(['❓', '❓', '❓', '❓'])
  const [spinning, setSpinning] = useState(false)
  const [lever, setLever] = useState(false)
  const [dailySpecial, setDailySpecial] = useState(initialDailySpecial)
  const [score, setScore] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDailySpecial = async () => {
      try {
        const res = await fetch('/api/daily-special', {
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        const data = await res.json()
        setDailySpecial(data.dailySpecial)
        setError(null)
      } catch (error) {
        console.error('Error fetching daily special:', error)
        setError('Failed to fetch daily special. Using default.')
      }
    }

    fetchDailySpecial()
  }, [])

  const spinSlots = () => {
    setSpinning(true)
    setLever(true)

    // Simulate spinning for 2 seconds
    const spinInterval = setInterval(() => {
      setSlots(slots.map(() => emojis[Math.floor(Math.random() * emojis.length)]))
    }, 100)

    setTimeout(() => {
      clearInterval(spinInterval)
      setSpinning(false)
      setLever(false)
      // Final random selection
      const newSlots = slots.map(() => emojis[Math.floor(Math.random() * emojis.length)])
      setSlots(newSlots)

      // Check if the new slots match the daily special
      if (JSON.stringify(newSlots) === JSON.stringify(dailySpecial)) {
        setScore(prevScore => prevScore + 1000)
      } else {
        // Regular scoring logic
        const matchCount = newSlots.filter((slot, index) => slot === dailySpecial[index]).length
        setScore(prevScore => prevScore + matchCount * 100)
      }
    }, 2000)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-yellow-400 p-8 rounded-3xl shadow-2xl">
        <div className="flex space-x-4 mb-6">
          {slots.map((emoji, index) => (
            <div 
              key={index} 
              className={`w-20 h-20 bg-white rounded-lg flex items-center justify-center text-4xl ${spinning ? 'animate-spin' : ''}`}
            >
              {emoji}
            </div>
          ))}
        </div>
        <div className="flex justify-center mb-4">
          <Button
            onClick={spinSlots}
            disabled={spinning}
            className={`bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-full transform transition-transform ${lever ? 'translate-y-2' : ''}`}
          >
            Pull Lever
          </Button>
        </div>
        <div className="text-center text-xl font-bold mb-4">
          Score: {score}
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Daily Special:</h3>
          <div className="flex justify-center space-x-2">
            {dailySpecial.map((emoji, index) => (
              <div key={index} className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-2xl">
                {emoji}
              </div>
            ))}
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    </div>
  )
}

