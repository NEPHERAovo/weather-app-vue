<template>
    <div class="flex flex-col flex-1 items-center">
        <div v-if="route.query.preview" class="text-white p-3 bg-weather-secondary
        w-full text-center">
            <p>正在预览该城市的天气，点击<i
                    class="fa-solid fa-plus px-2 text-md hover:text-weather-tertiary duration-150 cursor-pointer"
                    @click="addCity" v-if="route.query.preview"></i>来追踪该城市天气。</p>
        </div>

        <div class="flex flex-col items-center text-white py-6">
            <h1 class="text-4xl font-bold">{{route.params.city}}</h1>
            <!-- 时间 -->
            <p class="text-sm mb-8 mt-2">
                {{new Date(weatherData.currentTime).toLocaleString(
                "zh-CN",
                {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                }
                )
                }}
            </p>
            <!-- 温度 -->
            <p class="text-8xl mb-6">
                {{Math.round((weatherData.current.temp-32)/1.8)}}&degC
            </p>
            <div class="text-center">
                <p>
                    体感 {{Math.round((weatherData.current.feels_like-32)/1.8)}}&degC
                </p>
                <p class="capitalize">
                    {{weatherData.current.weather[0].description}}
                </p>
                <img class="w-[150px] h-auto object-cover" :src="
                  `http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`
                " />
            </div>
        </div>

        <hr class="border-white border-opacity-10 border w-full" />

        <div class="max-w-screen-md w-full py-8">
            <div class="mx-8 text-white">
                <!-- <h2 class="mb-4">每小时天气</h2> -->
                <div class="hide-scrollbar flex gap-10 overflow-auto">
                    <div v-for="hourData in weatherData.hourly" :key="hourData.dt"
                        class="flex flex-col gap-4 items-center">
                        <p class="whitespace-nowrap text-md">
                            {{new Date(hourData.currentTime).toLocaleTimeString(
                            "en-us",
                            {
                            hour: "numeric",
                            }
                            )
                            }}
                        </p>
                        <img class="w-auto h-[50px] object-cover" :src="
                          `http://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`
                        " />
                        <p class="text-md">
                            {{Math.round((hourData.temp-32)/1.8)}}&degC
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <hr class="border-white border-opacity-10 border w-full" />

        <div class="max-w-screen-md w-full py-8">
            <div class="mx-8 ml-2 text-white">
                <!-- <h2 class="mb-4">七天天气预报</h2> -->
                <div v-for="(day,index) in weatherData.daily" class="flex">
                    <div class="flex flex-1 items-center">
                        <img class="w-[50px] h-[50px] object-cover mr-4" :src="
                          `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`
                        " />
                        <p v-if="index==0">
                            今天 &nbsp· &nbsp
                        </p>
                        <p v-if="index==1">明天 &nbsp· &nbsp</p>
                        <p v-if="index>1">
                            {{
                            new Date(day.dt * 1000).toLocaleDateString("zh-CN", {weekday:"short",})
                            }} &nbsp· &nbsp
                        </p>
                        <span class="w-[70px]">{{day.weather[0].description}}</span>
                    </div>
                    <div class="flex flex-row items-center">

                        <div class="flex gap-2 flex-1 justify-end">
                            <p>{{Math.round((day.temp.min-32)/1.8)}}&degC</p>
                            <p>-</p>
                            <p>{{Math.round((day.temp.max-32)/1.8)}}&degC</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <hr class="border-white border-opacity-10 border w-full" />

        <div v-if="!route.query.preview" class="flex py-8 text-white cursor-pointer duration-150 hover:text-red-500"
            @click="removeCity">
            <i class="fa-solid fa-trash -can"></i>
        </div>
    </div>
</template>

<script setup>
import { uid } from 'uid';
import axios from "axios";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const getWeatherData = async () => {
    try {
        const weatherData = await axios.get(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${route.query.latitude}&lon=${route.query.longitude}&exclude={part}&appid=7efa332cf48aeb9d2d391a51027f1a71&units=imperial&lang=zh_cn`
        );

        // cal current date & time
        const localOffset = new Date().getTimezoneOffset() * 60000;
        const utc = weatherData.data.current.dt * 1000 + localOffset;
        weatherData.data.currentTime =
            utc + 1000 * weatherData.data.timezone_offset;

        // cal hourly weather offset
        weatherData.data.hourly.forEach((hour) => {
            const utc = hour.dt * 1000 + localOffset;
            hour.currentTime =
                utc + 1000 * weatherData.data.timezone_offset;
        });
        // console.log(weatherData.data);
        return weatherData.data;
    } catch (err) {
        console.log(err);
    }
};
const weatherData = await getWeatherData();
// console.log(weatherData);

const router = useRouter();
const removeCity = () => {
    const cities = JSON.parse(localStorage.getItem("savedCities"));
    const updatedCities = cities.filter((city) => city.id !== route.query.id);
    localStorage.setItem("savedCities", JSON.stringify(updatedCities));
    router.push("/");
}

// 预览城市加入城市列表
const savedCities = ref([])
const addCity = () => {
    // 加入localStorage
    if (localStorage.getItem('savedCities')) {
        savedCities.value = JSON.parse(localStorage.getItem('savedCities'))
    }

    // 生成一个新的城市对象
    const locationObject = {
        id: uid(),
        state: route.params.state,
        city: route.params.city,
        coords: {
            latitude: route.query.latitude,
            longitude: route.query.longitude
        }
    }

    // 城市对象加入savedCities
    savedCities.value.push(locationObject);
    localStorage.setItem('savedCities', JSON.stringify(savedCities.value));

    // 去除预览提示
    let query = Object.assign({}, route.query);
    delete query.preview;
    query.id = locationObject.id;
    router.replace({ query });
};

</script>

<style>
.hide-scrollbar::-webkit-scrollbar {
    width: 0px;
}
</style>