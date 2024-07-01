import ModalUnderlay from '~/components/modal-underlay'
import classes from '~/components/lightbox.module.css'

interface LightboxProps {
  onExitHandler: () => void
  expanded: boolean
  bottomRightSection?: React.ReactNode
  children: React.ReactNode
}

function Lightbox({ onExitHandler, expanded, bottomRightSection, children }: LightboxProps) {
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
