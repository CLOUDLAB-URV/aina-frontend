<template>
    <Button v-if="create" label="Submit" icon="pi pi-send" type="submit" @click.prevent="createElement"></Button>
    <div v-if="!create" class="flex gap-2 w-full">
        <Button label="Save" class="grow" icon="pi pi-save" @click.prevent="updateElement"></Button>
        <Button label="Delete" severity="danger" class="grow" icon="pi pi-trash"
            @click.prevent="deleteElement"></Button>
    </div>
</template>

<script setup lang="ts">

defineProps<{
    create: boolean;
}>();

const emits = defineEmits(['updateElement', 'deleteElement', 'createElement']);

const updateElement = () => {
    emits('updateElement');
};
const deleteElement  = () => {
    emits('deleteElement');
};
const createElement = () => {
    emits('createElement');
};
</script>