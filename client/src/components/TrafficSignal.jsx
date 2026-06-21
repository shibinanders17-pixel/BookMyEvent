import { useState, useEffect } from "react"

const LIGHTS = [
  { color: "red", duration: 4000, activeClass: "bg-red-500 shadow-[0_0_30px_10px_rgba(239,68,68,0.6)]", inactiveClass: "bg-red-900/40" },
  { color: "yellow", duration: 2000, activeClass: "bg-yellow-400 shadow-[0_0_30px_10px_rgba(250,204,21,0.6)]", inactiveClass: "bg-yellow-900/40" },
  { color: "green", duration: 4000, activeClass: "bg-green-500 shadow-[0_0_30px_10px_rgba(34,197,94,0.6)]", inactiveClass: "bg-green-900/40" },
]

export default function TrafficSignal() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % LIGHTS.length)
    }, LIGHTS[current].duration)
    return () => clearTimeout(timer)
  }, [current])

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <div className="bg-gray-800 rounded-3xl p-4 flex flex-col gap-3 shadow-2xl border-4 border-gray-700">
        {LIGHTS.map((light, i) => (
          <div
            key={light.color}
            className={`w-20 h-20 rounded-full transition-all duration-500 ${
              i === current ? light.activeClass : light.inactiveClass
            }`}
          />
        ))}
      </div>
      <span className="text-lg font-semibold capitalize text-gray-700">
        {LIGHTS[current].color}
      </span>
    </div>
  )
}
