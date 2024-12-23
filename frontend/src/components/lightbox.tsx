import { useEffect } from 'react'
import ModalUnderlay from '~/components/modal-underlay'
import classes from '~/components/lightbox.module.css'

interface LightboxProps {
  onExitHandler: () => void
  expanded: boolean
  bottomRightSection?: React.ReactNode
  children: React.ReactNode
  onNext?: () => void
  onPrev?: () => void
  hasNext?: boolean
  hasPrev?: boolean
}

function Lightbox({
  onExitHandler,
  expanded,
  bottomRightSection,
  children,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!expanded) return
      if (e.key === 'ArrowRight' && onNext && hasNext) {
        e.preventDefault()
        onNext()
      } else if (e.key === 'ArrowLeft' && onPrev && hasPrev) {
        e.preventDefault()
        onPrev()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onExitHandler()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [expanded, onNext, onPrev, hasNext, hasPrev, onExitHandler])

  return (
    <ModalUnderlay allowExitAnywhere expanded={expanded} onExitHandler={onExitHandler}>
      <div
        className={classes['lightbox']}
        tabIndex={0}
        role="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onExitHandler()
        }}
        onKeyPress={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onExitHandler()
        }}
      >
        {children}
        {(hasNext || hasPrev) && (
          <div className={classes['navigation-controls']}>
            {hasPrev && (
              <button
                className={`${classes['nav-button']} ${classes['prev']}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onPrev?.()
                }}
                aria-label="Previous image"
              >
                ‹
              </button>
            )}
            {hasNext && (
              <button
                className={`${classes['nav-button']} ${classes['next']}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onNext?.()
                }}
                aria-label="Next image"
              >
                ›
              </button>
            )}
          </div>
        )}
      </div>
      {bottomRightSection && (
        <div
          className={classes['bottom-right-section']}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          {bottomRightSection}
        </div>
      )}
    </ModalUnderlay>
  )
}

export default Lightbox
