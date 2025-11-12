<template>
    <Tabs value="files">
        <TabList>
            <Tab value="files"><i18n-t keypath="filegroup.label"/></Tab>
            <Tab value="stadistics"><i18n-t keypath="stadistics.label"/></Tab>
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