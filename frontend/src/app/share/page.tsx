'use client'

import { useEffect, useState, Suspense } from 'react'
import styles from './page.module.css'
import { useSearchParams } from 'next/navigation'
import { calculateRarity, RarityInfo } from '~/lib/rarity'
import RarityAnimation from '~/components/rarity-animation'
import { useAnimeGirlsHoldingProgrammingBooksData } from '~/lib/anime-girls-holding-programming-books-data'
import { Button, Text, Kbd } from '@mantine/core'
import { useHotkeys } from '@mantine/hooks'
import { IconDice } from '@tabler/icons-react'
import Link from 'next/link'
import { Gaegu } from 'next/font/google'
import { useRouter } from 'next/navigation'

const gaegu = Gaegu({ weight: ['400', '700'], subsets: ['latin'] })

interface SharedRollData {
  imageUrl: string | null
  imagePath: string | null
  rarityInfo: RarityInfo | null
  error: string | null
}

// Create a new client component for the content that uses useSearchParams
function ShareContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: images, error: imagesError } = useAnimeGirlsHoldingProgrammingBooksData()
  const [rollData, setRollData] = useState<SharedRollData>({
    imageUrl: null,
    imagePath: null,
    rarityInfo: null,
    error: null,
  })
  const [animationTrigger, setAnimationTrigger] = useState(0)

  useEffect(() => {
    try {
      const base64Url = searchParams.get('i')
      if (!base64Url) {
        setRollData((prev) => ({ ...prev, error: '404: Could not load programming waifu' }))
        return
      }

      const imagePath = atob(base64Url)
      // Construct the full GitHub raw URL
      const imageUrl = `https://raw.githubusercontent.com/cat-milk/Anime-Girls-Holding-Programming-Books/master/${encodeURIComponent(imagePath)}`

      // Calculate rarity if we have the images data
      let rarityInfo = null
      if (images) {
        rarityInfo = calculateRarity(imagePath, images)
      }

      setRollData({ imageUrl, imagePath, rarityInfo, error: null })
      setAnimationTrigger((prev) => prev + 1)
    } catch (e) {
      console.error('Error parsing share link:', e)
      setRollData((prev) => ({ ...prev, error: '404: Could not load programming waifu' }))
    }
  }, [searchParams, images])

  const handleRoll = () => {
    router.push('/?roll=true')
  }

  useHotkeys([['r', handleRoll]])

  return (
    <div className={styles['share-container']}>
      <div className={styles.content}>
        {rollData.error && <div className={styles['error-text']}>{rollData.error}</div>}

        <div className={styles['main-content']}>
          {rollData.imageUrl && !rollData.error && (
            <div className={styles['roll-display']}>
              <div className={styles['image-wrapper']}>
                <Link href={rollData.imageUrl} target="_blank" rel="noopener noreferrer">
                  <img
                    src={rollData.imageUrl}
                    alt="Shared gacha roll"
                    className={styles['shared-image']}
                  />
                </Link>
                {rollData.rarityInfo && (
                  <div className={styles['rarity-wrapper']}>
                    <RarityAnimation rank={rollData.rarityInfo.rank} trigger={animationTrigger} />
                  </div>
                )}
              </div>
              {rollData.imagePath && (
                <div className={styles['image-path']}>{rollData.imagePath}</div>
              )}
            </div>
          )}

          <div className={styles.cta}>
            <Text className={styles['cta-text']} style={{ fontFamily: gaegu.style.fontFamily }}>
              {rollData.rarityInfo?.rank ? (
                <>
                  Someone rolled a{' '}
                  <span style={{ color: 'var(--mantine-color-pink-6)', fontWeight: 700 }}>
                    {rollData.rarityInfo.rank}-Rank
                  </span>{' '}
                  programming waifu!
                  <br />
                  {rollData.rarityInfo.rank === 'SSS' ? (
                    <span className={styles['emoji-wrap']}>
                      Can you match this perfect roll? 🌟
                    </span>
                  ) : (
                    <span className={styles['emoji-wrap']}>Think you can beat this? ✨</span>
                  )}
                </>
              ) : (
                <>
                  <span className={styles['emoji-wrap']}>
                    Ready to gacha programming waifus? 🎲
                  </span>
                </>
              )}
            </Text>
            <Button
              component={Link}
              href="/?roll=true"
              size="lg"
              className={styles['roll-button']}
              leftSection={<IconDice size={24} />}
              rightSection={
                <div className={styles['hide-mobile']}>
                  <Kbd>R</Kbd>
                </div>
              }
              style={{ fontFamily: gaegu.style.fontFamily }}
            >
              Enter gacha hell
            </Button>
          </div>
        </div>
        <div className={styles['mobile-spacer']} />
      </div>
    </div>
  )
}

// Main page component
export default function SharePage() {
  return (
    <div className={styles.page}>
      <Suspense fallback={<div />}>
        <ShareContent />
      </Suspense>
    </div>
  )
}
