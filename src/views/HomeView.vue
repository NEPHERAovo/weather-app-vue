<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input type="text" v-model="searchQuery" @input="getSearchResults" placeholder="搜索城市"
        class="py-2 px-1 w-full bg-transparent placeholder-color-white placeholder-opacity-25 border-b border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004E71] hover:shadow-[0px_1px_0_0_#004E71]" />
      <ul class="absolute z-10 bg-weather-secondary text-white w-full shadow-md py-2 px-1" v-if="mapboxSearchResults">
        <p v-if="mapboxSearchResults.length === 0">没有搜到结果，请重试。</p>
        <div v-else>
          <li v-for="searchResult in mapboxSearchResults" :key="searchResult.id"
            class="py-2 cursor-pointer hover:bg-weather-tertiary" @click="previewCity(searchResult)">
            {{searchResult.place_name}}</li>
        </div>
      </ul>
    </div>
    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList />
        <template #fallback>
          <div class="text-white p-3 bg-weather-secondary w-full text-center">
            <p>加载中...</p>
          </div>
        </template>
      </Suspense>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import CityList from "../components/CityList.vue";

// 搜索结果对应到预览城市，传入经纬度
const router = useRouter();
const previewCity = (searchResult) => {
  console.log(searchResult);
  var city = '';
  var state = '';
  if (searchResult.context.length == 1) {
    city = searchResult.text;
    state = searchResult.context[0].text;
  } else if (searchResult.context.length == 2) {
    city = searchResult.text;
    state = searchResult.context[1].text + ', ' + searchResult.context[0].text;
  } else if (searchResult.context.length == 3) {
    city = searchResult.context[0].text;
    state = searchResult.context[2].text + ', ' + searchResult.context[1].text;
  }
  // const [city, state] = searchResult.place_name.split(",");
  router.push({
    name: "city",
    params: { city: city, state: state }
    , query: {
      latitude: searchResult.center[1],
      longitude: searchResult.center[0],
      preview: true,
    }
  });
};

const mapboxAPIKey =
  "pk.eyJ1Ijoiam9obmtvbWFybmlja2kiLCJhIjoiY2t5NjFzODZvMHJkaDJ1bWx6OGVieGxreSJ9.IpojdT3U3NENknF6_WhR2Q";
const searchQuery = ref("");
const queryTimeout = ref(null);
const mapboxSearchResults = ref(null);
const searchError = ref(null);

// 从mapbox获取搜索结果
const getSearchResults = () => {
  clearTimeout(queryTimeout.value);
  queryTimeout.value = setTimeout(async () => {
    if (searchQuery.value !== "") {
      const result = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?access_token=${mapboxAPIKey}&types=place&language=zh-Hans`
      );
      mapboxSearchResults.value = result.data.features;
      return;
    }
    mapboxSearchResults.value = null;
  }, 500);
};

</script>
