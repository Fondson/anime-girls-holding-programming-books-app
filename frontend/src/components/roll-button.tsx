import { Button, Kbd } from '@mantine/core'
import classes from '~/components/roll-button.module.css'
import React, { useCallback, useState } from 'react'
import { useHotkeys } from '@mantine/hooks'
import ExpandableImages from './expandable-images'
import { calculateRarity, RarityInfo, RarityRank, getRarityColor } from '~/lib/rarity'
import RarityAnimation from './rarity-animation'

interface ImageInfo {
  src: string
  alt: string
  path: string
}

interface RollButtonProps {
  images: ImageInfo[]
  fontFamily: string
}

const RollButton: React.FC<RollButtonProps> = ({ images, fontFamily }) => {
  const [isRolling, setIsRolling] = useState(false)
  const [selectedImage, setSelectedImage] = useState<ImageInfo | null>(null)
  const [showImage, setShowImage] = useState(false)
  const [rarityInfo, setRarityInfo] = useState<RarityInfo | null>(null)
  const [showRarityAnimation, setShowRarityAnimation] = useState(false)
  const [animationTrigger, setAnimationTrigger] = useState(0)

  const handleRoll = () => {
    if (isRolling || !images || images.length === 0) return
    setIsRolling(true)
    setShowImage(false)
    setShowRarityAnimation(false)
    setSelectedImage(null)
    setRarityInfo(null)

    // Random selection from images array
    const randomIndex = Math.floor(Math.random() * images.length)
    const newImage = images[randomIndex]

    // Calculate rarity
    const rarity = calculateRarity(newImage.path, images)

    setSelectedImage(newImage)
    setRarityInfo(rarity)
    setShowImage(true)
    setShowRarityAnimation(true)
    setAnimationTrigger((prev) => prev + 1)
    setIsRolling(false)
  }

  const handleClose = () => {
    setSelectedImage(null)
    setShowRarityAnimation(false)
    setRarityInfo(null)
  }

  useHotkeys([
    [
      'r',
      () => {
        if (selectedImage !== null) {
          // If modal is open and R is pressed, roll a new one
          handleRoll()
          return
        }
        // If modal is closed and R is pressed, open it with a roll
        if (
          document.activeElement instanceof HTMLInputElement ||
          document.activeElement instanceof HTMLTextAreaElement
        ) {
          return
        }
        handleRoll()
      },
    ],
  ])

  return (
    <>
      <Button
        className={classes['roll-button']}
        onClick={handleRoll}
        disabled={isRolling || images.length === 0}
        rightSection={
          <Kbd size="xs" className={classes['hide-on-mobile']}>
            R
          </Kbd>
        }
        style={{ fontFamily }}
      >
        💫 Waifu Gacha
      </Button>
      {selectedImage && (
        <div hidden>
          <ExpandableImages
            images={[selectedImage]}
            initialImageIndex={0}
            expanded={true}
            onClose={handleClose}
            fill
            topRightSection={(currentImage) => (
              <a
                href={currentImage.src}
                target="_blank"
                rel="noopener noreferrer"
                className={`${classes['image-web-link']} web-link`}
              >
                {currentImage.path}
              </a>
            )}
          />
        </div>
      )}
      {showRarityAnimation && rarityInfo && (
        <RarityAnimation rank={rarityInfo.rank} trigger={animationTrigger} />
      )}
    </>
  )
}

export default RollButton
