import { Button, Kbd } from '@mantine/core'
import classes from '~/components/roll-button.module.css'
import React, { useCallback, useState } from 'react'
import { useHotkeys } from '@mantine/hooks'
import ExpandableImages from '~/components/expandable-images'

interface RollButtonProps {
  images: { src: string; alt: string; path: string }[]
  fontFamily?: string
}

const RollButton: React.FC<RollButtonProps> = ({ images, fontFamily }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  const handleRoll = useCallback(() => {
    if (!images || images.length === 0) return
    const randomIndex = Math.floor(Math.random() * images.length)
    setSelectedImageIndex(randomIndex)
  }, [images])

  useHotkeys([
    [
      'r',
      () => {
        if (selectedImageIndex !== null) {
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

  const handleClose = () => {
    setSelectedImageIndex(null)
  }

  return (
    <>
      <Button
        className={classes['roll-button']}
        onClick={handleRoll}
        disabled={selectedImageIndex !== null && images.length === 0}
        rightSection={
          <Kbd size="xs" className={classes['hide-on-mobile']}>
            R
          </Kbd>
        }
        style={{ fontFamily: fontFamily }}
      >
        💫 Waifu Gacha
      </Button>
      {selectedImageIndex !== null && images.length > 0 && (
        <div hidden>
          <ExpandableImages
            images={images.slice(selectedImageIndex, selectedImageIndex + 1)}
            initialImageIndex={0}
            expanded={true}
            onClose={handleClose}
            width={1}
            height={1}
            topRightSection={(currentImage) => (
              <a
                href={currentImage.src}
                target="_blank"
                className={`${classes['image-web-link']} web-link`}
              >
                {currentImage.path}
              </a>
            )}
          />
        </div>
      )}
    </>
  )
}

export default RollButton
