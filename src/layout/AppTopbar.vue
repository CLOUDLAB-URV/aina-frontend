<script setup lang="ts">
// import { signOut } from 'aws-amplify/auth';
import { useRouter } from 'vue-router';
import { useLayout } from '@/layout/composables/layout';
// import { useAuthStore } from '@/stores/auth';
import logo from '@/assets/vue.svg';

const { onMenuToggle } = useLayout();
const router = useRouter();
const authStore = {
    username:'iulian',
    signedIn:true
}

function logIn() {
    router.push('/login');
}

async function logOut() {
    // await signOut();
    router.push('/login');
}
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="onMenuToggle">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <img :src="logo" class="size-[2rem]" />
                <span>ORAG</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-topbar-menu">
                <div v-if="authStore.signedIn" class="flex items-center gap-2">
                    <Avatar :label="authStore.username.charAt(0).toUpperCase()" shape="circle" class="hidden lg:flex" />
                    <span class="mr-2 hidden lg:inline">Logged in as {{ authStore.username }}</span>
                    <Button @click="logOut" label="Log out" icon="pi pi-sign-out" text></Button>
                </div>
                <Button v-if="!authStore.signedIn" @click="logIn" label="Log in" icon="pi pi-sign-in" text></Button>
            </div>
        </div>
    </div>
</template>

<style scoped>

.layout-topbar {
    position: fixed;
    height: 5rem;
    z-index: 997;
    left: 0;
    top: 0;
    width: 100%;
    padding: 0 2rem;
    background-color: var(--surface-card);
    transition: left var(--layout-section-transition-duration);
    display: flex;
    align-items: center;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

    .layout-topbar-logo-container {
        width: 20rem;
        display: flex;
        align-items: center;
    }

    .layout-topbar-logo {
        display: inline-flex;
        align-items: center;
        font-size: 1.5rem;
        border-radius: var(--content-border-radius);
        color: var(--text-color);
        font-weight: 500;
        gap: 0.5rem;
        height: 3rem;

        svg {
            width: 3rem;
        }

        /* &:focus-visible {
            @include focused();
        } */
    }

    .layout-topbar-action {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        color: var(--text-color-secondary);
        border-radius: 50%;
        width: 3rem;
        height: 3rem;
        color: var(--text-color);
        transition: background-color var(--element-transition-duration);
        cursor: pointer;

        &:hover {
            background-color: var(--surface-hover);
        }

        /* &:focus-visible {
            @include focused();
        } */

        i {
            font-size: 1.25rem;
        }

        span {
            font-size: 1rem;
            display: none;
        }
    }

    .layout-menu-button {
        margin-right: 0.5rem;
    }

    .layout-topbar-menu-button {
        display: none;
    }

    .layout-topbar-actions {
        margin-left: auto;
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .layout-topbar-menu-content {
        display: flex;
        gap: 1rem;
    }

    .layout-config-menu {
        display: flex;
        gap: 1rem;
    }
}

</style>