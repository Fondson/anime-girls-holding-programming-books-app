import { useState } from 'react'
import Lightbox from '~/components/lightbox'
import classes from '~/components/expandable-image.module.css'
import ExportedImage from 'next-image-export-optimizer'

interface ExpandableImageProps {
  src: string
  alt: string
  bottomRightSection?: React.ReactNode
  [key: string]: any
}

function ExpandableImage({ src, alt, bottomRightSection, ...rest }: ExpandableImageProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <Lightbox
        onExitHandler={() => setExpanded(false)}
        expanded={expanded}
        bottomRightSection={bottomRightSection}
      >
        {expanded && (
          <ExportedImage className={classes['lightbox-image']} src={src} alt={alt} fill />
        )}
      </Lightbox>
      <div
        className={classes['actual-image']}
        role="button"
        onClick={() => setExpanded(true)}
        onKeyPress={() => setExpanded(true)}
        tabIndex={0}
      >
        <ExportedImage src={src} alt={alt} {...rest} />
      </div>
    </>
  )
}

export default ExpandableImage
