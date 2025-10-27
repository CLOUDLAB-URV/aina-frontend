<template>
    <form class="flex flex-col">
        <div>
            <input 
                type="file" 
                id="fileInput"
                required
                multiple
                @change="handleFileChange" 
            />
            <ul class="mt-4">
                <li v-for="file in files" class="overflow-hidden mt-2">{{ file }}</li>
            </ul>
        </div>

        <button 
            type="submit" 
            id="submitButton"
            class="bg-blue-500 p-2 text-white rounded-2xl mt-2"
            @click="FileUpload"
        >
            Upload File
        </button>
    </form>
</template>

<script setup lang="ts">
import type { IndexFilesApiV1IndexIndexIndexIdIndexFilesPostRequest } from '@/apis/IndexApi.ts';
import { IndApi } from '@/apis/api';
import { ref } from 'vue';

let files = ref<any>([]);

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

function FileUpload(event: Event) {
    event.preventDefault();

    const fileInput = document.getElementById('fileInput') as HTMLInputElement;

    event.preventDefault();

    const files = fileInput.files;

    let request : IndexFilesApiV1IndexIndexIndexIdIndexFilesPostRequest = {
        indexId: 1,
        agentId : "69963de52fe64029873a3293fe000e5b",
        files: files ? Array.from(files) : [],
    };

    IndApi.indexFilesApiV1IndexIndexIndexIdIndexFilesPost(request)
    .then(response => {
        console.log('Files uploaded successfully:', response);
    })
    .catch(error => {
        console.error('Error uploading files:', error);
    });
}

</script>