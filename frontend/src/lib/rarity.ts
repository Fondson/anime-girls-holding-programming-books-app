export type RarityRank = 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS'

export interface RarityInfo {
  rank: RarityRank
  appearanceRate: number
}

const RARITY_THRESHOLDS: { [key in RarityRank]: number } = {
  SSS: 0.001, // 0.1%
  SS: 0.005, // 0.5%
  S: 0.01, // 1%
  A: 0.05, // 5%
  B: 0.1, // 10%
  C: 0.2, // 20%
  D: 1.0, // 100%
}

export function calculateRarity(imagePath: string, allImages: { path: string }[]): RarityInfo {
  // Extract unique words from the target image's path
  const targetImageWordsArray = Array.from(
    new Set(imagePath.split(/[/_]/).filter((word) => word.length > 0)),
  )

  if (targetImageWordsArray.length === 0) {
    // Handle cases where the image path has no parsable words, assign lowest rarity
    return { rank: 'D', appearanceRate: 1.0 }
  }

  const otherImages = allImages.filter((img) => img.path !== imagePath)
  if (otherImages.length === 0) {
    // If no other images, consider it unique (highest rarity) or common (lowest) based on preference.
    // Here, choosing common as a safe default if it's the only image.
    return { rank: 'D', appearanceRate: 1.0 }
  }

  // Track all *other* images that share at least one word with the target image
  const matchingImagePaths = new Set<string>()

  otherImages.forEach((otherImg) => {
    const otherImageWords = new Set(otherImg.path.split(/[/_]/).filter((word) => word.length > 0))
    const hasIntersection = targetImageWordsArray.some((targetWord) =>
      otherImageWords.has(targetWord),
    )

    if (hasIntersection) {
      matchingImagePaths.add(otherImg.path)
    }
  })

  // Calculate appearance rate: proportion of *other* images that share keywords.
  // A higher proportion means the target image is more common.
  const appearanceRate = matchingImagePaths.size / otherImages.length

  // Determine rarity rank based on appearance rate
  let rank: RarityRank = 'D' // Default to lowest if no thresholds met (shouldn't happen with D=1.0)
  for (const [r, threshold] of Object.entries(RARITY_THRESHOLDS).sort(([, a], [, b]) => a - b)) {
    // Sort thresholds to ensure we check from rarest to most common
    if (appearanceRate <= threshold) {
      rank = r as RarityRank
      break
    }
  }

  return { rank, appearanceRate }
}

export function getRarityColor(rank: RarityRank): string {
  const colors = {
    D: '#808080', // Gray
    C: '#00FF00', // Green
    B: '#0000FF', // Blue
    A: '#800080', // Purple
    S: '#FFD700', // Gold
    SS: '#FF69B4', // Pink
    SSS: '#FF0000', // Red
  }
  return colors[rank]
}
