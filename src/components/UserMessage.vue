<template>
    <div class="flex gap-2 self-end">
        <div class="p-4 bg-blue-100 rounded-lg ">
            <p class="text-gray-800">{{ message }}</p>
        </div>  
        <i class="pi pi-user"></i>
    </div>
</template>
<script setup lang="ts">
defineProps<{
    message: string;
}>();
</script>