<template>
    <div class="card flex justify-center">
        <button v-if="create == 'create'" @click="visible = true"
            class="bg-green-400 hover:bg-green-600 p-2 flex flex-col justify-center rounded-lg" id="btn-create">
            <i class="pi pi-file-plus"></i>
        </button>
        <button v-if="create == 'trash'" @click="visible = true"
            class="bg-red-400 hover:bg-red-400 p-2 flex flex-col justify-center rounded-lg" id="btn-delete">
            <i class="pi pi-trash"></i>
        </button>
        <button v-if="create == 'edit'" @click="visible = true"
            class="bg-blue-400 hover:bg-blue-400 p-2 flex flex-col justify-center rounded-lg" id="btn-edit">
            <i class="pi pi-pencil"></i>
        </button>
        <Dialog v-model:visible="visible" modal header="Create an Agent" :style="{ width: '40rem' }">
            <div class="flex items-center gap-4 mb-4">
                <label for="name" class="font-semibold w-24">Name</label>
                <InputText v-model="agent.name" id="name" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex items-center gap-4 mb-2">
                <label for="desc" class="font-semibold w-24">Description</label>
                <textarea v-model="agent.description" id="desc" class="flex-auto border border-gray-200 p-2"
                    autocomplete="off" />
            </div>

            <div class="flex items-center gap-4 mb-2">
                <label for="modelName" class="font-semibold w-24">ModelName</label>
                <select id="modelName" v-model="agent.modelName" class="w-full">
                    <option value="">Please Select an Option</option>
                    <option :value="model" v-for="model in modelsNames">{{ model }}</option>
                </select>
            </div>

            <div class="flex items-center gap-4 mb-2" v-if="create == 'edit'">
                <label for="indexId" class="font-semibold w-24">IndexId</label>
                <input type="number" v-model="agent.indexId" id="indexId" class="flex-auto" autocomplete="off" />
            </div>
            <template #footer>
                <Button label="Cancel" text severity="secondary" @click="visible = false" autofocus />
                <Button v-if="create == 'create'" label="Create" variant="outlined" severity="secondary"
                    @click="createAgent" autofocus />
                <Button v-if="create == 'trash'" label="Delete" variant="outlined" severity="secondary"
                    @click="deleteAgent" autofocus />
                <Button v-if="create == 'edit'" label="Edit" variant="outlined" severity="secondary"
                    @click="updateAgent" autofocus />
            </template>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { AgentUpdate } from '@/models/AgentUpdate.ts';
import type { AgentResponse } from '@/models';
import { AgApi } from "@/apis/api";
import type { AddAgentApiV1AgentsPostRequest, UpdateAgentApiV1AgentsAgentIdPatchRequest, DeleteAgentApiV1AgentsAgentIdDeleteRequest } from "@/apis";
import type { AgentCreate } from '@/models';
import { useAgentStore } from '@/stores/agent';
import { IndApi } from '@/apis/api';
import type { CreateIndexApiV1IndexPostRequest } from '@/apis/IndexApi';
import { useToast } from 'primevue/usetoast';
import { LlmApi } from '@/apis/api';

const toast = useToast();
const store = useAgentStore();
const props = defineProps<{
    create: string,
    data?: AgentResponse
}>();
let modelsNames = ref();

const visible = ref(false);

let agent = ref({
    name: "",
    description: "",
    indexId: 0,
    modelName: "",
    id: ""
})

onMounted(async () => {
    try {
        const response = await LlmApi.listLlmsApiV1LlmsGet();
        if (response) {
            modelsNames.value = Object.entries(response)?.map((llm: any) => {
                return llm[0]
            });
        }
    } catch (error) {
        console.error("Failed to retrieve LLMs:", error);
    }
})

watch(() => props.data, async () => {
    console.log(props.data)
    change_model();
}, { immediate: true });


function change_model() {
    agent.value.name = props.data?.name ?? "";
    agent.value.description = props.data?.description ?? "";
    agent.value.indexId = props.data?.indexId ?? 0;
    agent.value.modelName = props.data?.modelName ?? "";
    agent.value.id = props.data?.id ?? "";
}

async function createAgent() {
    console.log(agent.value);
    let agentCreate: AgentCreate = {
        name: agent.value.name,
        description: agent.value.description,
        indexId: agent.value.indexId,
        modelName: agent.value.modelName,
    }
    let info: AddAgentApiV1AgentsPostRequest = { agentCreate: agentCreate };
    await AgApi.addAgentApiV1AgentsPost(info).then(
        (agRes) => {

            let indexInfo: CreateIndexApiV1IndexPostRequest = {
                name: `${agent.value.name}_index`,
                indexType: 'FileIndex',
                requestBody: {}
            };

            IndApi.createIndexApiV1IndexPost(indexInfo).then(async (res) => {
                let updateData: AgentUpdate = {
                    indexId: res.id,
                    modelName: agent.value.modelName
                }
                let update: UpdateAgentApiV1AgentsAgentIdPatchRequest = {
                    agentId: agRes.id,
                    agentUpdate: updateData
                }
                await AgApi.updateAgentApiV1AgentsAgentIdPatch(update).then((res) => {
                    visible.value = false;
                    store.data.push(res)
                    toast.add({
                        severity: 'success',
                        summary: 'Agent has been created successfully',
                        detail: `Agent has been created ${agent.value.name}`,
                        life: 4000
                    })
                })
            })
        }
    );
}
async function updateAgent() {
    let updateData: AgentUpdate = {
        indexId: agent.value.indexId,
        modelName: agent.value.modelName,
        name: agent.value.name,
        description: agent.value.description
    }
    let update: UpdateAgentApiV1AgentsAgentIdPatchRequest = {
        agentId: agent.value.id,
        agentUpdate: updateData
    }
    await AgApi.updateAgentApiV1AgentsAgentIdPatch(update).then(() => {
        visible.value = false;
    })
}
async function deleteAgent() {
    let deleteData: DeleteAgentApiV1AgentsAgentIdDeleteRequest = {
        agentId: agent.value.id,
    }
    await AgApi.deleteAgentApiV1AgentsAgentIdDelete(deleteData).then(() => {
        visible.value = false;
        store.removeAgent(agent.value.id);
    })
}

</script>
<style scoped>
#btn-create,
#btn-edit,
#btn-delete {
    transition: box-shadow 0.2s ease-in-out;
}

#btn-create:hover {
    box-shadow: 0px 0px 16px var(--color-green-400);
}

#btn-edit:hover {
    box-shadow: 0px 0px 16px var(--color-blue-400);
}

#btn-delete:hover {
    box-shadow: 0px 0px 16px var(--color-red-400);
}
</style>