<script setup lang="ts">
import { ref, watch } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import {
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import type { CharactersResults } from '@/types/RickAndMorty/characters'

const props = defineProps<{
  characters: CharactersResults[] | null
}>()

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
])

const allGender = ref<string[]>([])
const allUniqueGender = ref<string[]>([])
const genderWithValue = ref<{ name: string, value: number }[]>([])
watch(props, (newProps) => {
  allGender.value = []
  allUniqueGender.value = []
  genderWithValue.value = []
  if (newProps.characters) {
    for (let i = 0; i < newProps.characters!.length; i++) {
      const genderCharacter = newProps!.characters[i].gender.charAt(0).toUpperCase() + newProps!.characters[i].gender.slice(1)
      allGender.value.push(genderCharacter)
      if (!allUniqueGender.value.includes(genderCharacter)) {
        allUniqueGender.value.push(genderCharacter)
        genderWithValue.value.push({ name: genderCharacter, value: 1 })
      }
      else {
        genderWithValue.value.find(el => el.name === genderCharacter)!.value++
      }
    }
  }
})

const option = ref({
  title: {
    text: 'Gender analysis',
    left: 'center',
    textStyle: {
      color: '#F3F4F4',
      fontSize: 28,
    },
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 'center',
    top: '10%',
    data: allUniqueGender,
    textStyle: {
      color: '#F3F4F4',
      fontSize: 16,
      fontWeight: 'bold',
    },
  },
  series: [
    {
      name: 'Traffic Sources',
      type: 'pie',
      radius: '40%',
      center: ['50%', '60%'],
      data: genderWithValue,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
      label: {
        color: '#FFF',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontFamily: 'sans-serif',
        fontSize: 18,
        borderColor: '#fff',
      },
    },
  ],
})
</script>

<template>
  <div>
    <VChart class="h-[600px]" :option="option" autoresize />
  </div>
</template>

<style scoped>

</style>
