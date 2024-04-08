export interface CharactersInfos {
  count: number
  pages: number
  next: string
  prev: string
}
interface Location {
  name: string
  url: string
}

interface Origin extends Location {}

export interface CharactersResults {
  id: number
  name: string
  status: string
  species: string
  type: string
  gender: string
  origin: Origin
  location: Location
  image: string
  episode: string[]
  url: string
  created: string
}
