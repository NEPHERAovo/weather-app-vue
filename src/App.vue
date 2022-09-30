<template>
  <div id="main" class="flex flex-col min-h-screen font-Roboto bg-weather-primary">
    <canvas class="z-[2] pointer-events-none absolute w-full" id="icon1"></canvas>
    <Navigation />
    <RouterView v-slot="{Component}">
      <Transition name="page" mode="out-in">
        <component :is="Component"></component>
      </Transition>
    </RouterView>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Navigation from './components/navigation.vue'
</script>

<style>
/* For Webkit-based browsers (Chrome, Safari and Opera) */
html::-webkit-scrollbar {
  width: 0px;
}

.page-enter-active,
.page-leave-active {
  transition: 150ms ease all;
  ;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>