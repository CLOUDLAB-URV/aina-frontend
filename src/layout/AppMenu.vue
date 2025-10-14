<script setup lang="ts">
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [
            { label: 'Home', icon: 'pi pi-fw pi-home', to: '/' }
        ]
    },
    {
        label: 'Public resources',
        items: [
            { label: 'Pipelines', icon: 'pi pi-fw pi-box', to: '/pipelines' },
            { label: 'AI Tools', icon: 'pi pi-microchip-ai', to: '/aitools' },
            { label: 'DataCockpit', icon: 'pi pi-fw pi-database', to: '/datacockpit' }
        ]
    },
    {
        label: 'My resources',
        items: [
            { label: 'Workspaces', icon: 'pi pi-fw pi-server', to: '/spaces' },
            { label: 'Monitoring', icon: 'pi pi-fw pi-chart-line', to: '/monitoring' }
        ]
    },
    {
        label: 'Settings',
        items: [
            { label: 'Cloud account', icon: 'pi pi-fw pi-cloud', to: '/cloudaccount' },
            { label: 'My account', icon: 'pi pi-fw pi-user', to: '/account' }
        ]
    },
    {
        label: 'Community & Support',
        isFooter: true,
        items: [
            { label: 'Documentation', icon: 'pi pi-fw pi-book', url: 'https://docs.pyrun.cloud/', target: '_blank' },
            { label: 'Discord', icon: 'pi pi-fw pi-discord', url: 'https://discord.gg/AF9XBqbxRS', target: '_blank' }
        ]
    }
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