const GITHUB_REPO_URL =
  'https://api.github.com/repos/cat-milk/Anime-Girls-Holding-Programming-Books/git/trees/master?recursive=1'
const RAW_URL_PREFIX =
  'https://raw.githubusercontent.com/cat-milk/Anime-Girls-Holding-Programming-Books/master/'

module.exports = fetch(GITHUB_REPO_URL).then((res) => {
  return res.json().then((data) => {
    return data.tree
      .filter(
        ({ path }) => path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.jpeg'),
      )
      .map(({ path }) => {
        const pathSplit = path.split('/')
        return `${RAW_URL_PREFIX}${pathSplit.map(encodeURIComponent).join('/')}`
      })
  })
})
