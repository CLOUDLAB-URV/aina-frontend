<template>
    <div class="flex flex-col gap-4">
        <FileUpload ref="fileUpload" :multiple="true" :customUpload="true" @uploader="uploadFiles"
            @select="handleFileSelect" :accept="acceptedFileTypes" :showUploadButton="false" :showCancelButton="false">
            <template #header="{ chooseCallback, files }">
                <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
                    <div class="flex gap-2">
                        <Button @click="chooseCallback()" icon="pi pi-plus" rounded variant="outlined"
                            severity="secondary" label="Choose Files" />
                        <Button @click="uploadFiles" icon="pi pi-cloud-upload" rounded severity="success"
                            :disabled="!files || files.length === 0 || isIndexing" :loading="isIndexing"
                            label="Upload Files" />
                    </div>
                </div>
            </template>
            <template #content="{ files, removeFileCallback }">
                <div v-if="files.length > 0" class="flex flex-col gap-4 pt-4">
                    <h5 class="m-0">Selected Files</h5>
                    <div class="flex flex-col gap-2">
                        <div v-for="(file, index) of files" :key="file.name + file.type + file.size"
                            class="flex items-center justify-between p-3 border border-surface rounded-lg">
                            <div class="flex items-center gap-3">
                                <i class="pi pi-file text-xl"></i>
                                <div>
                                    <div class="font-semibold">{{ file.name }}</div>
                                    <div class="text-sm text-muted-color">{{ formatSize(file.size) }}</div>
                                </div>
                            </div>
                            <Button icon="pi pi-times" @click="removeFileCallback(index)" variant="outlined" rounded
                                severity="danger" size="small" />
                        </div>
                    </div>
                </div>
            </template>
            <template #empty>
                <div class="flex items-center justify-center flex-col p-8">
                    <i class="pi pi-cloud-upload text-4xl text-muted-color mb-4"></i>
                    <p class="text-muted-color mb-2">Drag and drop files here or click Choose Files</p>
                    <div v-if="props.index?.config" class="text-xs text-muted-color text-center">
                        <p v-if="props.index.config.supported_file_types" class="mb-1">
                            Supported: {{ props.index.config.supported_file_types }}
                        </p>
                        <p v-if="props.index.config.max_file_size" class="mb-0">
                            Max size: {{ props.index.config.max_file_size }} MB
                        </p>
                    </div>
                </div>
            </template>
        </FileUpload>

        <div class="flex items-center gap-2">
            <Checkbox binary id="reindex" v-model="reindex" />
            <label for="reindex">ReIndex</label>
        </div>

        <div v-if="logMessages.length > 0" class="mt-4">
            <h5>Upload Progress</h5>
            <div class="bg-surface border rounded-lg p-3 max-h-40 overflow-y-auto">
                <div v-for="(message, index) in logMessages" :key="index" class="text-sm">
                    {{ message }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useFilesStore } from '@/stores/file';
import { useToast } from 'primevue/usetoast';
import type { ListFilesApiV1IndexIndexIdFilesGetRequest } from '@/apis/IndexApi';
import type { IndexInfo } from '@/models';
import { IndApi } from '@/apis/api';
import { Checkbox, FileUpload, Button } from 'primevue';
const props = defineProps<{
    agentId: string,
    index: IndexInfo
}>();

const fileUpload = ref<InstanceType<typeof FileUpload>>();
const selectedFiles = ref<File[]>([]);
let reindex = ref(false);
const logMessages = ref<any[]>([]);
const isIndexing = ref(false);
const controller = new AbortController();
const fileStore = useFilesStore();
const toast = useToast();

const acceptedFileTypes = computed(() => {
    if (props.index?.config?.supported_file_types) {
        return props.index.config.supported_file_types;
    }
    return undefined;
});

// Format file size
function formatSize(bytes: number): string {
    const k = 1024;
    const dm = 2;
    const sizes = ['B', 'KB', 'MB', 'GB'];

    if (bytes === 0) return '0 B';

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function handleFileSelect(event: any) {
    const files = event.files;
    const validFiles: File[] = [];

    for (const file of files) {
        if (validateFile(file)) {
            validFiles.push(file);
        }
    }

    selectedFiles.value = validFiles;
}

function validateFile(file: File): boolean {
    if (props.index?.config?.supported_file_types) {
        const supportedTypes = props.index.config.supported_file_types
            .split(',')
            .map((type: string) => type.trim().toLowerCase());

        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

        if (!supportedTypes.includes(fileExtension)) {
            toast.add({
                severity: 'error',
                summary: 'Invalid File Type',
                detail: `File "${file.name}" is not supported. Allowed types: ${props.index.config.supported_file_types}`,
                life: 5000
            });
            return false;
        }
    }

    if (props.index?.config?.max_file_size) {
        const maxSizeBytes = props.index.config.max_file_size * 1024 * 1024; // Convert MB to bytes

        if (file.size > maxSizeBytes) {
            toast.add({
                severity: 'error',
                summary: 'File Too Large',
                detail: `File "${file.name}" (${formatSize(file.size)}) exceeds maximum size of ${props.index.config.max_file_size} MB`,
                life: 5000
            });
            return false;
        }
    }

    return true;
}

async function uploadFiles() {
    if (!selectedFiles.value || selectedFiles.value.length === 0) {
        toast.add({
            severity: 'warn',
            summary: 'No Files Selected',
            detail: 'Please select files to upload.',
            life: 3000
        });
        return;
    }

    const url = `http://localhost:8000/api/v1/index/index?agent_id=${props.agentId}&reindex=${reindex.value}`;

    isIndexing.value = true;
    logMessages.value = [];

    const formData = new FormData();
    for (const file of selectedFiles.value) {
        formData.append("files", file);
    }

    try {
        await fetchEventSource(url, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            signal: controller.signal,
            onmessage(ev: any) {
                console.log(ev.data[2]);
                logMessages.value.push(ev.data);

                if (ev.data[2] == '❌') {
                    console.log('failed');
                    toast.add({
                        severity: 'error',
                        summary: 'Upload Failed',
                        detail: 'Something went wrong, consult the log',
                        life: 5000
                    });
                } else if (ev.data[2] == '✅') {
                    console.log('uploaded correct');
                    toast.add({
                        severity: 'success',
                        summary: 'Upload Successful',
                        detail: 'Files uploaded successfully',
                        life: 3000
                    });

                    // Refresh file list
                    let index: ListFilesApiV1IndexIndexIdFilesGetRequest = {
                        indexId: props.index.id
                    }
                    IndApi.listFilesApiV1IndexIndexIdFilesGet(index).then((res) => {
                        console.log(res)
                        fileStore.files = Object.values(res);
                    });

                    selectedFiles.value = [];
                }
                fileStore.addFiles(ev.data);
            },
            onerror(err) {
                console.error('Upload error:', err);
                toast.add({
                    severity: 'error',
                    summary: 'Upload Error',
                    detail: 'An error occurred during upload',
                    life: 5000
                });
            }
        });
    } catch (error) {
        console.error('Upload failed:', error);
        toast.add({
            severity: 'error',
            summary: 'Upload Failed',
            detail: 'Failed to start upload process',
            life: 5000
        });
    } finally {
        isIndexing.value = false;
    }
}
</script>
