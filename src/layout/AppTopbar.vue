<script setup lang="ts">
// import { signOut } from 'aws-amplify/auth';
import { useRouter } from 'vue-router';
import {ref} from 'vue';
import { useLayout } from '@/layout/composables/layout';
import logo from '@/assets/vue.svg';
import { useAuthStore } from '@/stores/auth';
import { useI18n } from 'vue-i18n';
const { t, locale ,availableLocales} = useI18n({useScope:'global'})
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
                    <Avatar :label="authStore.username?.charAt(0).toUpperCase()" shape="circle" class="hidden lg:flex" />
                    <span class="mr-2 hidden lg:inline">
                        {{ t('logging.loggedas',{username: authStore.username}) }}
                    </span>
                    <Button @click="logOut" :label="t('logging.logout')" icon="pi pi-sign-out" text></Button>
                </div>
                <Button v-if="!authStore.signedIn" @click="logIn" :label="t('logging.login')" icon="pi pi-sign-in" text></Button>
            </div>
            <!-- <Button label="Toggle Dark Mode" @click="toggleDarkMode()" /> -->
            <button @click="toggleDarkMode()" class="mr-2">
                <i class="pi pi-moon" v-if="!dark"></i>
                <i class="pi pi-sun" v-if="dark"></i>
            </button>

            <select v-model="locale">
                <option v-for="locale in availableLocales" :value="locale" :key="`locale-${locale}`">{{ locale }}</option>
            </select>
        </div>
    </div>
</template>