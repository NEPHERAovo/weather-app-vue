<template>
    <div class="flex flex-col flex-1 items-center">
        <div v-if="route.query.preview" class="text-white p-3 bg-weather-secondary
        w-full text-center">
            <p v-if="lang=='zh-cn'">正在预览该城市的天气，点击<i
                    class="fa-solid fa-plus px-2 text-md hover:text-weather-tertiary duration-150 cursor-pointer"
                    @click="addCity" v-if="route.query.preview"></i>来追踪该城市天气。</p>
            <p v-if="lang=='en-us'">Previewing the weather of the city or state now, press<i
                    class="fa-solid fa-plus px-2 text-md hover:text-weather-tertiary duration-150 cursor-pointer"
                    @click="addCity" v-if="route.query.preview"></i>to track the weather.</p>
        </div>

        <div class="flex flex-col items-center text-white py-6">
            <h1 class="text-4xl font-bold">{{route.params.city}}</h1>
            <!-- 时间 -->
            <p v-if="lang=='zh-cn'" class="text-sm mb-8 mt-2">
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
            <p v-if="lang=='en-us'" class="text-sm mb-8 mt-2">
                {{new Date(weatherData.currentTime).toLocaleString(
                "en-US",
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
            <p v-if="units=='metric'" class="text-8xl mb-6">
                {{Math.round(weatherData.current.temp)}}&degC
            </p>
            <p v-if="units=='imperial'" class="text-8xl mb-6">
                {{Math.round(weatherData.current.temp)}}&degF
            </p>
            <div class="text-center">
                <p v-if="lang=='zh-cn' && units=='metric'">
                    体感 {{Math.round(weatherData.current.feels_like)}}&degC
                </p>
                <p v-if="lang=='zh-cn' && units=='imperial'">
                    体感 {{Math.round(weatherData.current.feels_like)}}&degF
                </p>

                <p v-if="lang=='en-us' && units=='metric'">
                    Feels like {{Math.round(weatherData.current.feels_like)}}&degC
                </p>
                <p v-if="lang=='en-us' && units=='imperial'">
                    Feels like {{Math.round(weatherData.current.feels_like)}}&degF
                </p>

                <p class="capitalize">
                    {{weatherData.current.weather[0].description}}
                </p>
                <img class="w-[150px] h-auto object-cover" :src="
                  `https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`
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
                        <p v-if="lang=='zh-cn'" class="whitespace-nowrap text-md">
                            {{new Date(hourData.currentTime).toLocaleTimeString(
                            "zh-cn",
                            {
                            hour12: true,
                            hour: "numeric",
                            }
                            )
                            }}
                        </p>
                        <p v-if="lang=='en-us'" class="whitespace-nowrap text-md">
                            {{new Date(hourData.currentTime).toLocaleTimeString(
                            "en-us",
                            {
                            hour12: true,
                            hour: "numeric",
                            }
                            )
                            }}
                        </p>
                        <img class="w-auto h-[50px] object-cover" :src="
                          `https://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`
                        " />
                        <p v-if="units=='metric'" class="text-md">
                            {{Math.round(hourData.temp)}}&degC
                        </p>
                        <p v-if="units=='imperial'" class="text-md">
                            {{Math.round(hourData.temp)}}&degF
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <hr class="border-white border-opacity-10 border w-full" />

        <div class="max-w-screen-md w-full py-8">
            <div class="mx-14 ml-6 text-white">
                <!-- <h2 class="mb-4">七天天气预报</h2> -->
                <div v-for="(day,index) in weatherData.daily" class="flex">
                    <div class="flex flex-1 items-center">
                        <img class="w-[50px] h-[50px] object-cover mr-4" :src="
                          `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`
                        " />
                        <p v-if="index==0 && lang=='zh-cn'">
                            今天 &nbsp· &nbsp
                        </p>
                        <p v-if="index==1 && lang=='zh-cn'">明天 &nbsp· &nbsp</p>
                        <p v-if="index>1 && lang=='zh-cn'">
                            {{
                            new Date(day.dt * 1000).toLocaleDateString("zh-CN", {weekday:"short",})
                            }} &nbsp· &nbsp
                        </p>
                        <p v-if="index==0 && lang=='en-us'">
                            Today &nbsp· &nbsp
                        </p>
                        <p v-if="index==1 && lang=='en-us'">Tomorrow &nbsp· &nbsp</p>
                        <p v-if="index>1 && lang=='en-us'">
                            {{
                            new Date(day.dt * 1000).toLocaleDateString("en-us", {weekday:"short",})
                            }} &nbsp· &nbsp
                        </p>
                        <span>{{day.weather[0].description}}</span>
                    </div>
                    <div class="flex flex-row items-center">
                        <div class="flex gap-2 flex-1 justify-end">
                            <p v-if="units=='metric'">{{Math.round(day.temp.min)}}&degC</p>
                            <p v-if="units=='imperial'">{{Math.round(day.temp.min)}}&degF</p>
                            <p>-</p>
                            <p v-if="units=='metric'">{{Math.round(day.temp.max)}}&degC</p>
                            <p v-if="units=='imperial'">{{Math.round(day.temp.max)}}&degF</p>
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
import axios from "axios";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { draw_canvas } from '../assets/floatingIcons';

let lang = localStorage.getItem('lang');
let units = localStorage.getItem('units');
const route = useRoute();
const getWeatherData = async () => {
    try {
        let weatherData;
        if (lang == 'zh-cn') {
            weatherData = await axios.get(
                `https://api.openweathermap.org/data/2.5/onecall?lat=${route.query.latitude}&lon=${route.query.longitude}&exclude={part}&appid=7efa332cf48aeb9d2d391a51027f1a71&units=${units}&lang=zh_cn`
            );
        } else {
            weatherData = await axios.get(
                `https://api.openweathermap.org/data/2.5/onecall?lat=${route.query.latitude}&lon=${route.query.longitude}&exclude={part}&appid=7efa332cf48aeb9d2d391a51027f1a71&units=${units}`
            );
        }

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
        let temp = weatherData.data.current.weather[0].id;
        if (temp < 300) {
            draw_canvas('storm');
        } else if (temp < 400) {
            draw_canvas('light-rain');
        } else if (temp < 600) {
            if (temp == 511) {
                draw_canvas('sleet');
            } else if (temp == 500) {
                draw_canvas('light-rain');
            } else {
                draw_canvas('rain');
            }
        } else if (temp < 700) {
            draw_canvas('snow')
        } else if (temp == 800) {
            draw_canvas('sun')
        } else {
            draw_canvas('haze')
        }
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
    router.replace({ query });
};

</script>

<style>
.hide-scrollbar::-webkit-scrollbar {
    width: 0px;
}
</style>