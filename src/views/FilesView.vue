<template>
    <div class="flex gap-2">
        <section class="file-list-container flex flex-col w-1/4 gap-3">
            <h3 class="text-2xl">File Upload</h3>
            <AgentSelects @agent-selected="(ag) => agent = ag" />
            <!-- <Button v-if="agent" label="Delete all Files" icon="pi pi-trash" severity="danger" @click="deleteAllFiles"/> -->
            <UploadFiles v-if="agent?.id && agent?.indexId && index" :agent-id="agent.id" class="p-1" :index="index" />
        </section>
        <section class="col-start-2 col-span-3 file-list-container w-3/4">
            <Tabs value="0">
                <TabList class="tab-container">
                    <Tab value="0">File List</Tab>
                    <Tab value="1">Groups</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel value="0">
                        <h3 class="mb-3 text-2xl">File List</h3>
                        <div>
                            <header>
                                <h4 class="mb-2 text-xl">Filter by name:</h4>
                                <p class="mb-2 text-sm">(1) Case-insesitive, (2) Seach with empty string to show all
                                    files</p>
                                <div class="flex gap-2">
                                    <!-- <textarea name="" id="" class="w-full" v-model="filter"></textarea> -->
                                    <InputText v-model="filter" class="grow" />
                                    <Button icon="pi pi-search" @click="search"></Button>
                                </div>
                            </header>
                        </div>
                        <DataTable :value="fileStore.files" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"
                            stripedRows @row-click="fileClick" tableStyle="min-width: 50rem">
                            <Column field="name" header="Name" style="width:55%"></Column>
                            <Column field="size" header="Size" style="width: 5%"></Column>
                            <Column field="tokens" header="Tokens" style="width: 5%"></Column>
                            <Column field="loader" header="Loader" style="width: 15%"></Column>
                            <Column field="dateCreated" header="Date Created" style="width: 20%"></Column>
                        </DataTable>
                        <section v-if="file_selected" class="flex flex-col gap-2 mt-3">
                            <span>Selected file: {{ file_selected.name }}</span>
                            <Button severity="danger" icon="pi pi-trash" label="Delete" class="grow"
                                @click=delete_file></Button>
                            <Button severity="secondary" label="Close" icon="pi pi-times" class="p-button-text"
                                @click="delete file_selected"></Button>
                            <!-- <Button severity="info" icon="pi pi-download" label="Download File" class="grow"></Button> -->
                        </section>
                    </TabPanel>
                    <TabPanel value="1">
                        <h3 class="mb-3 text-2xl">Groups</h3>
                        <DataTable :value="groups" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" stripedRows
                            @row-click="groupClick" tableStyle="min-width: 50rem">
                            <Column field="name" header="Name" style="width: 15%"></Column>
                            <Column field="fileNames" header="Files" style="width: 60%"></Column>
                            <Column field="dateCreated" header="Date Created" style="width: 25%"></Column>
                        </DataTable>
                        <section v-if="!group_selected" class="flex flex-col gap-2 mt-3">
                            <!-- button to add group -->
                            <Button label="Add" icon="pi pi-plus" severity="success"
                                @click="showNewGroupDialog = true"></Button>
                        </section>
                        <Dialog v-if="showNewGroupDialog" modal header="Create New Group" :style="{ width: '30rem' }">
                            <div class="flex flex-col gap-4 mb-4">
                                <label for="group-name">Group Name</label>
                                <InputText id="group-name" v-model="newGroup.name" class="grow" />
                                <label for="group-files">Attached files</label>
                                <MultiSelect id="group-files" v-model="newGroup.files" :options="fileStore.files"
                                    optionLabel="name" optionValue="id" />
                            </div>
                            <template #footer>
                                <Button label="Cancel" icon="pi pi-times" severity="secondary"
                                    @click="showNewGroupDialog = false" autofocus></Button>
                                <Button label="Create" icon="pi pi-check" severity="success" @click="add_group"
                                    autofocus></Button>
                            </template>
                        </Dialog>
                        <section v-if="group_selected" class="flex flex-col gap-2 mt-3">
                            <Button severity="danger" icon="pi pi-trash" label="Delete Group" class="grow"
                                @click=delete_group></Button>
                            <label for="group-name">Group Name</label>
                            <InputText id="group-name" v-model="group_selected.name" class="grow" />
                            <label for="group-files">Attached files</label>
                            <MultiSelect id="group-files" v-model="group_selected.files" :options="fileStore.files"
                                optionLabel="name" optionValue="id" />
                            <Button label="Save" icon="pi pi-check" @click="save_group"></Button>
                            <Button severity="secondary" label="Close" icon="pi pi-times" class="p-button-text"
                                @click="group_selected = undefined"></Button>
                        </section>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </section>
    </div>
</template>

