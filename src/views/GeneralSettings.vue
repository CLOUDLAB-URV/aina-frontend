<template>
    <div class="card">
        <Tabs value="0">
            <TabList>
                <Tab v-for="tab in tabs" :key="tab.title" :value="tab.value">{{ tab.title }}</Tab>
            </TabList>
            <TabPanels>
                <TabPanel v-for="tab in tabs" :key="tab.title" :value="tab.value">
                    <Crud :title="tab.title">
                        <template #list>
                            <component :is="tab.list" />
                        </template>
                        <template #create>
                            <component :is="tab.create" :create="true" />
                        </template>
                    </Crud>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
</template>

<script setup>
import Crud from '@/components/Crud.vue';
import LlmCreate from '@/components/llm/LlmCreate.vue';
import LlmList from '@/components/llm/LlmList.vue';
import { ref } from 'vue';

const tabs = ref([
    { title: 'LLM', list: LlmList, create: LlmCreate, value: '0' },
    { title: 'Embeddings', list: Llm, create: Llm, value: '1' },
]);
</script>