<template>
    <h3 class="mb-3 text-2xl">Stadistics About ALL the Agents you Created</h3>
    <DataTable :value="info" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" stripedRows tableStyle="min-width: 50rem">
        <Column field="name" header="Name" style="width: 20%"></Column>
        <Column field="like" header="Like" style="width: 20%"></Column>
        <Column field="unlike" header="Unlike" style="width: 20%"></Column>
        <Column field="nothing" header="Nothing" style="width: 25%"></Column>
        <Column field="total" header="Total" style="width: 25%"></Column>
    </DataTable>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ChApi, ConvApi,AgApi } from '@/apis/api';
import type { SelectConversationApiV1ChatAgentIdConversationIdSelectPostRequest } from '@/apis/ChatApi'
import type { ListConversationsApiV1ConversationsAgentIdGetRequest } from '@/apis/ConversationsApi'

let info = ref()

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
                                        for(let like in likes){

                                            let value_like = likes[like];
                                            let index = value_like[0][0];

                                            if(!(conversationId in agents[definiteAgentId]['conversation'])){
                                                agents[definiteAgentId]['conversation'][conversationId] = {}
                                            }
                                            agents[definiteAgentId]['conversation'][conversationId][index] = value_like[2];
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
                    'total':0
                }
            }
            for(let conv in convs){
                console.log(conv)
                let messages = convs[conv]
                for(let mesg in messages){
                    console.log(mesg)
                    let message = messages[mesg];
                    console.log(typeof(message))
                    if(typeof(message) == 'boolean'){
                        agents_likes[agent]['nothing'] += 1
                        agents_likes[agent]['total'] += 1
                    }
                    else if(message == 'true'){
                        console.log("HEREONETWO")
                        agents_likes[agent]['like'] += 1
                        agents_likes[agent]['total'] += 1
                    }
                    else if(message == 'false'){
                        console.log("HERETWO")
                        agents_likes[agent]['unlike'] += 1
                        agents_likes[agent]['total'] += 1
                    }
                }
            }
        }
        info.value = Object.values(agents_likes)
        
    }
)

</script>