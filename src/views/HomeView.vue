<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <!-- animate-[spin_100s_linear_infinite] -->
      <input v-if="lang=='zh-cn'" type="text" v-model="searchQuery" @input="getSearchResults" placeholder="搜索城市"
        class="z-1 py-2 px-1 w-full bg-transparent placeholder-color-white placeholder-opacity-25 border-b border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004E71] hover:shadow-[0px_1px_0_0_#004E71]" />
      <input v-if="lang=='en-us'" type="text" v-model="searchQuery" @input="getSearchResults"
        placeholder="Search for a city or state."
        class="z-1 py-2 px-1 w-full bg-transparent placeholder-color-white placeholder-opacity-25 border-b border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004E71] hover:shadow-[0px_1px_0_0_#004E71]" />
      <ul class="absolute z-10 bg-weather-secondary text-white w-full shadow-md py-2 px-1" v-if="mapboxSearchResults">
        <p v-if="mapboxSearchResults.length === 0 && lang=='zh-cn'">没有搜到结果，请重试。</p>
        <p v-if="mapboxSearchResults.length === 0 && lang=='en-us'">No search results, plase retry.</p>
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
            <p v-if="lang=='zh-cn'">加载中...</p>
            <p v-if="lang=='en-us'">Loading...</p>
          </div>
        </template>
      </Suspense>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import CityList from "../components/CityList.vue";
import { draw_canvas } from "../assets/floatingIcons.js";

let lang = localStorage.getItem('lang');
// 搜索结果对应到预览城市，传入经纬度
const router = useRouter();
const previewCity = (searchResult) => {
  // console.log(searchResult);
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
  let savedCities = JSON.parse(localStorage.getItem('savedCities'));
  if (city) {
    for (let x in savedCities) {
      if (city == savedCities[x].city && state == savedCities[x].state) {
        router.push({
          name: "city",
          params: { city: city, state: state },
          query: {
            latitude: searchResult.center[1],
            longitude: searchResult.center[0]
          }
        });
        return;
      }
    }
    router.push({
      name: "city",
      params: { city: city, state: state },
      query: {
        latitude: searchResult.center[1],
        longitude: searchResult.center[0],
        preview: true,
      }
    });
  }
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
      let result;
      if (lang == 'zh-cn') {
        result = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?access_token=${mapboxAPIKey}&types=place&language=zh-Hans`
        );
      } else {
        result = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?access_token=${mapboxAPIKey}&types=place`
        );
      }
      mapboxSearchResults.value = result.data.features;
      return;
    }
    mapboxSearchResults.value = null;
  }, 500);
};

onMounted(() => {
  draw_canvas('everything');
  // for (let i = 0; i < 2; i++) {
  //   setTimeout(() => {
  //     console.log('go');
  //     var body = document.getElementById('app');
  //     var div = document.createElement('div');
  //     div.id = 'test' + i;
  //     let temp = 'absolute top-' + (i * 0) + ' right  -' + (i * 1000) + ' animate-[x_13s_linear_infinite_alternate]';
  //     div.setAttribute('class', temp);
  //     // div.setAttribute('class', 'absolute animate-[x_13s_linear_infinite_alternate] top-[0px] left-[0px]');

  //     var div2 = document.createElement('div');
  //     div2.id = 'test2' + i;
  //     div2.setAttribute('class', 'animate-[y_7s_linear_infinite_alternate]');

  //     var canv = document.createElement("canvas");
  //     canv.id = "test3" + i;
  //     canv.setAttribute("class", "z-10 w-[100px] animate-[spin_10s_linear_infinite]");

  //     div2.appendChild(canv);
  //     div.appendChild(div2);
  //     body.appendChild(div);

  //     let name = 'test3' + i;
  //     console.log(name);
  //     skycons.add(document.getElementById(name), Skycons.PARTLY_CLOUDY_DAY);

  //     skycons.play();
  //   }, 5000 * i);
  // }

})
</script>
<style>
@keyframes x {
  100% {
    -webkit-transform: translateX(calc(100vw - 100px));
    transform: translate(calc(100vw - 100px));
  }
}

@keyframes y {
  100% {
    -webkit-transform: translateY(calc(100vh - 100px));
    transform: translateY(calc(100vh - 100px));
  }
}
</style>