import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import classes from '~/components/modal-underlay.module.css'

interface ModalUnderlayProps {
  children: React.ReactNode
  onExitHandler: () => void
  expanded?: boolean
  allowExitAnywhere?: boolean
  [key: string]: any
}

function ModalUnderlay({
  children,
  onExitHandler,
  expanded = false,
  allowExitAnywhere = false,
  ...rest
}: ModalUnderlayProps) {
  const modal = useRef<HTMLDivElement>(null)
  const clickPressHandler = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (!allowExitAnywhere && e.target !== modal.current) return
    e.preventDefault()
    e.stopPropagation()
    onExitHandler()
  }
  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [expanded])

  return createPortal(
    <div
      ref={modal}
      className={`${classes['modal-underlay']} ${expanded ? ` ${classes['modal-underlay--expanded']}` : ''}`}
      onClick={clickPressHandler}
      onKeyPress={clickPressHandler}
      tabIndex={0}
      role="button"
      {...rest}
    >
      {children}

      {/* Funnily enough, this fixes a long standing bug described here: https://stackoverflow.com/questions/14389566/stop-css-transition-from-firing-on-page-load */}
      <script> </script>
    </div>,
    document.body,
  )
}

export default ModalUnderlay
