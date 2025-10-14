<template>
    <div class="card">
        <Toast />
        <FileUpload
            name="demo[]"
            url="/api/upload"
            @upload="onTemplatedUpload"
            :multiple="true"
            accept="image/*"
            :maxFileSize="1000000"
            @select="onSelectedFiles"
        >
            <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
                <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
                    <div class="flex gap-2">
                        <Button @click="chooseCallback" icon="pi pi-images" rounded variant="outlined" severity="secondary"></Button>
                        <Button @click="uploadEvent(uploadCallback)" icon="pi pi-cloud-upload" rounded variant="outlined" severity="success" :disabled="!files || files.length === 0"></Button>
                        <Button @click="clearCallback" icon="pi pi-times" rounded variant="outlined" severity="danger" :disabled="!files || files.length === 0"></Button>
                    </div>
                    <ProgressBar :value="totalSizePercent" :showValue="false" class="md:w-20rem h-1 w-full md:ml-auto">
                        <span class="whitespace-nowrap">{{ totalSize }}B / 1Mb</span>
                    </ProgressBar>
                </div>
            </template>
            <template #content="{ files: pendingFiles, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
                <div class="flex flex-col gap-8 pt-4">
                    <div v-if="pendingFiles.length > 0">
                        <h5>Pending</h5>
                        <div class="flex flex-wrap gap-4">
                            <div v-for="(file, index) of pendingFiles" :key="file.name + file.type + file.size" class="p-8 rounded-border flex flex-col border border-surface items-center gap-4">
                                <div>
                                    <img role="presentation" :alt="file.name" :src="(file as CustomFile).objectURL" width="100" height="50" />
                                </div>
                                <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
                                <div>{{ formatSize(file.size) }}</div>
                                <Badge value="Pending" severity="warn" />
                                <Button icon="pi pi-times" @click="onRemoveTemplatingFile(file as CustomFile, removeFileCallback, index)" variant="outlined" rounded severity="danger" />
                            </div>
                        </div>
                    </div>

                    <div v-if="uploadedFiles.length > 0">
                        <h5>Completed</h5>
                        <div class="flex flex-wrap gap-4">
                            <div v-for="(file, index) of uploadedFiles" :key="file.name + file.type + file.size" class="p-8 rounded-border flex flex-col border border-surface items-center gap-4">
                                <div>
                                    <img role="presentation" :alt="file.name" :src="(file as CustomFile).objectURL" width="100" height="50" />
                                </div>
                                <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
                                <div>{{ formatSize(file.size) }}</div>
                                <Badge value="Completed" class="mt-4" severity="success" />
                                <Button icon="pi pi-times" @click="removeUploadedFileCallback(index)" variant="outlined" rounded severity="danger" />
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template #empty>
                <div class="flex items-center justify-center flex-col">
                    <i class="pi pi-cloud-upload !border-2 !rounded-full !p-8 !text-4xl !text-muted-color" />
                    <p class="mt-6 mb-0">Drag and drop files to here to upload.</p>
                </div>
            </template>
        </FileUpload>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePrimeVue } from 'primevue/config';
import { useToast } from "primevue/usetoast";
import type { FileUploadSelectEvent, FileUploadUploadEvent } from 'primevue/fileupload';

// Define an interface to extend the standard File object with PrimeVue's objectURL
interface CustomFile extends File {
    objectURL: string;
}

// PrimeVue Composables
const $primevue = usePrimeVue();
const toast = useToast();

// Reactive State
const totalSize = ref(0);
const totalSizePercent = ref(0);
const pendingFiles = ref<CustomFile[]>([]); // Using CustomFile type

// --- Template Callbacks ---

// FIX: Added explicit types for parameters
const onRemoveTemplatingFile = (file: CustomFile, removeFileCallback: (index: number) => void, index: number) => {
    removeFileCallback(index);
    // Correctly deduct the size of the removed file from totalSize
    totalSize.value -= file.size;
    totalSizePercent.value = (totalSize.value / 1000000) * 100;
};

// FIX: Added explicit types for parameters (though unused, kept for completeness)
// const onClearTemplatingUpload = (clear: () => void) => {
//     clear();
//     totalSize.value = 0;
//     totalSizePercent.value = 0;
// };

// FIX: Added explicit type for the event
const onSelectedFiles = (event: FileUploadSelectEvent) => {
    // PrimeVue's select event returns an array of augmented File objects.
    pendingFiles.value = event.files as CustomFile[];

    totalSize.value = pendingFiles.value.reduce((sum, file) => sum + file.size, 0);

    // Calculate percentage based on maxFileSize (1,000,000 bytes = 1MB)
    totalSizePercent.value = (totalSize.value / 1000000) * 100;
};

// FIX: Added explicit type for the callback
const uploadEvent = (callback: () => void) => {
    // Re-calculating percentage here might be redundant but matches original logic
    totalSizePercent.value = (totalSize.value / 1000000) * 100;
    callback();
};

// FIX: Added explicit type for the event
const onTemplatedUpload = (event: FileUploadUploadEvent) => {
    toast.add({ severity: "info", summary: "Success", detail: "File Uploaded", life: 3000 });
    
    // Logic for successful upload: reset counters and clear pending files
    totalSize.value = 0;
    totalSizePercent.value = 0;
    pendingFiles.value = [];
};

// --- Utility Function ---

// FIX: Added explicit type for parameter and safely accessing locale properties
const formatSize = (bytes: number): string => {
    const k = 1024;
    const dm = 3;
    // Safely access locale properties using optional chaining and nullish coalescing
    const sizes = $primevue.config.locale?.fileSizeTypes ?? ['B', 'KB', 'MB', 'GB', 'TB'];

    if (bytes === 0) {
        return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    // Ensure we don't access an out-of-bounds index, though unlikely for standard file sizes
    const sizeUnit = sizes[i] ?? 'B';

    return `${formattedSize} ${sizeUnit}`;
};
</script>