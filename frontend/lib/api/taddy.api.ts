export async function taddyGraphQL(query: string, variables = {}) {
  const TADDY_API_KEY = process.env.EXPO_PUBLIC_TADDY_API_KEY
  const TADDY_USER_ID = process.env.EXPO_PUBLIC_TADDY_USER_ID
  const TADDY_API_URL = process.env.EXPO_PUBLIC_TADDY_API_URL

  // console.log(query, variables)

  const response = await fetch(TADDY_API_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": TADDY_API_KEY as string,
      "X-USER-ID": TADDY_USER_ID as string,
    },
    body: JSON.stringify({ query, variables }),
  })

  const json = await response.json()
  const dataObject = JSON.parse(JSON.stringify(json, null, 2))

  if (json.errors) throw new Error(json.errors.map((e: any) => e.message).join("\n"))

  return dataObject.data.search.podcastSeries
}

export async function fetchPodcasts({ search, genres }: { search?: string; genres?: string[] }) {
  const query = `
    query($search: String, $genres: [Genre]) {
      search(term: $search, filterForGenres: $genres) {
        searchId
        podcastSeries {
          uuid
          name
          description
          imageUrl
          episodes {
            uuid
            audioUrl
            imageUrl
            name
            duration
          }
          hash
          genres
          totalEpisodesCount
        }
      }
    }
  `

  const vars = { search, genres }
  const data = await taddyGraphQL(query, vars)
  return data
}
