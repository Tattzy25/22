"use client"

import { Button } from "@/components/ui/button"

interface ModelCardProps {
  name: string
  provider: string
  capabilities: string[]
  onTry?: () => void
  status?: 'available' | 'unavailable' | 'idle'
}

export function ModelCard({
  name,
  provider,
  capabilities,
  onTry,
  status = 'available'
}: ModelCardProps) {
  const isAvailable = status === 'available'

  return (
    <div className="w-[260px] bg-gradient-to-tr from-purple-500 via-blue-500 to-blue-400 via-40% to-blue-300 via-65% to-purple-500 p-1 rounded-[32px] flex flex-col">
      {/* Title Card */}
      <div className="flex items-center justify-between p-4 px-[18px] pb-0.5 text-white">
        <p className="text-xl font-semibold italic text-shadow-[2px_2px_6px_#2975ee] font-audiowide text-[#13181f] uppercase truncate flex-1 min-w-0">{provider}</p>
        <div className={`w-3 h-3 rounded-full ml-2 ${isAvailable ? 'bg-green-400 shadow-[0_0_10px_#00ff00,0_0_20px_#00ff00,0_0_30px_#00ff00]' : 'bg-gray-500'}`}></div>
      </div>

      {/* Card Content */}
      <div className="w-full h-full bg-[#161a20] rounded-[30px] text-[#838383] text-xs pt-2 pb-4 px-4 flex flex-col gap-3.5">
        <p className="font-normal text-white text-center font-audiowide truncate" style={{ 
          fontSize: '28px',
          textShadow: `
            0 0 0 #000000,
            2px 2px 0 #00000040,
            -2px -2px 0 #00000020,
            2px -2px 0 #00000030,
            -2px 2px 0 #00000025
          `
        }}>{name}</p>

        <div className="flex flex-col gap-1 h-[80px] justify-start">
          {capabilities.slice(0, 4).map((capability, index) => (
            <p key={index} className="text-white truncate" style={{ 
              fontSize: '16px',
              textShadow: `
                0 0 0 #000000,
                2px 2px 0 #00000040,
                -2px -2px 0 #00000020,
                2px -2px 0 #00000030,
                -2px 2px 0 #00000025
              `
            }}>• {capability}</p>
          ))}
        </div>

        <div className="flex justify-center mt-auto">
          <Button
            className="bg-gradient-to-tr from-purple-500 via-blue-500 to-blue-400 via-40% to-blue-300 via-65% to-purple-500 pt-0.5 pb-0.5 px-1 border-none rounded-lg font-audiowide font-normal transition-all duration-300 ease-in-out cursor-pointer shadow-[inset_0_2px_4px_rgba(255,255,255,0.6)] hover:text-white hover:text-shadow-[0_0_8px_#fff] hover:scale-[1.03] active:scale-100"
            style={{ 
              fontSize: '24px',
              color: '#13181f',
              textShadow: '2px 2px 6px #ffffff'
            }}
            disabled={!isAvailable}
            onClick={onTry}
          >
            TAP TO TRY
          </Button>
        </div>
      </div>
    </div>
  )
}