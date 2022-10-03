<template>
  <div id="main" class="flex flex-1 flex-col min-h-screen font-Roboto bg-weather-primary">
    <canvas class="z-[2] pointer-events-none absolute w-full" id="icon1"></canvas>
    <Navigation />
    <RouterView v-slot="{Component}">
      <Transition name="page" mode="out-in">
        <component :is="Component"></component>
      </Transition>
    </RouterView>
    <footer class="flex mt-auto mx-auto">
      <p class="text-black opacity-40 font-medium text-center text-sm my-2">
        ------&nbsp;&nbsp;&nbsp;&nbsp;Made by <a class="hover:text-weather-secondary"
          href="https://github.com/NEPHERAovo" target="_blank">NEPHERA</a>
        with <span class="text-red-500">&nbsp❤</span>&nbsp;&nbsp;&nbsp;------</p>
    </footer>
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