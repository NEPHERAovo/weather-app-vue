<template>
    <div class="flex flex-col flex-1 items-center">
        <div v-if="route.query.preview" class="text-white p-3 bg-weather-secondary
        w-full text-center">
            <p>正在预览该城市的天气，点击加号按钮来追踪该城市天气。</p>
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
                    体感温度 {{Math.round((weatherData.current.feels_like-32)/1.8)}}&degC
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
                <h2 class="mb-4">每小时天气</h2>
                <div class="flex gap-10 overflow-hidden">
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
            <div class="mx-8 text-white">
                <h2 class="mb-4">七天天气预报</h2>
                <div v-for="day in weatherData.daily" :key="day.dt" class="flex items-center">
                    <p class="flex-1">
                        {{
                        new Date(day.dt * 1000).toLocaleDateString("zh-CN", {weekday:"long",})
                        }}
                    </p>
                    <div class="flex flex-row items-center">
                        <img class="w-[50px] h-[50px] object-cover mx-4" :src="
                          `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`
                        " />
                        <div class="flex gap-2 flex-1 justify-end">
                            <p>{{Math.round((day.temp.min-32)/1.8)}}&degC</p>
                            <p>-</p>
                            <p>{{Math.round((day.temp.max-32)/1.8)}}&degC</p>
                        </div>
                        <span class="w-[70px] ml-4">{{day.weather[0].description}}</span>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="!route.query.preview"
            class="flex items-center gap-2 py-6 text-white cursor-pointer duration-150 hover:text-red-500"
            @click="removeCity">
            <i class="fa-solid fa-trash"></i>
            <p>移除该城市</p>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
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
</script>