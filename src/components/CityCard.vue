<template>
    <div class="flex py-6 px-3 bg-weather-secondary rounded-md shadow-lg cursor-pointer hover:bg-weather-tertiary">
        <div class="flex flex-col flex-1">
            <h2 class="text-3xl">{{city.city}}</h2>
            <h3>{{city.state}}</h3>
        </div>
        <div class="flex flex-col gap-2">
            <p v-if="units=='metric'" class="text-3xl self-end">
                {{Math.round(city.weather.main.temp)}}&degC
            </p>
            <p v-if="units=='imperial'" class="text-3xl self-end">
                {{Math.round(city.weather.main.temp)}}&degF
            </p>
            <div class="flex gap-2 items-center">
                <span v-if="units=='metric'" class="text-xs">
                    {{Math.round(city.weather.main.temp_min)}}&degC
                </span>
                <span v-if="units=='imperial'" class="text-xs">
                    {{Math.round(city.weather.main.temp_min)}}&degF
                </span>
                <span>~</span>
                <span v-if="units=='metric'" class="text-xs">
                    {{Math.round(city.weather.main.temp_max)}}&degC
                </span>
                <span v-if="units=='imperial'" class="text-xs">
                    {{Math.round(city.weather.main.temp_max)}}&degF
                </span>
            </div>
        </div>
        <div class="flex flex-col ml-6 items-center">
            <img class="w-[48px] h-[48px] transform scale-[1.5]" :src="
              `https://openweathermap.org/img/wn/${city.weather.weather[0].icon}@2x.png`
            " />
            <span class="text-xs">
                {{city.weather.weather[0].description}}
            </span>
        </div>
    </div>
</template>

<script setup>
let units = localStorage.getItem('units');
defineProps({
    city: {
        type: Object,
        default: () => { },
    },
})
</script>