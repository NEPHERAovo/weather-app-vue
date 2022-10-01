<template>
    <Teleport to="body">
        <Transition name="modal-outer">
            <div v-show="show" @click="$emit('close-modal')" class="absolute w-full bg-black bg-opacity-30 h-screen
            top-0 left-0 flex justify-center px-8">
                <Transition name="modal-inner">
                    <div class="p-4 bg-white self-start mt-32 max-w-screen-md">
                        <slot />
                        <button v-if="lang=='zh-cn'" class="text-white mt-8 bg-weather-primary py-2 px-6">关闭</button>
                        <button v-if="lang=='en-us'" class="text-white mt-8 bg-weather-primary py-2 px-6">Close</button>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
let lang = localStorage.getItem('lang');
defineEmits(["close-modal"]);
defineProps({
    show: {
        type: Boolean,
        default: false,
    }
})

</script>

<style scoped>
.modal-outer-enter-active,
.modal-outer-leave-active {
    transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-outer-enter-from,
.modal-outer-leave-to {
    opacity: 0;
}
</style>