<template>
    <Button v-if="create" :label="t('input.submit.label')" icon="pi pi-send" type="submit" @click.prevent="createElement"></Button>
    <div v-if="!create" class="flex gap-2 w-full">
        <Button :label="t('input.save.label')" class="grow" icon="pi pi-save" @click.prevent="updateElement"></Button>
        <Button :label="t('input.delete.label')" severity="danger" class="grow" icon="pi pi-trash"
            @click.prevent="deleteElement"></Button>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const {t} = useI18n()

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