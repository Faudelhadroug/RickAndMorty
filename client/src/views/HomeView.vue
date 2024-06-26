<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import { getCharacters, getCharactersWithName, getCharactersWithPage } from '@/services/RickAndMorty/index'
import type { CharactersInfos, CharactersResults } from '@/types/RickAndMorty/characters'
import CharacterCard from '@/components/Character/Card.vue'
import CharacterAnalystic from '@/components/Character/Analystic.vue'

const statusSpoil = ref<boolean>(false)
const charactersInfos = ref<CharactersInfos | null>(null)
const charactersResults = ref<CharactersResults[] | null>(null)
const loading = ref<boolean>(true)
const route = useRoute()

const actualPage = ref<number>(1)
function updatePage() {
  actualPage.value = charactersInfos.value && charactersInfos.value.next
    ? Number.parseInt(charactersInfos.value!.next.substring(charactersInfos.value!.next.indexOf('=') + 1)) - 1
    : charactersInfos.value?.prev ? Number.parseInt(charactersInfos.value!.prev.substring(charactersInfos.value!.prev.indexOf('=') + 1)) + 1 : 1
}
function addQueryToRouter() {
  updatePage()
  router.push({ query: { page: actualPage.value } })
}

async function loadData() {
  const { info, results } = await getCharacters()
  charactersInfos.value = info
  charactersResults.value = results
}

onBeforeMount(async () => {
  if (route.query && route.query.page) {
    const { info, results, error } = await getCharactersWithPage(route.query.page as string)
    charactersInfos.value = info
    charactersResults.value = results
    if (error)
      await loadData()

    addQueryToRouter()
    loading.value = false
  }
  else {
    await loadData()
    loading.value = false
  }
})

async function getNextCharacters() {
  loading.value = true
  const { info, results } = await getCharacters(charactersInfos.value?.next)
  charactersInfos.value = info
  charactersResults.value = results
  addQueryToRouter()
  loading.value = false
}

async function getPrevCharacters() {
  loading.value = true
  const { info, results } = await getCharacters(charactersInfos.value?.prev)
  charactersInfos.value = info
  charactersResults.value = results
  addQueryToRouter()
  loading.value = false
}

const modalDetailIsOpen = ref<boolean>(false)
const detailsCharacter = ref<null | CharactersResults>(null)
function openModalDetail(id: number | string) {
  modalDetailIsOpen.value = true
  const indexOfCharacter = charactersResults.value?.findIndex(x => x.id === id)
  if (indexOfCharacter !== -1 && indexOfCharacter !== undefined) {
    detailsCharacter.value = charactersResults.value![indexOfCharacter]
    document.getElementsByTagName('body')[0].classList.add('modal-open')
  }
}

function closeModalDetail() {
  modalDetailIsOpen.value = false
  document.getElementsByTagName('body')[0].classList.remove('modal-open')
}

const searchCharacter = ref<string>('')
async function addSearchQuery() {
  const { info, results } = await getCharactersWithName(searchCharacter.value)
  charactersInfos.value = info
  charactersResults.value = results
  addQueryToRouter()
  loading.value = false
}

async function resetData() {
  loading.value = true
  searchCharacter.value = ''
  await loadData()
  addQueryToRouter()
  loading.value = false
}
</script>

