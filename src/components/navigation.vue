<template>
    <header class="sticky z-1 top-0 bg-weather-primary shadow-lg">
        <nav class="container flex flex-col sm:flex-row items-center gap-4 text-white py-6">
            <RouterLink :to="{name:'home'}">
                <div class="flex items-center gap-3">
                    <img :src="'https://openweathermap.org/img/wn/02d@2x.png'" class="w-8 h-8 transform scale-[1.8]" />
                    <p v-if="lang=='zh-cn'" class="text-2xl">~ 天气 ~</p>
                    <p v-if="lang=='en-us'" class="text-2xl">~ Weather ~</p>
                </div>
            </RouterLink>

            <div class="flex gap-3 flex-1 justify-end">
                <i class="fa-solid fa-circle-info text-xl hover:text-weather-tertiary duration-150 cursor-pointer"
                    @click="toggleShow"></i>
                <i class="fa-solid fa-palette text-xl hover:text-weather-tertiary duration-150 cursor-pointer"
                    @click="changeTheme"></i>
                <i v-if="lang=='zh-cn'"
                    class="fa-solid fa-earth-asia text-xl hover:text-weather-tertiary duration-150 cursor-pointer"
                    @click="changeLang"></i>
                <i v-if="lang=='en-us'"
                    class="fa-solid fa-earth-americas text-xl hover:text-weather-tertiary duration-150 cursor-pointer"
                    @click="changeLang"></i>
                <i v-if="units=='metric'"
                    class="fa-solid fa-c text-xl hover:text-weather-tertiary duration-150 cursor-pointer"
                    @click="changeUnits"></i>
                <i v-if="units=='imperial'"
                    class="fa-solid fa-f text-xl hover:text-weather-tertiary duration-150 cursor-pointer"
                    @click="changeUnits"></i>
            </div>

            <Modal :show="show" @close-modal="toggleShow">
                <div class="text-black">
                    <h1 v-if="lang=='zh-cn'" class="text-2xl font-bold">关于</h1>
                    <h1 v-if="lang=='en-us'" class="text-2xl font-bold">About</h1>
                    <br />
                    <p v-if="lang=='zh-cn'" class="text-lg">使用OpenWeatherMap API获取天气/Mapbox API获取地区的一个小demo.</p>
                    <p v-if="lang=='en-us'" class="text-lg">A demo using OpenWeatherMap API to get weather info /
                        Mapbox
                        API to get locations.</p>
                    <br />
                    <p class="text-lg">Reference - The Net Ninja / Youtube</p>
                </div>
            </Modal>
        </nav>
    </header>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import Modal from "./modal.vue";

// 显示关于信息
const show = ref(false);
const toggleShow = () => {
    show.value = !show.value;
};

// 主题
function changeThemeViaIndex(index) {
    if (index == 0) {
        document.documentElement.style.setProperty('--primary-color', '#2c9678');
        document.documentElement.style.setProperty('--secondary-color', '#248067');
        document.documentElement.style.setProperty('--tertiary-color', '#428675');
    } else if (index == 1) {
        document.documentElement.style.setProperty('--primary-color', '#847c74');
        document.documentElement.style.setProperty('--secondary-color', '#9fa39a');
        document.documentElement.style.setProperty('--tertiary-color', '#bdaead');
    } else if (index == 2) {
        document.documentElement.style.setProperty('--primary-color', '#4e7ca1');
        document.documentElement.style.setProperty('--secondary-color', '#1772b4');
        document.documentElement.style.setProperty('--tertiary-color', '#8abcd1');
    } else if (index == 3) {
        document.documentElement.style.setProperty('--primary-color', '#b55336');
        document.documentElement.style.setProperty('--secondary-color', '#dc541b');
        document.documentElement.style.setProperty('--tertiary-color', '#ee781f');
    }
}

const changeTheme = () => {
    let index = localStorage.getItem('themeIndex');
    index++;
    if (index > 3) {
        index = 0;
    }
    changeThemeViaIndex(index);
    localStorage.setItem('themeIndex', index);
};

let index = localStorage.getItem('themeIndex');
if (!index) {
    index = 0;
    localStorage.setItem('themeIndex', index);
} else {
    changeThemeViaIndex(index);
}

// 语言
let lang = localStorage.getItem('lang');
if (!lang) {
    lang = 'zh-cn';
    localStorage.setItem('lang', lang);
}

const changeLang = () => {
    if (lang == 'zh-cn') {
        lang = 'en-us';
    } else {
        lang = 'zh-cn';
    }
    localStorage.setItem('lang', lang);
    window.location.reload();
}

// 单位
let units = localStorage.getItem('units');
if (!units) {
    units = 'metric';
    localStorage.setItem('units', units);
}

const changeUnits = () => {
    if (units == 'metric') {
        units = 'imperial';
    } else {
        units = 'metric';
    }
    localStorage.setItem('units', units);
    window.location.reload();
}
</script>