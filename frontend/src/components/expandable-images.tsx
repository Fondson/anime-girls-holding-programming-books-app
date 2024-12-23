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
  const currentIndexRef = useRef(initialImageIndex)
  const [, forceUpdate] = useState({})

  // Reset currentIndexRef when initialImageIndex changes
  useEffect(() => {
    currentIndexRef.current = initialImageIndex
  }, [initialImageIndex])

  const currentImage = images[currentIndexRef.current]

  const handleNext = () => {
    if (currentIndexRef.current < images.length - 1) {
      currentIndexRef.current += 1
      forceUpdate({})
    }
  }

  const handlePrev = () => {
    if (currentIndexRef.current > 0) {
      currentIndexRef.current -= 1
      forceUpdate({})
    }
  }

  const handleClose = () => {
    setExpanded(false)
    currentIndexRef.current = initialImageIndex
  }

  if (!currentImage) {
    return null
  }

  const bottomRightContent =
    typeof bottomRightSection === 'function' ? bottomRightSection(currentImage) : bottomRightSection

  return (
    <>
      <Lightbox
        onExitHandler={handleClose}
        expanded={expanded}
        bottomRightSection={bottomRightContent}
        onNext={handleNext}
        onPrev={handlePrev}
        hasNext={currentIndexRef.current < images.length - 1}
        hasPrev={currentIndexRef.current > 0}
      >
        {expanded && (
          <ExportedImage
            className={classes['lightbox-image']}
            src={currentImage.src}
            alt={currentImage.alt}
            fill
            placeholder="empty"
          />
        )}
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
