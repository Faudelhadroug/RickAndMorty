const BASE_URL_API: string = 'https://rickandmortyapi.com/api/character'
export function getCharacters(URL_API: string = BASE_URL_API) {
  const responseAPI = fetch(URL_API)
    .then(response => response.json())
  return responseAPI
}

export function getCharactersWithName(name: string) {
  const responseAPI = fetch(`${BASE_URL_API}?name=${name}`)
    .then(response => response.json())
  return responseAPI
}
