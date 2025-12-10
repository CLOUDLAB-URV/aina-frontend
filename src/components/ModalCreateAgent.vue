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
        <Dialog v-model:visible="visible" modal :style="{ width: '40rem' }" :header="t('input.select.agent.details')">
            <div class="flex items-center gap-4 mb-4">
                <label for="name" class="font-semibold w-24"><i18n-t keypath="input.name.label"/></label>
                <InputText v-model="agent.name" id="name" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex items-center gap-4 mb-2">
                <label for="desc" class="font-semibold w-24"><i18n-t keypath="input.descr.label"/></label>
                <Textarea v-model="agent.description" id="desc" class="flex-auto border border-gray-200 p-2"
                    autocomplete="off" />
            </div>

            <!-- <div class="flex items-center gap-4 mb-2" v-if="create == 'edit'">
                <label for="indexId" class="font-semibold w-24">IndexId</label>
                <InputNumber v-model="agent.indexId" id="indexId" class="flex-auto" autocomplete="off" />
            </div> -->
            <template #footer>
                <Button :label="t('cancel')" text severity="secondary" @click="visible = false" autofocus />
                <Button v-if="create == 'create'" :label="t('create')" variant="outlined" severity="success"
                    @click="createAgent" autofocus />
                <Button v-if="create == 'trash'" :label="t('input.delete.label')" variant="outlined" severity="danger"
                    @click="deleteAgent" autofocus />
                <Button v-if="create == 'edit'" :label="t('input.save.label')" variant="outlined" severity="secondary"
                    @click="updateAgent" autofocus />
            </template>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { AgentResponse } from '@/models';
import { AgApi } from "@/apis/api";
import { useAgentStore } from '@/stores/agent';
import { IndApi } from '@/apis/api';
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { Textarea } from 'primevue';
import { useI18n } from 'vue-i18n';

const {t} = useI18n()
const toast = useToast();
const store = useAgentStore();
const props = defineProps<{
    create: string,
    data?: AgentResponse
}>();

const emit = defineEmits<{
    agentCreated: [agent: AgentResponse]
}>();

const visible = ref(false);

let agent = ref({
    name: "",
    description: "",
    indexId: "",
    id: ""
})

watch(() => props.data, async () => {
    console.log(props.data)
    change_model();
}, { immediate: true });


function change_model() {
    agent.value.name = props.data?.name ?? "";
    agent.value.description = props.data?.description ?? "";
    agent.value.id = props.data?.id ?? "";
}

async function createAgent() {
    console.log(agent.value);
    let newAgent = await AgApi.addAgentApiV1AgentsPost({
        agentCreate: {
            name: agent.value.name,
            description: agent.value.description,
        }
    });
    let index = await IndApi.createIndexApiV1IndexPost({
        name: `${newAgent.name}_index`,
        indexType: 'FileIndex',
    });
    let updatedAgent = await AgApi.updateAgentApiV1AgentsAgentIdPatch({
        agentId: newAgent.id,
        agentUpdate: {
            indexId: index.id,
        }
    });
    visible.value = false;
    store.data.push(updatedAgent)
    emit('agentCreated', updatedAgent);
    toast.add({
        severity: 'success',
        summary: t('agent_created'),
        detail: t('agent_created_detail', { name: newAgent.name }),
        life: 4000
    });
}
async function updateAgent() {
    await AgApi.updateAgentApiV1AgentsAgentIdPatch({
        agentId: agent.value.id,
        agentUpdate: {
            indexId: agent.value.indexId,
            name: agent.value.name,
            description: agent.value.description
        }
    }).then(() => {
        visible.value = false;
        toast.add({
            severity: 'success',
            summary: t('agent_updated'),
            detail: t('agent_updated_detail', { name: agent.value.name }),
            life: 4000
        })
    })
}
async function deleteAgent() {
    await AgApi.deleteAgentApiV1AgentsAgentIdDelete({
        agentId: agent.value.id,
    }).then(() => {
        visible.value = false;
        store.removeAgent(agent.value.id);
        toast.add({
            severity: 'success',
            summary: t('agent_deleted'),
            detail: t('agent_deleted_detail', { name: agent.value.name }),
            life: 4000
        });
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