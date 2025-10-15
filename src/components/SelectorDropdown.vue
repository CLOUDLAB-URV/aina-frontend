<template>
    <div class="flex flex-col justify-between p-2">
        <h2 class="mb-4 text-lg">{{ label }}</h2>
        <select name="agent" id="agent">
            <option v-for="option in options" :value="option">{{ option }}</option>
        </select>
        <div class="flex justify-between mt-4">
            <Button icon="pi pi-trash" severity="danger"></Button>
            <Button icon="pi pi-pencil" severity="info"></Button>
            <Button icon="pi pi-file-plus" severity="success"></Button>
        </div>
    </div>
</template>
<script lang="ts" setup>
defineProps<{
    label: string;
    options: string[];
}>();
</script>