<script setup lang="ts">
import UploadFiles from '@/components/UploadFiles.vue';
import { ref, watch } from 'vue';
import { IndApi } from '@/apis/api';
import { useFilesStore } from '@/stores/file';
import AgentSelects from '@/components/AgentSelects.vue';
import { type IndexInfo, type AgentResponse, type GroupInfo, type FileInfo } from '@/models';
import MultiSelect from 'primevue/multiselect';

let file_selected = ref<FileInfo>();
let group_selected = ref<GroupInfo>();
let showNewGroupDialog = ref(false);

let newGroup = ref<{ name: string; files: string[] }>(getDefaultGroup());

let index = ref<IndexInfo>();

let agent = ref<AgentResponse>();
let filter = ref<string>();
const fileStore = useFilesStore();
let groups = ref<GroupInfo[]>();

function getDefaultGroup(): { name: string; files: string[] } {
    return { name: "", files: [] };
}

async function loadFilesAndGroups() {
    if (agent.value?.indexId) {
        let notFiltered = await IndApi.listFilesApiV1IndexIndexIdFilesGet({
            indexId: agent.value.indexId
        });
        fileStore.files = Object.values(notFiltered);
        let indexGroups = await IndApi.listGroupsApiV1IndexIndexIdGroupsGet({
            indexId: agent.value.indexId
        });
        let info = indexGroups.map((group: GroupInfo) => {
            let fileNames = group.files.map((file) => notFiltered.find((f) => f.id === file)?.name).join(", ");
            return { ...group, fileNames };
        });
        groups.value = Object.values(info);
    }
}

async function loadIndexInfo() {
    if (agent.value?.indexId) {
        index.value = await IndApi.getIndexApiV1IndexIndexIdGet({
            indexId: agent.value.indexId
        });
    }
}

watch(agent, async () => {
    if (agent.value?.id) {
        await Promise.all([loadFilesAndGroups(), loadIndexInfo()]);
    }
})

async function search() {
    if (!agent.value?.id || !agent.value?.indexId) {
        return;
    }
    let notFiltered = await IndApi.listFilesApiV1IndexIndexIdFilesGet({
        indexId: agent.value.indexId,
        namePattern: filter.value
    });
    fileStore.files = Object.values(notFiltered);
}

async function delete_file() {
    if (!agent.value?.id || !agent.value?.indexId || !file_selected.value) {
        return;
    }
    await IndApi.deleteFileApiV1IndexIndexIdFilesFileIdDelete({
        indexId: agent.value.indexId,
        fileId: file_selected.value.id,
    })
    fileStore.removeFile(file_selected.value.id)
    delete file_selected.value;
}

async function add_group() {
    if (!agent.value?.id || !agent.value?.indexId || !newGroup.value) {
        return;
    }
    await IndApi.createGroupApiV1IndexIndexIdGroupsPost({
        indexId: agent.value.indexId,
        groupName: newGroup.value.name,
        requestBody: newGroup.value.files
    });
    await loadFilesAndGroups();
    group_selected.value = undefined;
    showNewGroupDialog.value = false;
    newGroup.value = getDefaultGroup();
}

async function delete_group() {
    if (!agent.value?.id || !agent.value?.indexId || !group_selected.value) {
        return;
    }
    await IndApi.deleteGroupApiV1IndexIndexIdGroupsGroupIdDelete({
        indexId: agent.value.indexId,
        groupId: group_selected.value.id,
    });
    await loadFilesAndGroups();
    group_selected.value = undefined;
}

async function save_group() {
    if (!agent.value?.id || !agent.value?.indexId || !group_selected.value) {
        return;
    }
    await IndApi.updateGroupApiV1IndexIndexIdGroupsGroupIdPatch({
        indexId: agent.value.indexId,
        groupId: group_selected.value.id,
        groupName: group_selected.value.name,
        bodyUpdateGroupApiV1IndexIndexIdGroupsGroupIdPatch: {
            fileIds: group_selected.value.files
        }
    });
    await loadFilesAndGroups();
    group_selected.value = undefined;
}

// async function deleteAllFiles(){
//     let data : DeleteAllFilesApiV1IndexIndexIdFilesDeleteRequest ={
//         indexId:agent.value.indexId
//     }
//     await IndApi.deleteAllFilesApiV1IndexIndexIdFilesDelete(data).then(()=>{
//         fileStore.files = [];
//     })
// }

async function fileClick(value: any) {
    file_selected.value = value.data;
    console.log(file_selected.value)
}
async function groupClick(value: any) {
    group_selected.value = value.data;
    console.log(group_selected.value)
}
</script>
<style scoped>
.file-list-container {
    background-color: var(--surface-overlay);
    border-radius: var(--content-border-radius);
    padding: 1rem;
}

header {
    border-color: var(--surface-border);
    border-radius: var(--content-border-radius);
    border-width: 0.125rem;
    padding: 1rem;
}

textarea {
    border-color: var(--p-inputtext-border-color);
    border-radius: var(--content-border-radius);
    border-width: 0.125rem;
}
</style>