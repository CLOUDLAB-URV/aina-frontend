<template>
    <form class="flex flex-col">
        <div>
            <input type="file" id="fileInput" required multiple @change="handleFileChange" />
            <ul class="mt-4">
                <li v-for="file in files" class="overflow-hidden mt-2">{{ file }}</li>
            </ul>
        </div>

        <button type="submit" id="submitButton" class="bg-blue-500 p-2 text-white rounded-2xl mt-2" @click="FileUpload">
            Upload File
        </button>
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useFilesStore } from '@/stores/file';
import { useToast } from 'primevue/usetoast';
import type { ListFilesApiV1IndexIndexIndexIdFilesGetRequest } from '@/apis/IndexApi';
import { IndApi } from '@/apis/api';

let files = ref<any>([]);
const logMessages = ref<any[]>([]);
const isIndexing = ref(false);
const controller = new AbortController();
const fileStore = useFilesStore();
const toast = useToast();


async function FileUpload(event: Event) {

    const agentId = "47ca9c8bece44c059407c6e5c7e4cdef";
    const url = `http://192.168.1.169:8000/api/v1/index/index?agent_id=${agentId}&reindex=true`;

    event.preventDefault();
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) {
        alert("Please select files to upload.");
        return;
    }

    isIndexing.value = true;
    logMessages.value = [];

    const formData = new FormData();
    for (const file of fileInput.files) {
        formData.append("files", file);
    }

    fetchEventSource(url, {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        signal: controller.signal,
        onmessage(ev: any) {
            console.log(ev.data[2]);
            if (ev.data[2] == '❌') {
                console.log('failed');
                toast.add({ severity: 'error', summary: 'Something went wrong consult the log', detail: 'Something went wrong consult the log', life: 3000 })
            } else if (ev.data[2] == '✅') {
                console.log('uploaded correct');
                toast.add({ severity: 'success', summary: 'Uploaded File', detail: 'Uploaded File', life: 3000 })
                let index: ListFilesApiV1IndexIndexIndexIdFilesGetRequest = {
                    indexId: 1
                }
                IndApi.listFilesApiV1IndexIndexIndexIdFilesGet(index).then((res) => {
                    // console.log(res)
                    fileStore.files = Object.values(res);
                });
            }
            fileStore.addFiles(ev.data);
        }
    });
}


function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log("QUE TE PASA");
    if (input.files && input.files.length > 0) {
        const fileNames = Array.from(input.files).map(file => file.name);
        fileNames.forEach((fileName) => {
            files.value.push(`${fileName}`);
        })
    }
}

</script>