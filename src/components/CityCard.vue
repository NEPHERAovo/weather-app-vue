<template>
    <div class="flex py-6 px-3 bg-weather-secondary rounded-md shadow-lg cursor-pointer hover:bg-weather-tertiary">
        <div class="flex flex-col flex-1">
            <h2 class="text-3xl">{{city.city}}</h2>
            <h3>{{city.state}}</h3>
        </div>
        <div class="flex flex-col gap-2">
            <p class="text-3xl self-end">
                {{Math.round((city.weather.main.temp-32)/1.8)}}&degC
            </p>
            <div class="flex gap-2 items-center">
                <span class="text-xs">
                    {{Math.round((city.weather.main.temp_min-32)/1.8)}}&degC
                </span>
                <span>~</span>
                <span class="text-xs">
                    {{Math.round((city.weather.main.temp_max-32)/1.8)}}&degC
                </span>
            </div>
        </div>
        <div class="flex flex-col ml-6 text-center">
            <img class="w-[48px] h-[48px] transform scale-[1.5]" :src="
              `http://openweathermap.org/img/wn/${city.weather.weather[0].icon}@2x.png`
            " />
            <span class="text-xs">
                {{city.weather.weather[0].description}}
            </span>
        </div>
    </div>
</template>

<script setup>
defineProps({
    city: {
        type: Object,
        default: () => { },
    },
})
</script>