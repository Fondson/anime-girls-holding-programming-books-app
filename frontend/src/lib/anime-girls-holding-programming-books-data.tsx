import { useFetch } from '@mantine/hooks'
import { useMemo } from 'react'

const GITHUB_REPO_URL =
  'https://api.github.com/repos/cat-milk/Anime-Girls-Holding-Programming-Books/git/trees/master?recursive=1'
const RAW_URL_PREFIX =
  'https://raw.githubusercontent.com/cat-milk/Anime-Girls-Holding-Programming-Books/master/'

type AnimeGirlsGithubData = {
  sha: string
  url: string
  tree: {
    path: string
    mode: string
    type: string
    sha: string
    size: number
    url: string
  }[]
  truncated: boolean
}

type AnimeGirlsPictureData = ReturnType<typeof useAnimeGirlsHoldingProgrammingBooksData>['data']

const useAnimeGirlsHoldingProgrammingBooksData = () => {
  const {
    data: rawData,
    loading,
    error,
    refetch,
    abort,
  } = useFetch<AnimeGirlsGithubData>(GITHUB_REPO_URL)

  const data = useMemo(
    () =>
      rawData?.tree
        .filter(
          ({ path }) => path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.jpeg'),
        )
        .map(({ path }) => {
          const pathSplit = path.split('/')
          return {
            path,
            url: `${RAW_URL_PREFIX}${pathSplit.map(encodeURIComponent).join('/')}`,
          }
        }),
    [rawData],
  )

  return { data, loading, error, refetch, abort }
}

export type { AnimeGirlsGithubData, AnimeGirlsPictureData }
export { useAnimeGirlsHoldingProgrammingBooksData, RAW_URL_PREFIX, GITHUB_REPO_URL }
