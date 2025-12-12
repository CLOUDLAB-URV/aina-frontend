<template>
    <h3 class="mb-3 text-2xl">{{ t('stadistics.exp')}}</h3>
    
    <DataTable v-model:selection="selected" selectionMode="single" :value="info" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" stripedRows tableStyle="min-width: 50rem">
        <Column field="name" :header="t('input.name.label')" style="width: 14%"></Column>
        <Column field="like" :header="t('like')" style="width: 14%"></Column>
        <Column field="unlike" :header="t('unlike')" style="width: 14%"></Column>
        <Column field="nothing" :header="t('nothing')" style="width: 14%"></Column>
        <Column field="total" :header="t('total')" style="width: 14%"></Column>
        <Column :header="t('percentage_correct')" style="width: 14%">
            <template #body="{ data }">
                {{ data.total > 0 ? ((data.like / data.total) * 100).toFixed(1) : 0 }} %
            </template>
        </Column>
        <Column :header="t('Avg time response')" style="width: 14%">
            <template #body="{ data }">
                {{ formatDuration(data.avg_response / data.total) }} 
            </template>
        </Column>
    </DataTable>

    <section v-if="selected">
        <Tabs value="like">
            <TabList>
                <Tab value="like" class="flex items-center">
                    <i class="pi pi-thumbs-up-fill mr-2 text-green-500"></i>
                    <span>Like</span>
                </Tab>
                <Tab value="unlike" class="flex items-center">
                    <i class="pi pi-thumbs-down-fill mr-2 text-red-500"></i>
                    <span>UnLike</span>
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="like">
                    <div class="grow h-[70vh] overflow-y-auto rounded-lg p-4 flex flex-col gap-4 chat">
                        <template v-for="message in selected.messages_like" >
                            <UserMessage :message="message[0][0]" :info="message[1]"/>
                            <AiMessage :message="message[0][1]" :data_msg="data2" :timestamp="message[2]"/>
                        </template>
                    </div>
                </TabPanel>
                <TabPanel value="unlike">
                    <div class="grow h-[70vh] overflow-y-auto rounded-lg p-4 flex flex-col gap-4 chat">
                        <template v-for="message in selected.messages_unlike" >
                            <UserMessage :message="message[0][0]" :info="message[1]"/>
                            <AiMessage :message="message[0][1]" :data_msg="data2" :timestamp="message[2]"/>
                        </template>
                    </div>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { SelectConversationApiV1ChatAgentIdConversationIdSelectPostRequest } from '@/apis/ChatApi'
import type { ListConversationsApiV1ConversationsAgentIdGetRequest } from '@/apis/ConversationsApi'
import UserMessage from '@/components/UserMessage.vue';
import AiMessage from '@/components/AiMessage.vue';
import { ChApi, ConvApi,AgApi } from '@/apis/api';
import { formatDuration } from '@/utils/time';
import { useI18n } from 'vue-i18n';

const {t} = useI18n()
let info = ref()
let selected = ref()
let data:[String,Number] = ["false",-1]
let data2:[String,Number] = ["true",-1]

onMounted(
    async ()=> {
        let agents = {} as any
        await AgApi.listAgentsCreatedApiV1AgentsCreatedGet().then(async (responseAg) =>{
            for (let resAg in responseAg){
                let agent = responseAg[resAg]?.id
                if (agent != undefined){
                    if(!(agent in agents) ){
                        agents[agent] = {}
                    }
                    agents[agent]['name'] = responseAg[resAg]?.name
                    agents[agent]['conversation'] = {}
                }
                if (responseAg[resAg]?.name != undefined){
                    const definiteAgentId: string = responseAg[resAg]?.id ;
                    let convInfo : ListConversationsApiV1ConversationsAgentIdGetRequest = {
                        agentId : definiteAgentId
                    }
                    await ConvApi.listConversationsApiV1ConversationsAgentIdGet(convInfo).then(
                        async (response) => {
                            for( let res in response){
                                if(response[res] != undefined){
                                    let conversationId = response[res].id
                                    let data : SelectConversationApiV1ChatAgentIdConversationIdSelectPostRequest = {
                                        agentId: definiteAgentId,
                                        conversationId: conversationId
                                    }
                                    await ChApi.selectConversationApiV1ChatAgentIdConversationIdSelectPost(data).then((response2)=>{
                                        let likes = response2.likes;
                                        let messages = response2.messages;
                                        let evidence = response2.retrievalMessages;
                                        let timestamps = response2.timestamps;
                                        for(let like in likes){

                                            let value_like = likes[like];
                                            let index = value_like[0][0];

                                            if(!(conversationId in agents[definiteAgentId]['conversation'])){
                                                agents[definiteAgentId]['conversation'][conversationId] = {}
                                            }
                                            agents[definiteAgentId]['conversation'][conversationId][index] = {vote:value_like[2],message:messages[index],evidence:evidence[index],timestamp:timestamps[index]};
                                        }
                                    })
                                }
                            }
                        }
                    )
                }

            }
        })
        let agents_likes = {} as any
        for(let agent in agents){
            let convs = agents[agent]['conversation'];
            if(!(agent in agents_likes)){
                agents_likes[agent] = {
                    'name': agents[agent].name,
                    'like':0,
                    'unlike':0,
                    'nothing':0,
                    'total':0,
                    'messages_unlike': [],
                    'messages_like': [],
                    'avg_response':0,
                }
            }
            for(let conv in convs){
                let messages = convs[conv]
                for(let mesg in messages){
                    let message = messages[mesg].vote;
                    if(typeof(message) == 'boolean'){
                        agents_likes[agent]['nothing'] += 1
                        agents_likes[agent]['total'] += 1
                    }
                    else if(message == 'true'){
                        agents_likes[agent]['like'] += 1
                        agents_likes[agent]['messages_like'].push([messages[mesg].message,messages[mesg].evidence,messages[mesg].timestamp])
                        agents_likes[agent]['total'] += 1
                        agents_likes[agent]['avg_response'] += messages[mesg].timestamp
                    }
                    else if(message == 'false'){
                        agents_likes[agent]['unlike'] += 1
                        agents_likes[agent]['messages_unlike'].push([messages[mesg].message,messages[mesg].evidence,messages[mesg].timestamp])
                        agents_likes[agent]['total'] += 1
                        agents_likes[agent]['avg_response'] += messages[mesg].timestamp
                    }
                }
            }
        }
        info.value = Object.values(agents_likes)
        
    }
)

</script>