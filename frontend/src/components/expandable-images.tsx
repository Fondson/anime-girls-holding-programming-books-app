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
  bottomRightSection?: React.ReactNode | ((currentImage: ImageInfo) => React.ReactNode)
  [key: string]: any
}

function ExpandableImages({
  src,
  alt,
  images,
  initialImageIndex = 0,
  bottomRightSection,
  ...rest
}: ExpandableImagesProps) {
  const [expanded, setExpanded] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(initialImageIndex)

  // Reset currentIndex when initialImageIndex changes
  useEffect(() => {
    setCurrentIndex(initialImageIndex)
  }, [initialImageIndex])

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

  const handleClose = () => {
    setExpanded(false)
    setCurrentIndex(initialImageIndex)
  }

  if (!currentImage) {
    return null
  }

  const bottomRightContent =
    typeof bottomRightSection === 'function' ? bottomRightSection(currentImage) : bottomRightSection

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
        expanded={expanded}
        bottomRightSection={bottomRightContent}
        onNext={handleNext}
        onPrev={handlePrev}
        hasNext={currentIndex < images.length - 1}
        hasPrev={currentIndex > 0}
        nextImage={nextImage && renderImage(nextImage)}
        prevImage={prevImage && renderImage(prevImage)}
      >
        {expanded && renderImage(currentImage)}
      </Lightbox>
      <div
        className={classes['actual-image']}
        role="button"
        onClick={() => setExpanded(true)}
        onKeyPress={() => setExpanded(true)}
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
