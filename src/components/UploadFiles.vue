<template>
    <div class="flex flex-col gap-4">
        <FileUpload ref="fileUpload" :multiple="true" :customUpload="true" @uploader="uploadFiles"
            @select="handleFileSelect" :accept="acceptedFileTypes" :showUploadButton="false" :showCancelButton="false">
            <template #header="{ chooseCallback, files }">
                <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
                    <div class="flex gap-2">
                        <Button @click="chooseCallback()" icon="pi pi-plus" rounded variant="outlined"
                            severity="secondary" :label="t('filegroup.file.choice')" />
                        <Button @click="uploadFiles" icon="pi pi-cloud-upload" rounded severity="success"
                            :disabled="!files || files.length === 0 || isIndexing" :loading="isIndexing"
                            :label="t('filegroup.file.upload.label')" />
                    </div>
                </div>
            </template>
            <template #content="{ files, removeFileCallback }">
                <div v-if="files.length > 0" class="flex flex-col gap-4 pt-4">
                    <h5 class="m-0"><i18n-t keypath="filegroup.file.selected"/></h5>
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
                    <p class="text-muted-color mb-2"><i18n-t keypath="drag_drop"/></p>
                    <div v-if="props.index?.config" class="text-xs text-muted-color text-center">
                        <p v-if="props.index.config.supported_file_types" class="mb-1">
                            <i18n-t keypath="supported"/> : {{ props.index.config.supported_file_types }}
                        </p>
                        <p v-if="props.index.config.max_file_size" class="mb-0">
                            <i18n-t keypath="max_size"/> : {{ props.index.config.max_file_size }} MB
                        </p>
                    </div>
                </div>
            </template>
        </FileUpload>

        <div class="flex items-center gap-2">
            <Checkbox binary id="reindex" v-model="reindex" />
            <label for="reindex"><i18n-t keypath="reindex"/></label>
        </div>

        <div v-if="isIndexing || logMessages.status || logMessages.details" class="mt-4">
            <h5><i18n-t keypath="filegroup.file.upload.uploading" /></h5>

            <!-- Status/Result section -->
            <div v-if="logMessages.status" class="mb-3">
                <h6 class="text-sm font-semibold mb-2"><i18n-t keypath="state" /> :</h6>
                <div class="bg-surface border rounded-lg p-3">
                    <div class="text-sm flex items-center gap-2">
                        <pre class="whitespace-pre-wrap m-0">{{ logMessages.status.replace(/\\n/g, '\n') }}</pre>
                    </div>
                </div>
            </div>

            <!-- Detailed progress section -->
            <div v-if="logMessages.details" class="mb-3">
                <h6 class="text-sm font-semibold mb-2"><i18n-t keypath="details"/></h6>
                <div class="bg-surface border rounded-lg p-3 max-h-40 overflow-y-auto">
                    <pre class="text-sm whitespace-pre-wrap">{{ logMessages.details.replace(/\\n/g, '\n') }}</pre>
                </div>
            </div>

            <!-- Loading indicator when indexing -->
            <div v-if="isIndexing && !logMessages.status && !logMessages.details"
                class="bg-surface border rounded-lg p-3">
                <div class="flex items-center gap-2">
                    <i class="pi pi-spin pi-spinner"></i>
                    <span class="text-sm"><i18n-t keypath="filegroup.file.upload.process"/></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { Checkbox, FileUpload, Button } from 'primevue';
import { useFilesStore } from '@/stores/file';
import { useToast } from 'primevue/usetoast';
import type { IndexInfo } from '@/models';
import { IndApi } from '@/apis/api';
import { useI18n } from 'vue-i18n';

const {t} = useI18n()
const props = defineProps<{
    agentId: string,
    index: IndexInfo
}>();

const fileUpload = ref<InstanceType<typeof FileUpload>>();
const selectedFiles = ref<File[]>([]);
let reindex = ref(false);
const logMessages = ref<{ status: string, details: string }>({ status: '', details: '' });
const isIndexing = ref(false);
const controller = new AbortController();
const fileStore = useFilesStore();
const toast = useToast();

const processedSuccessFiles = new Set<string>();
const processedFailedFiles = new Set<string>();

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
        const maxSizeBytes = props.index.config.max_file_size * 1024 * 1024;

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

    const url = `${import.meta.env.VITE_IP_BACKEND}/api/v1/index/index?agent_id=${props.agentId}&reindex=${reindex.value}`;

    isIndexing.value = true;
    logMessages.value = { status: '', details: '' };

    processedSuccessFiles.clear();
    processedFailedFiles.clear();

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
                console.log('Raw event data:', ev.data);

                let status = '';
                let details = '';

                try {
                    // The data comes as a string representation of a tuple (status, details)
                    // Example: "('✅ | file.pdf', 'Indexing [1/1]: file.pdf\n => Converting...')"
                    const tupleMatch = ev.data.match(/^\('([^']*)',\s*'([^']*)'\)$/);
                    if (tupleMatch) {
                        status = tupleMatch[1];
                        details = tupleMatch[2];
                    } else {
                        status = ev.data;
                        details = '';
                    }
                } catch (error) {
                    console.error('Error parsing event data:', error);
                    status = ev.data;
                    details = '';
                }

                logMessages.value.status = status;
                logMessages.value.details = details;

                const normalizedStatus = status.replace(/\\n/g, '\n');

                const successRegex = /✅\s*\|\s*([^\n\r]+)/g;
                const failRegex = /❌\s*\|\s*([^\n\r]+)/g;

                const newlySucceeded: string[] = [];
                const newlyFailed: string[] = [];

                let m: RegExpExecArray | null;
                while ((m = successRegex.exec(normalizedStatus)) !== null) {
                    const raw = m[1];
                    const fname = raw ? raw.trim() : '';
                    if (fname && !processedSuccessFiles.has(fname)) {
                        processedSuccessFiles.add(fname);
                        newlySucceeded.push(fname);
                    }
                }
                while ((m = failRegex.exec(normalizedStatus)) !== null) {
                    const raw = m[1];
                    const fname = raw ? raw.trim() : '';
                    if (fname && !processedFailedFiles.has(fname)) {
                        processedFailedFiles.add(fname);
                        newlyFailed.push(fname);
                    }
                }

                if (newlyFailed.length > 0) {
                    console.log('Upload failed for:', newlyFailed);
                    toast.add({
                        severity: 'error',
                        summary: 'Upload Failed',
                        detail: `Failed: ${newlyFailed.join(', ')}`,
                        life: 7000
                    });
                }

                if (newlySucceeded.length > 0) {
                    console.log('Upload successful for:', newlySucceeded);
                    toast.add({
                        severity: 'success',
                        summary: 'Upload Successful',
                        detail: newlySucceeded.length === 1 ? `${newlySucceeded[0]} uploaded` : `${newlySucceeded.length} files uploaded`,
                        life: 3000
                    });

                    IndApi.listFilesApiV1IndexIndexIdFilesGet({
                        indexId: props.index.id
                    }).then((res) => {
                        console.log(res);
                        fileStore.files = Object.values(res);
                    }).catch((err) => console.error('Error listing files:', err));

                    selectedFiles.value = selectedFiles.value.filter(f => !newlySucceeded.includes(f.name));
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
                throw err;
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
