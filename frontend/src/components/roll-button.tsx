import { Button, Kbd } from '@mantine/core'
import { IconShare, IconCheck } from '@tabler/icons-react'
import classes from '~/components/roll-button.module.css'
import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { useHotkeys, useClipboard } from '@mantine/hooks'
import ExpandableImages from './expandable-images'
import { calculateRarity, RarityInfo } from '~/lib/rarity'
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

export interface RollButtonRef {
  triggerRoll: () => void
}

const RollButton = forwardRef<RollButtonRef, RollButtonProps>(({ images, fontFamily }, ref) => {
  const [isRolling, setIsRolling] = useState(false)
  const [selectedImage, setSelectedImage] = useState<ImageInfo | null>(null)
  const [rarityInfo, setRarityInfo] = useState<RarityInfo | null>(null)
  const [showRarityAnimation, setShowRarityAnimation] = useState(false)
  const [animationTrigger, setAnimationTrigger] = useState(0)
  const [showCopied, setShowCopied] = useState(false)
  const clipboard = useClipboard({ timeout: 2000 })

  const handleRoll = () => {
    if (isRolling || !images || images.length === 0) return
    setIsRolling(true)
    setShowRarityAnimation(false)
    setSelectedImage(null)
    setRarityInfo(null)
    setShowCopied(false)

    const randomIndex = Math.floor(Math.random() * images.length)
    const newImage = images[randomIndex]
    const rarity = calculateRarity(newImage.path, images)

    setSelectedImage(newImage)
    setRarityInfo(rarity)
    setShowRarityAnimation(true)
    setAnimationTrigger((prev) => prev + 1)
    setIsRolling(false)
  }

  useImperativeHandle(ref, () => ({
    triggerRoll: handleRoll,
  }))

  const generateShareUrl = () => {
    if (selectedImage && typeof window !== 'undefined') {
      const basePath = '/share'
      const base64Path = btoa(selectedImage.path)
      return `${window.location.origin}${basePath}?i=${base64Path}`
    }
    return ''
  }

  const handleShare = () => {
    if (!selectedImage) return
    const url = generateShareUrl()
    clipboard.copy(url)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 2000)
  }

  useHotkeys([
    ['r', handleRoll],
    ['s', handleShare],
  ])

  return (
    <>
      {selectedImage && (
        <div hidden>
          <ExpandableImages
            images={[selectedImage]}
            initialImageIndex={0}
            expanded={true}
            fill
            onClose={() => {
              setSelectedImage(null)
              setRarityInfo(null)
              setShowRarityAnimation(false)
              setShowCopied(false)
            }}
            topRightSection={(currentImage) => (
              <>
                <a
                  href={currentImage.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${classes['image-web-link']} web-link`}
                >
                  {currentImage.path}
                </a>
              </>
            )}
          />
        </div>
      )}

      {selectedImage && rarityInfo && !isRolling && (
        <div className={classes['controls-container']}>
          {showRarityAnimation && rarityInfo && (
            <RarityAnimation rank={rarityInfo.rank} trigger={animationTrigger} />
          )}
          <div
            className={classes['share-container']}
            title={showCopied ? 'Copied!' : 'Share this roll'}
          >
            {showCopied ? (
              <IconCheck size={20} className={classes['share-icon']} />
            ) : (
              <IconShare
                size={20}
                className={classes['share-icon']}
                style={{ cursor: 'pointer' }}
                onClick={handleShare}
              />
            )}
          </div>
        </div>
      )}

      <Button
        className={classes['roll-button']}
        onClick={handleRoll}
        disabled={isRolling}
        rightSection={
          <Kbd size="xs" className={classes['hide-on-mobile']}>
            R
          </Kbd>
        }
        style={{ fontFamily }}
      >
        💫 Waifu Gacha
      </Button>
    </>
  )
})

RollButton.displayName = 'RollButton'

export default RollButton
