import { Box } from '@mantine/core'
import classes from '~/components/auto-grid.module.css'

interface AutoGridProps {
  gridRef?: React.Ref<HTMLDivElement>
  rowHeight?: string
  minItemWidth?: string
  gap?: string
  children: React.ReactNode
}

function AutoGrid({ gridRef, rowHeight, minItemWidth, gap, children }: AutoGridProps) {
  return (
    <Box
      ref={gridRef}
      style={{
        '--row-height': rowHeight || 'auto',
        '--min-item-width': minItemWidth || '100px',
        '--gap': gap || 'var(--mantine-spacing-xs)',
      }}
      className={classes['container']}
    >
      {children}
    </Box>
  )
}

export default AutoGrid