<template>
  <div v-if="modalDetailIsOpen" class="fixed top-0 left-0 w-full h-full z-20 flex flex-wrap items-center justify-center bg-[#4C5252]">
    <div v-if="detailsCharacter" class="bg-[#257074] outline xl:m-[5rem] p-[1rem] xl:p-[2rem] rounded-lg" style="outline-color: #F3F4F4">
      <div class="flex justify-end xl:hidden">
        <svg class="w-[32px] h-[32px] xl:w-[64px] xl:h-[64px]" width="211" height="212" viewBox="0 0 211 212" fill="none" xmlns="http://www.w3.org/2000/svg" @click="closeModalDetail">
          <g clip-path="url(#clip0_608_13)">
            <path d="M12.3342 46.9832L163.655 198.304L198.303 163.656L46.9824 12.3349L12.3342 46.9832Z" fill="#F2F3F3" />
            <path d="M199.011 164.363C186.124 151.476 167.92 148.785 158.352 158.352C148.785 167.92 151.476 186.124 164.363 199.011C177.25 211.898 195.454 214.589 205.022 205.022C214.589 195.454 211.898 177.25 199.011 164.363Z" fill="#F2F3F3" />
            <path d="M46.9827 12.3345C34.0954 -0.552825 15.8919 -3.24378 6.32408 6.32407C-3.24377 15.8919 -0.552817 34.0954 12.3345 46.9827C25.2218 59.87 43.4253 62.561 52.9931 52.9931C62.561 43.4253 59.87 25.2218 46.9827 12.3345Z" fill="#F2F3F3" />
            <path d="M164.19 13.1622L12.869 164.483L47.5173 199.131L198.838 47.8104L164.19 13.1622Z" fill="#F2F3F3" />
            <path d="M46.8101 199.838C59.6974 186.951 62.3884 168.747 52.8206 159.179C43.2527 149.612 25.0492 152.303 12.1619 165.19C-0.725386 178.077 -3.41634 196.281 6.15151 205.849C15.7194 215.416 33.9228 212.725 46.8101 199.838Z" fill="#F2F3F3" />
            <path d="M198.838 47.8101C211.725 34.9228 214.416 16.7193 204.849 7.15147C195.281 -2.41638 177.077 0.274575 164.19 13.1619C151.303 26.0492 148.612 44.2527 158.179 53.8205C167.747 63.3884 185.951 60.6974 198.838 47.8101Z" fill="#F2F3F3" />
          </g>
          <defs>
            <clipPath id="clip0_608_13">
              <rect width="211" height="212" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
      <div class="flex flex-col xl:flex-row xl:space-x-[2rem]">
        <div class="flex justify-center">
          <div class="w-2/3 xl:w-full pb-[1rem] xl:pb-0">
            <img width="256" height="256" :src="detailsCharacter.image" :alt="detailsCharacter.name" class="rounded-full">
          </div>
        </div>
        <div class="flex flex-col my-auto items-center w-fit mx-auto">
          <p class="font-bold text-2xl">
            Informations:
          </p>
          <p>Name: {{ detailsCharacter.name }}</p>
          <p>Status: <span v-if="statusSpoil">{{ detailsCharacter.status.charAt(0).toUpperCase() + detailsCharacter.status.slice(1) }}</span> <span v-else class="bg-black w-full">hidden spoiler</span></p>
          <p>Species: {{ detailsCharacter.species.charAt(0).toUpperCase() + detailsCharacter.species.slice(1) }}</p>
          <p v-if="detailsCharacter.type">
            Type: {{ detailsCharacter.type }}
          </p>
          <p>Gender: {{ detailsCharacter.gender }}</p>
          <p>Origin: {{ detailsCharacter.origin.name.charAt(0).toUpperCase() + detailsCharacter.origin.name.slice(1) }} </p>
          <p>Location: {{ detailsCharacter.location.name.charAt(0).toUpperCase() + detailsCharacter.location.name.slice(1) }} </p>
        </div>
        <svg class="w-[32px] h-[32px] xl:w-[64px] xl:h-[64px] hidden xl:block" width="211" height="212" viewBox="0 0 211 212" fill="none" xmlns="http://www.w3.org/2000/svg" @click="closeModalDetail">
          <g clip-path="url(#clip0_608_13)">
            <path d="M12.3342 46.9832L163.655 198.304L198.303 163.656L46.9824 12.3349L12.3342 46.9832Z" fill="#F2F3F3" />
            <path d="M199.011 164.363C186.124 151.476 167.92 148.785 158.352 158.352C148.785 167.92 151.476 186.124 164.363 199.011C177.25 211.898 195.454 214.589 205.022 205.022C214.589 195.454 211.898 177.25 199.011 164.363Z" fill="#F2F3F3" />
            <path d="M46.9827 12.3345C34.0954 -0.552825 15.8919 -3.24378 6.32408 6.32407C-3.24377 15.8919 -0.552817 34.0954 12.3345 46.9827C25.2218 59.87 43.4253 62.561 52.9931 52.9931C62.561 43.4253 59.87 25.2218 46.9827 12.3345Z" fill="#F2F3F3" />
            <path d="M164.19 13.1622L12.869 164.483L47.5173 199.131L198.838 47.8104L164.19 13.1622Z" fill="#F2F3F3" />
            <path d="M46.8101 199.838C59.6974 186.951 62.3884 168.747 52.8206 159.179C43.2527 149.612 25.0492 152.303 12.1619 165.19C-0.725386 178.077 -3.41634 196.281 6.15151 205.849C15.7194 215.416 33.9228 212.725 46.8101 199.838Z" fill="#F2F3F3" />
            <path d="M198.838 47.8101C211.725 34.9228 214.416 16.7193 204.849 7.15147C195.281 -2.41638 177.077 0.274575 164.19 13.1619C151.303 26.0492 148.612 44.2527 158.179 53.8205C167.747 63.3884 185.951 60.6974 198.838 47.8101Z" fill="#F2F3F3" />
          </g>
          <defs>
            <clipPath id="clip0_608_13">
              <rect width="211" height="212" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  </div>
  <div class="grid-container container-padding text-lg text-[#F3F4F4] bg-[#101919]">
    <h1 class="col-span-6 xl:col-span-12 text-center text-2xl xl:text-5xl font-bold pb-[2rem]">
      Find informations about Rick and Morty characters
    </h1>
    <div class="col-span-6 xl:col-span-12 flex flex-wrap justify-center xl:flex-nowrap pb-[1rem] xl:pb-0">
      <img v-for="character in charactersResults" :key="character.id" width="64" height="64" :src="character.image" :alt="character.name" class="hover:scale-125 hover:duration-200 hover:mx-[0.5rem]" @click="openModalDetail(character.id)">
    </div>
    <div class="col-span-6 md:col-span-4 md:col-start-2 xl:col-span-12 xl:col-start-2 xl:gap-[2rem] w-full text-center">
      <a href="https://github.com/afuh/rick-and-morty-api" target="_blank">
        <p class="underline font-bold text-red-400">The following data are deprecated, may contain error don't use it for any reference thanks !</p>
      </a>
      <a href="#analystic">
        <p class="text-[#C3F272] underline">Find analystic at the end of the page</p>
      </a>
    </div>
    <div class="col-span-6 xl:col-span-12">
      <div id="characterPaginationTop" class="flex justify-center items-center py-[2rem] space-x-[0.5rem] text-center xl:space-x-[2rem] rounded-lg outline" style="outline-color: #257074;">
        <button v-if="charactersInfos && charactersInfos.prev" class="px-[2rem] bg-[#C3F272] text-[#101919] btn-shape" @click="getPrevCharacters()">
          Prev
        </button>
        <p>Page {{ actualPage }} / {{ charactersInfos?.pages }}</p>
        <button v-if="charactersInfos && charactersInfos.next" class="px-[2rem] bg-[#87D5D9] text-[#101919] btn-shape" @click="getNextCharacters()">
          Next
        </button>
      </div>
      <div class="col-span-6 md:col-span-4 md:col-start-2 xl:col-span-12 xl:col-start-2 xl:gap-[2rem] w-full mt-[2rem]">
        <div class="flex flex-col px-[2rem]">
          <label for="searchBarCharacter" class="pb-[0.5rem]">Search a specific character</label>
          <div class="flex flex-col space-y-[1rem] xl:space-y-0 xl:flex-row xl:space-x-[1rem]">
            <input v-model="searchCharacter" id="searchBarCharacter" type="text" name="searchCharacter" class="py-[0.5rem] px-[1rem] text-[#101919]" @keyup.enter="addSearchQuery()">
            <input type="button" name="validSearch" value="Search now" class="bg-[#257074] text-[#f3f4f4] btn-shape" @click="addSearchQuery()">
            <p class="text-center flex items-center justify-center">or</p>
            <button class="btn-shape bg-[#5F0C0C] border-red-600 border-2 text-[#f3f4f4]" @click="resetData()">
              Reset query
            </button>
            <div class="xl:pl-[2rem]">
            </div>
          </div>
          <div class="py-[2rem] space-x-[1rem]">
            <label for="statusSpoil">Display spoiler status of the character</label>
            <input id="statusSpoil" v-model="statusSpoil" type="checkbox" name="statusSpoil">
          </div>
        </div>
      </div>
      <div v-if="Array.isArray(charactersResults) && !loading" id="listCharacters" class="grid-container py-[2rem]">
        <CharacterCard v-for="character in charactersResults" :key="character.name" class="col-span-6 sm:col-span-3 md:col-span-2 xl:col-span-3 bg-[#0B2828] border-[#C3F272] border-2 rounded-2xl">
          <template #name>
            <div class="p-[1rem] flex justify-between items-center">
              <p class="text-lg text-[#F3F4F4]">
                {{ character.name }}
              </p>
              <button class="underline cursor-pointer text-[#C3F272] text-sm" @click="openModalDetail(character.id)">
                Full details
              </button>
            </div>
          </template>
          <template #image>
            <img width="256" height="256" class="w-full rounded-2xl cursor-pointer" :src="character.image" :alt="character.name" @click="openModalDetail(character.id)">
          </template>
        </CharacterCard>
      </div>
      <div v-else>
        <div class="loader">
          <span class="loader__element" />
          <span class="loader__element" />
          <span class="loader__element" />
        </div>
      </div>
      <div id="characterPaginationBottom" class="flex justify-center items-center py-[2rem] space-x-[0.5rem] text-center xl:space-x-[2rem] rounded-lg outline" style="outline-color: #257074;">
        <button v-if="charactersInfos && charactersInfos.prev" class="px-[2rem] bg-[#C3F272] text-[#101919] btn-shape" @click="getPrevCharacters()">
          Prev
        </button>
        <p>Page {{ actualPage }} / {{ charactersInfos?.pages }}</p>
        <button v-if="charactersInfos && charactersInfos.next" class="px-[2rem] bg-[#87D5D9] text-[#101919] btn-shape" @click="getNextCharacters()">
          Next
        </button>
      </div>
      <div id="analystic" class="col-span-6 xl:col-span-12 pt-[2rem]">
        <CharacterAnalystic :characters="charactersResults" />
      </div>
    </div>
  </div>
</template>

<style>
.modal-open {
  overflow: hidden;
}
</style>
