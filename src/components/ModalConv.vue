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
        <Dialog v-model:visible="visible" modal :header="t('input.select.conv.details')" :style="{ width: '40rem' }">
            <div class="flex items-center gap-4 mb-4">
                <label for="name" class="font-semibold w-24"><i18n-t keypath="input.name.label"/></label>
                <InputText v-model="conv.name" id="name" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex gap-2">
                <label for="public"><i18n-t keypath="public"/></label>
                <Checkbox id="public" binary v-model="conv.isPublic" />
            </div>
            <template #footer>
                <Button :label="t('cancel')" text severity="secondary" @click="visible = false" autofocus />
                <Button v-if="create == 'create'" :label="t('create')" variant="outlined" severity="secondary"
                    @click="createconv" autofocus />
                <Button v-if="create == 'trash'" :label="t('input.delete.label')" variant="outlined" severity="secondary"
                    @click="deleteconv" autofocus />
                <Button v-if="create == 'edit'" :label="t('input.save.label')" variant="outlined" severity="secondary" @click="updateconv"
                    autofocus />
            </template>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { ConversationCreate, ConversationUpdate } from '@/models/index';
import type { AddConversationApiV1ConversationsPostRequest, UpdateConversationApiV1ConversationsConversationIdPatchRequest, DeleteConversationApiV1ConversationsConversationIdDeleteRequest } from '@/apis/ConversationsApi';
import { ConvApi } from '@/apis/api';
import { useConvStore } from '@/stores/conv';
import { useToast } from 'primevue/usetoast';
import type { ApiSchemasConversationsConversationInfo } from '@/models';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import { useI18n } from 'vue-i18n';

const {t} = useI18n()

const toast = useToast();
const props = defineProps<{
    create: string;
    agentId: string;
    conv?: ApiSchemasConversationsConversationInfo;
}>();

const emit = defineEmits<{
    deleted: [],
    convCreated: [conv: ApiSchemasConversationsConversationInfo]
}>();

const convStore = useConvStore();
const visible = ref(false);

let conv = ref({
    name: "",
    isPublic: false,
    agentId: "",
    id: ""
})

onMounted(async () => {
    change_model();
    conv.value.agentId = props.agentId;
});

watch(() => props.conv, async () => {
    change_model();
});

watch(() => props.agentId, async () => {
    conv.value.agentId = props.agentId;
});


function change_model() {
    console.log(props.conv);
    conv.value.name = props.conv?.name ?? "";
    conv.value.isPublic = props.conv?.isPublic ?? false;
    conv.value.id = props.conv?.id ?? "";
}

async function createconv() {
    console.log(conv.value.id);
    let convCreate: ConversationCreate = {
        name: conv.value.name,
        isPublic: conv.value.isPublic,
        agentId: conv.value.agentId,
    }
    let info: AddConversationApiV1ConversationsPostRequest = { conversationCreate: convCreate };
    let newConv = await ConvApi.addConversationApiV1ConversationsPost(info);
    emit('convCreated', newConv);
    console.log(newConv);
    convStore.addConv(newConv);
    toast.add({ severity: 'success', summary: 'Conversation has been create successfully', detail: `Create conversation with name ${newConv.name}`, life: 300000 });
    conv.value.name = "";
    conv.value.isPublic = false;
    visible.value = false;
}

async function updateconv() {
    let updateData: ConversationUpdate = {
        name: conv.value.name,
        isPublic: conv.value.isPublic,
        agentId: conv.value.agentId,
    }
    let update: UpdateConversationApiV1ConversationsConversationIdPatchRequest = {
        conversationId: conv.value.id,
        conversationUpdate: updateData
    }
    await ConvApi.updateConversationApiV1ConversationsConversationIdPatch(update).then((res) => {
        console.log(res)
        visible.value = false;
        convStore.updateConv(res)
    })
}

async function deleteconv() {
    let deleteData: DeleteConversationApiV1ConversationsConversationIdDeleteRequest = {
        conversationId: conv.value.id,
    }
    await ConvApi.deleteConversationApiV1ConversationsConversationIdDelete(deleteData).then(() => {
        visible.value = false;
        convStore.removeConv(conv.value.id);
        console.log("EMIT")
        emit('deleted')
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