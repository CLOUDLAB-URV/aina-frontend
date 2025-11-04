<template>
    <div class="flex gap-2">
        <i class="pi pi-database"></i>
        <div class="p-4 bg-blue-100 rounded-lg w-[70%]">
            <p class="text-gray-800">{{ message }}</p>
        </div>  
    </div>
</template>
<script setup lang="ts">
defineProps<{
    message: String;
}>();
</script>