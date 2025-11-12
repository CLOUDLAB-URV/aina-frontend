<template>
    <Tabs value="files">
        <TabList>
            <Tab value="files">File / Groups</Tab>
            <Tab value="stadistics">Stadistics</Tab>
        </TabList>
        <TabPanels>
            <TabPanel value="files">
                <FilesTabs/>
            </TabPanel>
            <TabPanel value="stadistics">
                <Stadistics/>
            </TabPanel>
        </TabPanels>
    </Tabs>
</template>

<script setup lang="ts">
import Stadistics from '@/components/Stadistics.vue';
import FilesTabs from '@/components/FilesTabs.vue';
</script>