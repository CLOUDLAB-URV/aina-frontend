<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { Role } from '@/models';

import AppMenuItem from './AppMenuItem.vue';

// Raw menu model with optional role/auth requirements
const model = ref([
    {
        label: 'Intelligent Apps',
        items: [
            { label: 'Chat', icon: 'pi pi-comments', to: '/', authRequired: true },
            { label: 'Agent', icon: 'pi pi-microchip-ai', to: '/agent', authRequired: true, roles: [Role.AgentCreator, Role.Admin] },
            { label: 'Files', icon: 'pi pi-folder-open', to: '/files', authRequired: true, roles: [Role.AgentCreator, Role.Admin] },
        ]
    },
    {
        label: 'Settings',
        items: [
            { label: 'General', icon: 'pi pi-fw pi-cog', to: '/general', authRequired: true, roles: [Role.Admin] },
        ]
    },
]);

const auth = useAuthStore();

function itemVisible(item: any) {
    if (item.authRequired && !auth.signedIn) {
        return false;
    }

    if (item.roles && Array.isArray(item.roles)) {
        return auth.role && item.roles.includes(auth.role);
    }

    return true;
}

const filteredModel = computed(() => {
    return model.value
        .map((section: any) => ({
            ...section,
            items: section.items.filter((it: any) => itemVisible(it)),
        }))
        .filter((s: any) => s.items && s.items.length > 0);
});
</script>

<template>
    <ul class="layout-menu">
        <template v-if="filteredModel.length">
            <template v-for="(item, i) in filteredModel" :key="item.label || i">
                <app-menu-item v-if="!(item as any).separator" :item="item" :index="i"
                    :class="{ 'layout-menu-footer': (item as any).isFooter }"></app-menu-item>
                <li v-if="(item as any).separator && !(filteredModel[i + 1] && (filteredModel[i + 1] as any).isFooter)"
                    class="menu-separator"></li>
            </template>
        </template>
        <template v-else>
            <li class="menu-placeholder">
                <router-link to="/login" class="menu-link">Please log in to see more options</router-link>
            </li>
        </template>
    </ul>
</template>

<style scoped>
/* Minimal styles for the empty-menu placeholder */
.menu-placeholder {
    padding: 1rem;
    text-align: center;
    color: var(--text-secondary, #6b7280);
    font-style: italic;
}

.menu-link {
    color: inherit;
    text-decoration: none;
    display: inline-block;
    padding: 0.35rem 0.6rem;
    border-radius: 4px;
    transition: background-color 0.15s ease;
}

.menu-link:hover {
    background-color: rgba(0, 0, 0, 0.03);
}
</style>