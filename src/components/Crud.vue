<template>
    <div class="card">
        <Tabs value="list">
            <TabList>
                <Tab value="list">{{ ` ${t('list')} ${title}` }}</Tab>
                <Tab value="create">{{ ` ${t('create')} ${title}` }}</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="list">
                    <slot name="list" />
                </TabPanel>
                <TabPanel value="create">
                    <slot name="create" />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const {t} = useI18n()
defineProps({
    title: String,
    type: { type: String, required: true },
})
</script>
