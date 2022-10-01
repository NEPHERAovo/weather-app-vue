<template>
    <div class="hover:scale-[1.02] duration-300" v-for="city in savedCities">
        <CityCard :city="city" @click="goToCityView(city)" />
    </div>
    <div v-if="savedCities.length === 0 && lang=='zh-cn'"
        class="text-white p-3 bg-weather-secondary w-full text-center">
        <p>没有添加城市。从搜索栏中搜索城市来进行添加。</p>
    </div>
    <div v-if="savedCities.length === 0 && lang=='en-us'"
        class="text-white p-3 bg-weather-secondary w-full text-center">
        <p>No cities or states added. Search for a city or state in the search box above to add.</p>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import CityCard from "./CityCard.vue";
import axios from "axios";

let lang = localStorage.getItem('lang');
let units = localStorage.getItem('units');
const savedCities = ref([]);
const getCities = async () => {
    if (localStorage.getItem('savedCities')) {
        savedCities.value = JSON.parse(localStorage.getItem('savedCities'))
    };

    // 获取每个保存的城市的天气
    const requests = [];
    if (lang == 'zh-cn') {
        savedCities.value.forEach((city) => {
            requests.push(
                axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.latitude}&lon=${city.coords.longitude}&exclude={part}&appid=7efa332cf48aeb9d2d391a51027f1a71&units=${units}&lang=zh_cn`)
            );
        });
    } else {
        savedCities.value.forEach((city) => {
            requests.push(
                axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.latitude}&lon=${city.coords.longitude}&exclude={part}&appid=7efa332cf48aeb9d2d391a51027f1a71&units=${units}`)
            );
        });
    }


    // 等待获取
    const weatherData = await Promise.all(requests);
    // console.log(weatherData);
    // 将天气数据添加到城市数据中
    weatherData.forEach((value, index) => {
        // savedCities.value[index].weather = value.data.weather[0];
        savedCities.value[index].weather = value.data;
        // savedCities.value[index].temp = value.data.main.temp;
    });
};
await getCities();


const router = useRouter();
const goToCityView = (city) => {
    router.push({
        name: "city",
        params: { state: city.state, city: city.city },
        query: {
            latitude: city.coords.latitude,
            longitude: city.coords.longitude
        },
    });
};
</script>