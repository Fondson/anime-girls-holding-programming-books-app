import { useState, useEffect, useRef } from 'react'
import Lightbox from '~/components/lightbox'
import classes from '~/components/expandable-images.module.css'
import ExportedImage from 'next-image-export-optimizer'

interface ImageInfo {
  src: string
  alt: string
  path: string
}

interface ExpandableImagesProps {
  src?: string
  alt?: string
  images: ImageInfo[]
  initialImageIndex?: number
  expanded?: boolean
  onClose?: () => void
  bottomRightSection?: React.ReactNode | ((currentImage: ImageInfo) => React.ReactNode)
  topRightSection?: React.ReactNode | ((currentImage: ImageInfo) => React.ReactNode)
  onExpandChange?: (expanded: boolean) => void
  [key: string]: any
}

function ExpandableImages({
  src,
  alt,
  images,
  initialImageIndex = 0,
  expanded = false,
  onClose,
  bottomRightSection,
  topRightSection,
  onExpandChange,
  ...rest
}: ExpandableImagesProps) {
  const [isExpanded, setIsExpanded] = useState(expanded)
  const [currentIndex, setCurrentIndex] = useState(initialImageIndex)

  // Reset currentIndex when initialImageIndex changes
  useEffect(() => {
    setCurrentIndex(initialImageIndex)
  }, [initialImageIndex])

  // Update expanded state when prop changes
  useEffect(() => {
    setIsExpanded(expanded)
  }, [expanded])

  const currentImage = images[currentIndex]
  const nextImage = currentIndex < images.length - 1 ? images[currentIndex + 1] : null
  const prevImage = currentIndex > 0 ? images[currentIndex - 1] : null

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleOpen = () => {
    setIsExpanded(true)
    onExpandChange?.(true)
  }

  const handleClose = () => {
    setIsExpanded(false)
    setCurrentIndex(initialImageIndex)
    onClose?.()
    onExpandChange?.(false)
  }

  if (!currentImage) {
    return null
  }

  const bottomRightContent =
    typeof bottomRightSection === 'function' ? bottomRightSection(currentImage) : bottomRightSection
  const topRightContent =
    typeof topRightSection === 'function' ? topRightSection(currentImage) : topRightSection

  const renderImage = (image: ImageInfo) => (
    <ExportedImage
      className={classes['lightbox-image']}
      src={image.src}
      alt={image.alt}
      fill
      placeholder="empty"
    />
  )

  return (
    <>
      <Lightbox
        onExitHandler={handleClose}
        expanded={isExpanded}
        bottomRightSection={bottomRightContent}
        topRightSection={topRightContent}
        onNext={handleNext}
        onPrev={handlePrev}
        hasNext={currentIndex < images.length - 1}
        hasPrev={currentIndex > 0}
        nextImage={nextImage && renderImage(nextImage)}
        prevImage={prevImage && renderImage(prevImage)}
      >
        {isExpanded && renderImage(currentImage)}
      </Lightbox>
      <div
        className={classes['actual-image']}
        role="button"
        onClick={handleOpen}
        onKeyPress={handleOpen}
        tabIndex={0}
      >
        <ExportedImage
          src={images[initialImageIndex].src}
          alt={images[initialImageIndex].alt}
          {...rest}
        />
      </div>
    </>
  )
}

export default ExpandableImages
