import { useEffect, useRef, useState, useCallback } from 'react'
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
  nextImage?: React.ReactNode
  prevImage?: React.ReactNode
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
  nextImage,
  prevImage,
}: LightboxProps) {
  const [startX, setStartX] = useState(0)
  const [offsetX, setOffsetX] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [pendingImageChange, setPendingImageChange] = useState<'next' | 'prev' | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const mouseDownPosRef = useRef<{ x: number; y: number } | null>(null)
  // Using a ref instead of state for drag tracking because:
  // 1. We need synchronous updates during drag events to avoid race conditions
  // 2. Changes to this value shouldn't trigger re-renders
  // 3. We need to reliably distinguish between clicks and drags immediately
  const hasDraggedRef = useRef(false)
  const dragThreshold = 5 // pixels of movement before considering it a drag

  const animateTransition = useCallback(
    (targetOffset: number, direction: 'next' | 'prev' | null, onComplete?: () => void) => {
      if (isTransitioning) return

      setIsTransitioning(true)
      setPendingImageChange(direction)
      const duration = 300
      const startTime = performance.now()
      const startOffset = offsetX

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2
        const currentOffset = startOffset + (targetOffset - startOffset) * easeProgress

        setOffsetX(currentOffset)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          if (direction !== null) {
            onComplete?.()
            setPendingImageChange(null)
            setOffsetX(0)
          } else {
            setOffsetX(0)
            setPendingImageChange(null)
          }
          setIsTransitioning(false)
          hasDraggedRef.current = false
          mouseDownPosRef.current = null
        }
      }

      requestAnimationFrame(animate)
    },
    [isTransitioning, offsetX],
  )

  const handleDragStart = (clientX: number, clientY?: number) => {
    if (isTransitioning) return
    hasDraggedRef.current = false
    setStartX(clientX - offsetX)
    mouseDownPosRef.current = { x: clientX, y: clientY ?? 0 }
  }

  const handleDragMove = (clientX: number, clientY?: number) => {
    if (isTransitioning) return

    if (!hasDraggedRef.current && mouseDownPosRef.current !== null) {
      const deltaX = Math.abs(clientX - mouseDownPosRef.current.x)
      const deltaY = Math.abs((clientY ?? 0) - mouseDownPosRef.current.y)

      if (deltaX > dragThreshold || deltaY > dragThreshold) {
        hasDraggedRef.current = true
      }
    }

    if (hasDraggedRef.current) {
      const currentOffset = clientX - startX
      const maxOffset = window.innerWidth
      const boundedOffset = Math.max(Math.min(currentOffset, maxOffset), -maxOffset)
      setOffsetX(boundedOffset)
    }
  }

  const handleDragEnd = () => {
    if (mouseDownPosRef.current === null) return

    if (!hasDraggedRef.current || isTransitioning) {
      mouseDownPosRef.current = null
      hasDraggedRef.current = false
      return
    }

    const threshold = window.innerWidth * 0.15

    if (offsetX > threshold && hasPrev) {
      animateTransition(window.innerWidth, 'prev', onPrev)
    } else if (offsetX < -threshold && hasNext) {
      animateTransition(-window.innerWidth, 'next', onNext)
    } else {
      animateTransition(0, null)
    }
  }

  // Get normalized coordinates from either mouse or touch event
  const getCoordinates = (
    e: React.MouseEvent | React.TouchEvent,
  ): { clientX: number; clientY: number } | null => {
    if ('touches' in e) {
      if (e.touches.length > 0) return e.touches[0]
      if ('changedTouches' in e && e.changedTouches.length > 0) return e.changedTouches[0]
      return null
    }
    return e
  }

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const coords = getCoordinates(e)
    if (!coords) return
    handleDragStart(coords.clientX, coords.clientY)
  }

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const coords = getCoordinates(e)
    if (!coords) return
    handleDragMove(coords.clientX, coords.clientY)
  }

  const handleEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const coords = getCoordinates(e)
    if (mouseDownPosRef.current !== null && coords) {
      const deltaX = Math.abs(coords.clientX - mouseDownPosRef.current.x)
      const deltaY = Math.abs(coords.clientY - mouseDownPosRef.current.y)

      // If it was a click/tap (minimal movement) and not dragging, close the lightbox
      if (
        deltaX <= dragThreshold &&
        deltaY <= dragThreshold &&
        !hasDraggedRef.current &&
        !isTransitioning
      ) {
        onExitHandler()
        mouseDownPosRef.current = null
        return
      }
    }
    handleDragEnd()
  }

  const handleLeave = (e: React.MouseEvent) => {
    e.preventDefault()
    mouseDownPosRef.current = null
  }

  // Reset offset when image changes
  useEffect(() => {
    if (!pendingImageChange) {
      setOffsetX(0)
    }
  }, [children])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!expanded) return
      if (e.key === 'ArrowRight' && onNext && hasNext) {
        e.preventDefault()
        animateTransition(-window.innerWidth, 'next', onNext)
      } else if (e.key === 'ArrowLeft' && onPrev && hasPrev) {
        e.preventDefault()
        animateTransition(window.innerWidth, 'prev', onPrev)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onExitHandler()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [expanded, onNext, onPrev, hasNext, hasPrev, onExitHandler, animateTransition])

  return (
    <ModalUnderlay expanded={expanded} onExitHandler={onExitHandler}>
      <div
        className={classes['lightbox']}
        tabIndex={0}
        role="dialog"
        aria-modal="true"
        aria-label="Image lightbox"
        onKeyPress={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onExitHandler()
        }}
      >
        <div
          ref={contentRef}
          className={classes['content-wrapper']}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleLeave}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          role="presentation"
        >
          <div
            className={classes['images-container']}
            style={{
              transform: `translateX(${offsetX}px)`,
              willChange: 'transform',
            }}
          >
            {hasPrev && prevImage && (
              <div
                className={classes['prev-image']}
                aria-hidden="true"
                style={{
                  opacity: offsetX > 0 ? 1 : 0,
                  pointerEvents: 'none',
                }}
              >
                {prevImage}
              </div>
            )}
            <div className={classes['current-image']} role="img" aria-label="Current image">
              {children}
            </div>
            {hasNext && nextImage && (
              <div
                className={classes['next-image']}
                aria-hidden="true"
                style={{
                  opacity: offsetX < 0 ? 1 : 0,
                  pointerEvents: 'none',
                }}
              >
                {nextImage}
              </div>
            )}
          </div>
        </div>
        {(hasNext || hasPrev) && (
          <div className={classes['navigation-controls']} role="navigation">
            {hasPrev && (
              <button
                className={`${classes['nav-button']} ${classes['prev']}`}
                onClick={(e) => {
                  e.stopPropagation()
                  animateTransition(window.innerWidth, 'prev', onPrev)
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
                  animateTransition(-window.innerWidth, 'next', onNext)
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
