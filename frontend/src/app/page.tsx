'use client'

import {
  TextInput,
  useMantineTheme,
  Text,
  Box,
  Popover,
  PopoverTarget,
  PopoverDropdown,
  Button,
  Code,
} from '@mantine/core'
import FlexSearch from 'flexsearch'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useAnimeGirlsHoldingProgrammingBooksData } from '~/lib/anime-girls-holding-programming-books-data'
import { useDebouncedValue, useMediaQuery } from '@mantine/hooks'
import AutoGrid from '~/components/auto-grid'
import classes from '~/app/page.module.css'
import ExpandableImage from '~/components/expandable-image'
import shuffle from 'lodash-es/shuffle'
import CuteLoader from '~/components/cute-loader'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Gaegu } from 'next/font/google'
import ExportedImage from 'next-image-export-optimizer'
import logo from '~/icons/logo.png'
import notFoundIcon from '~/icons/not-found.webp'

const gaegu = Gaegu({ weight: ['400', '700'], subsets: ['latin'] })

function Home() {
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`)
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const { data, loading, error, refetch, abort } = useAnimeGirlsHoldingProgrammingBooksData()
  const [searchValue, setSearchValue] = useState(searchParams.get('q') || '')
  const [searchResults, setSearchResults] = useState<number[]>([])
  const [workerReady, setWorkerReady] = useState(false)
  const [debouncedSearchValue] = useDebouncedValue(searchValue, 500)
  const gridRef = useRef<HTMLDivElement>(null)

  const [indexProgress, setIndexProgress] = useState(0)

  const worker = useMemo(() => new FlexSearch.Index({ preset: 'default', tokenize: 'forward' }), [])
  useEffect(() => {
    const addData = async () => {
      if (data && !loading && worker && !workerReady) {
        // https://dev.to/bytebodger/updating-react-state-inside-loops-2dbf
        const delay = () => new Promise((resolve) => setTimeout(resolve, 0))

        for (let i = 0; i < data.length; i++) {
          worker.add(i, data[i].path)
          setIndexProgress(i / data.length)
          if (i % 100 === 0) await delay()
        }
        setWorkerReady(true)
      }
    }

    addData()
  }, [data, loading, worker, workerReady])

  useEffect(() => {
    if (!workerReady) return

    if (debouncedSearchValue.length > 0) {
      const results = worker.search(debouncedSearchValue)
      setSearchResults(results.map((i) => parseInt(i as string)))
    } else {
      setSearchResults(
        shuffle(
          Array.from({ length: data?.length || 0 })
            .fill(0)
            .map((_, i) => i),
        ),
      )
    }

    const params = new URLSearchParams(searchParams)
    if (debouncedSearchValue.length > 0) {
      params.set('q', debouncedSearchValue)
    } else {
      params.delete('q')
    }
    replace(`${pathname}?${params.toString()}`)

    if (gridRef.current) gridRef.current.scroll({ top: 0, behavior: 'auto' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchValue, data, workerReady])

  const onSearchValueChange = (val: string) => {
    setSearchValue(val)
  }

  const searchBar = (
    <TextInput
      classNames={{ root: classes['search-bar'], input: classes['search-bar-input'] }}
      placeholder="Search"
      value={searchValue}
      onChange={(event) => onSearchValueChange(event.currentTarget.value)}
      // autofocus input and move cursor to the end
      // @ts-ignore
      ref={(textInputRef) => textInputRef && textInputRef.focus()}
      onFocus={(e) =>
        e.currentTarget.setSelectionRange(
          e.currentTarget.value.length,
          e.currentTarget.value.length,
        )
      }
    />
  )

  return (
    <main className={classes['page']}>
      <CuteLoader progress={indexProgress} />

      <div className={classes['header']}>
        <div className={`${classes['left']}`}>
          <Box className={`${classes['home']} nostyle`} component={'a'} href="/">
            <ExportedImage src={logo} alt="Anime Girls Holding Programming Books" height={25} />
            <Text fw={700} size="xl" style={{ fontFamily: gaegu.style.fontFamily }}>
              {isMobile ? 'AGHPB' : 'Anime Girls Holding Programming Books'.toUpperCase()}
            </Text>
          </Box>
        </div>
        <div className={`${classes['right']}`}>
          {!isMobile && searchBar}
          <Popover width={isMobile ? 300 : 400}>
            <PopoverTarget>
              <Button
                className={classes['about-button']}
                variant="transparent"
                size={'compact-xl'}
                style={{ fontFamily: gaegu.style.fontFamily }}
              >
                About
              </Button>
            </PopoverTarget>
            <PopoverDropdown>
              <Text span>{'This site is a web viewer and search engine for the images in '}</Text>
              <span>
                <a
                  className="web-link"
                  href="https://github.com/cat-milk/Anime-Girls-Holding-Programming-Books"
                  target="_blank"
                >
                  this Github repo
                </a>
              </span>
            </PopoverDropdown>
          </Popover>
        </div>
      </div>

      {isMobile && searchBar}

      {data &&
        (searchResults.length > 0 ? (
          <AutoGrid
            rowHeight="40vh"
            minItemWidth={isMobile ? '48%' : '33%'}
            gap="2px"
            gridRef={gridRef}
          >
            {searchResults.map((i) => (
              <ExpandableImage
                className={`${classes['grid-image']}`}
                key={data[i].path}
                src={data[i].url}
                alt={data[i].path}
                fill
                sizes={`(max-width: ${theme.breakpoints.md}) 48vw, 33vw`}
                bottomRightSection={
                  <a
                    href={data[i].url}
                    target="_blank"
                    className={`${classes['image-web-link']} web-link`}
                  >
                    {data[i].path}
                  </a>
                }
              />
            ))}
          </AutoGrid>
        ) : (
          <div className={classes['not-found-container']}>
            <ExportedImage src={notFoundIcon} alt="No results found" height={150} />
            <Code>{`console.log('No results found')`}</Code>
          </div>
        ))}
    </main>
  )
}

export default function HomeWrapper() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  )
}
