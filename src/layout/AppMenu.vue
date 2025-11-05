<script setup lang="ts">
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Intelligent Apps',
        items: [
            { label: 'Chat', icon: 'pi pi-comments', to: '/' },
            { label: 'Agent', icon: 'pi pi-microchip-ai', to: '/agent' },
            { label: 'Files', icon: 'pi pi-folder-open', to: '/files' },
        ]
    },
    {
        label: 'Settings',
        items: [
            { label: 'General', icon: 'pi pi-fw pi-cog', to: '/general' },
        ]
    },
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item.label || i">
            <app-menu-item 
                v-if="!(item as any).separator" 
                :item="item" 
                :index="i"
                :class="{ 'layout-menu-footer': (item as any).isFooter }"
            ></app-menu-item>
            <li v-if="(item as any).separator && !(model[i+1] && (model[i+1] as any).isFooter)" class="menu-separator"></li>
        </template>
    </ul>
</template>