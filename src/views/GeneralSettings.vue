<template>
    <div class="card">
        <Tabs value="0">
            <TabList>
                <Tab v-for="tab in tabs" :key="tab.title" :value="tab.value">{{ tab.title }}</Tab>
            </TabList>
            <TabPanels>
                <TabPanel v-for="tab in tabs" :key="tab.title" :value="tab.value">
                    <Crud :title="tab.title" :type="tab.type">
                        <template #list>
                            <component :is="tab.list" :create="false" :type="tab.type" :store="tab.store" />
                        </template>
                        <template #create>
                            <component :is="tab.create" :create="true" :type="tab.type" />
                        </template>
                    </Crud>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
</template>

<script setup lang="ts">
import Crud from '@/components/Crud.vue';
import IndCreate from '@/components/index/IndCreate.vue';
import IndkList from '@/components/index/IndkList.vue';
import LlmCreate from '@/components/llm/LlmCreate.vue';
import LlmList from '@/components/llm/LlmList.vue';
import { useEmbStore } from '@/stores/emb';
import { useLlmStore } from '@/stores/llm';
import { useRankStore } from '@/stores/rank';
import { ref } from 'vue';

const tabs = ref([
    { title: 'LLM', list: LlmList, create: LlmCreate, value: '0', type: 'llm', store: useLlmStore() },
    { title: 'Embeddings', list: LlmList, create: LlmCreate, value: '1', type: 'emb', store: useEmbStore() },
    { title: 'Reranking', list: LlmList, create: LlmCreate, value: '2', type: 'rank', store: useRankStore() },
    { title: 'Index', list: IndkList, create: IndCreate, value: '3', type: 'none' },
]);
</script>