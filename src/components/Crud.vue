<template>
    <div class="card">
        <Tabs value="0">
            <TabList>
                <Tab value="list">{{ ` List ${title}` }}</Tab>
                <Tab value="create">{{ ` Create ${title}` }}</Tab>
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
defineProps({
    title: String,
    type: { type: String, required: true },
})
</script>
