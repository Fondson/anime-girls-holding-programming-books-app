import { useEffect, useState } from 'react'
import { RarityRank, getRarityColor } from '~/lib/rarity'
import classes from './rarity-animation.module.css'

interface RarityAnimationProps {
  rank: RarityRank
  trigger: number // Add trigger to force animation replay
}

const RARITY_RANKS: RarityRank[] = ['D', 'C', 'B', 'A', 'S', 'SS', 'SSS']
const ANIMATION_DURATION = 250 // 0.25 seconds total
const FLASH_INTERVAL = 10 // Even faster flashing for smoother animation
const FINAL_PAUSE = 15 // Brief pause at final rank

export default function RarityAnimation({ rank, trigger }: RarityAnimationProps) {
  const [currentRank, setCurrentRank] = useState<RarityRank>(rank)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Reset to D rank when starting new animation
    setCurrentRank('D')
    setIsAnimating(true)

    let currentIndex = 0
    // Calculate steps to fit within animation duration minus final pause
    const totalSteps = Math.floor((ANIMATION_DURATION - FINAL_PAUSE) / FLASH_INTERVAL)

    const timer = setInterval(() => {
      if (currentIndex >= totalSteps) {
        clearInterval(timer)
        // Set final rank and wait for brief pause
        setTimeout(() => {
          setCurrentRank(rank)
          setIsAnimating(false)
        }, FINAL_PAUSE)
        return
      }

      // Flash through ranks with a smooth progression
      const progress = currentIndex / totalSteps
      const index = Math.min(Math.floor(progress * RARITY_RANKS.length), RARITY_RANKS.length - 1)
      setCurrentRank(RARITY_RANKS[index])
      currentIndex++
    }, FLASH_INTERVAL)

    return () => {
      clearInterval(timer)
    }
  }, [rank, trigger]) // Add trigger to dependencies

  return (
    <div
      className={classes.container}
      style={
        {
          '--rarity-color': getRarityColor(currentRank),
        } as React.CSSProperties
      }
    >
      <div className={`${classes.rank} ${isAnimating ? classes.animating : ''}`}>{currentRank}</div>
    </div>
  )
}
