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

<script setup lang="ts">
import Crud from '@/components/Crud.vue';
import EmbCreate from '@/components/emb/embCreate.vue';
import EmbList from '@/components/emb/embList.vue';
import IndCreate from '@/components/index/IndCreate.vue';
import IndkList from '@/components/index/IndkList.vue';
import LlmCreate from '@/components/llm/LlmCreate.vue';
import LlmList from '@/components/llm/LlmList.vue';
import RankCreate from '@/components/rank/RankCreate.vue';
import RankList from '@/components/rank/RankList.vue';
import { ref } from 'vue';

const tabs = ref([
    { title: 'LLM', list: LlmList, create: LlmCreate, value: '0' },
    { title: 'Embeddings', list: EmbList, create: EmbCreate, value: '1' },
    { title: 'Reranking', list: RankList, create: RankCreate, value: '2' },
    { title: 'Index', list: IndkList, create: IndCreate, value: '3' },
]);
</script>