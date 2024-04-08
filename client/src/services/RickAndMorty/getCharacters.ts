export function getCharacters(URL_API: string = 'https://rickandmortyapi.com/api/character') {
  const responseAPI = fetch(URL_API)
    .then(response => response.json())
  return responseAPI
}
