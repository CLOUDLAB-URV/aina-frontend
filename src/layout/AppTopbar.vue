<script setup lang="ts">
// import { signOut } from 'aws-amplify/auth';
import { useRouter } from 'vue-router';
import {ref} from 'vue';
import { useLayout } from '@/layout/composables/layout';
import logo from '@/assets/vue.svg';
import { useAuthStore } from '@/stores/auth';

const { onMenuToggle } = useLayout();
const router = useRouter();
const authStore = useAuthStore()
let dark = ref(false);

function logIn() {
    router.push('/login');
}

async function logOut() {
    authStore.username = "";
    authStore.signedIn = false;
    localStorage.removeItem('accessToken');
    // await signOut();
    router.push('/login');
}


function toggleDarkMode() {
    document.documentElement.classList.toggle('app-dark');
    dark.value = !dark.value;
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
            <!-- <Button label="Toggle Dark Mode" @click="toggleDarkMode()" /> -->
            <button @click="toggleDarkMode()">
                <i class="pi pi-moon" v-if="!dark"></i>
                <i class="pi pi-sun" v-if="dark"></i>
            </button>
        </div>
    </div>
</template>