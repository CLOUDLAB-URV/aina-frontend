<template>
    <div class="flex gap-2">
        <section class="file-list-container flex flex-col w-1/4 gap-3">
            <h3 class="text-2xl">File Upload</h3>
            <AgentSelects @agent-selected="(ag:any) => agent = ag"/>
            <!-- <Button v-if="agent" label="Delete all Files" icon="pi pi-trash" severity="danger" @click="deleteAllFiles"/> -->
            <UploadFiles v-if="agent?.id" :agent-id="agent.id" class="p-1"/>
            <p class="">
                Supported file types: .png, .jpeg, .jpg, .tiff, .tif, .pdf, .xls, .xlsx, .doc, .docx, .pptx, .csv,
                .html, .mhtml, .txt, .zip
            </p>
            <p>Maximum file size: 1000 MB</p>
        </section>
        <section class="col-start-2 col-span-3 file-list-container w-3/4">
            <h3 class="mb-3 text-2xl">File List</h3>
            <div>
                <header>
                    <h4 class="mb-2 text-xl">Filter by name:</h4>
                    <p class="mb-2 text-sm">(1) Case-insesitive, (2) Seach with empty string to show all files</p>
                    <div class="flex gap-2">
                        <!-- <textarea name="" id="" class="w-full" v-model="filter"></textarea> -->
                        <InputText v-model="filter" class="grow"/>
                        <Button icon="pi pi-search" @click="search"/>
                    </div>                    
                </header>
            </div>
            <DataTable :value="fileStore.files" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" stripedRows
                @row-click="madeClick" tableStyle="min-width: 50rem">
                <Column field="name" header="Name" style="width: 70%"></Column>
                <Column field="size" header="Size" style="width: 5%"></Column>
                <Column field="tokens" header="Tokens" style="width: 5%"></Column>
                <Column field="loader" header="Loader" style="width: 5%"></Column>
                <Column field="date_created" header="Date Created" style="width: 15%"></Column>
            </DataTable>
            <section v-if="data_selected" class="flex gap-2 mt-3">
                <Button severity="danger" icon="pi pi-trash" label="Delete" class="grow" @click=delete_file></Button>
                <!-- <Button severity="info" icon="pi pi-download" label="Download File" class="grow"></Button> -->
            </section>
        </section>
    </div>
    <section class="file-list-container mt-2">
        <h3 class="mb-3 text-2xl">LogInfo Indexing Files</h3>
        <p v-for="file in fileStore.data" class="mb-2">{{ file }}</p>
    </section>
</template>

<script setup lang="ts">
import UploadFiles from '@/components/UploadFiles.vue';
import { ref,watch } from 'vue';
import { IndApi } from '@/apis/api';
import type { ListFilesApiV1IndexIndexIdFilesGetRequest,DeleteFileApiV1IndexIndexIdFilesFileIdDeleteRequest } from '@/apis/IndexApi';
import { useFilesStore } from '@/stores/file';
import AgentSelects from '@/components/AgentSelects.vue';

let data_selected = ref();
let agent = ref();
let filter = ref();
const fileStore = useFilesStore();

watch(
    () => agent.value,
    async ()=>{
        if(agent.value.id){
            let index: ListFilesApiV1IndexIndexIdFilesGetRequest = {
                indexId: agent.value.indexId
            }
            let notFiltered = await IndApi.listFilesApiV1IndexIndexIdFilesGet(index);
            fileStore.files = Object.values(notFiltered);
        }
    }
)

async function search(){
    let index: ListFilesApiV1IndexIndexIdFilesGetRequest = {
        indexId: agent.value.indexId,
        namePattern : filter.value
    }
    let notFiltered = await IndApi.listFilesApiV1IndexIndexIdFilesGet(index);
    fileStore.files = Object.values(notFiltered);
}

async function delete_file(){
    let data : DeleteFileApiV1IndexIndexIdFilesFileIdDeleteRequest ={
        indexId: agent.value.indexId,
        fileId: data_selected.value.id,
    }
    await IndApi.deleteFileApiV1IndexIndexIdFilesFileIdDelete(data).then((res)=>{
        console.log(res);
        fileStore.removeFiles(res)
        data_selected.value = null
    })
}

// async function deleteAllFiles(){
//     let data : DeleteAllFilesApiV1IndexIndexIdFilesDeleteRequest ={
//         indexId:agent.value.indexId
//     }
//     await IndApi.deleteAllFilesApiV1IndexIndexIdFilesDelete(data).then(()=>{
//         fileStore.files = [];
//     })
// }

async function madeClick(value: any) {
    data_selected.value = value.data;
    console.log(data_selected.value)
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