<template>
    <div class="flex gap-2 self-end" @click="show_info = true">
        <div class="p-4 bg-blue-100 rounded-lg ">
            <p class="text-gray-800">{{ message }}</p>
        </div>  
        <i class="pi pi-user"></i>
    </div>
    <Dialog v-model:visible="show_info" :header="t('extract.header')" :style="{ width: '35rem' }" position="right" :modal="true" :draggable="false">        
        <h3 class="text-lg mb-2"><i18n-t keypath="extract.label"/></h3>
        <p class="text-md font-bold mb-2">{{ message }}</p>
        <div v-html="info"></div>
    </Dialog>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const {t} = useI18n()

defineProps<{
    message:string;
    info:String;
}>();

let show_info = ref(false)
</script>
<style scoped>
@media (max-width: 991px) {
    i {
        display: none;
    }
}
</style>