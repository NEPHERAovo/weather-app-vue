<template>
    <div>
        <Suspense>
            <AsyncCityView />
            <template #fallback>
                <div class="text-white p-3 bg-weather-secondary
        w-full text-center">
                    <p>加载中...</p>
                </div>
            </template>
        </Suspense>
    </div>
</template>

<script setup>
import AsyncCityView from '../components/AsyncCityView.vue';

</script>