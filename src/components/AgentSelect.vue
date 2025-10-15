<template>
    <div class="flex flex-col justify-between p-2">
        <h2 class="mb-4 text-lg">Agent Select</h2>
        <select name="agent" id="agent">
            <option value="agent1">Agent 1</option>
            <option value="agent2">Agent 2</option>
            <option value="agent3">Agent 3</option>
        </select>
        <div class="flex justify-between mt-4">
            <Button icon="pi pi-trash" severity="danger"></Button>
            <Button icon="pi pi-pencil" severity="info"></Button>
            <Button icon="pi pi-file-plus" severity="success"></Button>
        </div>
    </div>
</template>
<script lang="ts" setup>
</script>