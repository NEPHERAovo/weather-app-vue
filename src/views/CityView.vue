<template>
    <div>
        <Suspense>
            <AsyncCityView />
            <template #fallback>
                <div class="text-white p-3 bg-weather-secondary
        w-full text-center">
                    <p v-if="lang=='zh-cn'">加载中...</p>
                    <p v-if="lang=='en-us'">Loading...</p>
                </div>
            </template>
        </Suspense>
    </div>
</template>

<script setup>
import AsyncCityView from '../components/AsyncCityView.vue';
let lang = localStorage.getItem('lang');
</script>