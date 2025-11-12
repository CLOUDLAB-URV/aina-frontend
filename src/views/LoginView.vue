<template>
    <div class="flex items-center justify-center min-h-screen -mt-16 px-4">
        <div class="w-full max-w-md">
            <div class="text-center mb-8">
                <img :src="logo" alt="PyRun Logo" class="mx-auto h-16 w-auto mb-4" />
                <h2 class="text-3xl font-bold text-surface-900 dark:text-surface-0">
                    <i18n-t keypath="logging.loginto"/>
                </h2>
                <!-- <p class="mt-2 text-surface-600 dark:text-surface-300">
                    Don't have an account?
                    <RouterLink to="/signup" class="font-medium text-primary hover:underline">
                        Sign up here
                    </RouterLink>
                </p> -->
            </div>

            <div class="bg-surface-0 dark:bg-surface-900 p-8 shadow rounded-lg" v-if="showLoginForm">
                <div>
                    <label for="username" class="text-surface-900 dark:text-surface-0 font-medium mb-2 block">
                        <i18n-t keypath="logging.username"/>
                    </label>
                    <InputText v-model="username" id="username" type="text" class="w-full mb-4"
                        @keydown.enter="login" />

                    <label for="password"
                        class="text-surface-900 dark:text-surface-0 font-medium mb-2 block">
                        <i18n-t keypath="logging.password"/>
                    </label>
                    <InputText v-model="password" id="password" type="password" class="w-full mb-4"
                        @keydown.enter="login" />

                    <!-- <div class="flex items-center justify-end mb-5">
                        <Button label="Forgot password?" text :disabled="loading" @click="forgotPassword"></Button>
                    </div> -->

                    <Button :label="t('logging.login')" class="w-full" :disabled="!username || !password || loading"
                        @click="login" />
                </div>
            </div>

            <!-- <div class="bg-surface-0 dark:bg-surface-900 p-8 shadow-lg rounded-lg" v-if="showSendCodeForm">
                <div>
                    <label for="username_reset"
                        class="block text-surface-900 dark:text-surface-0 font-medium mb-2">Username or
                        email</label>
                    <InputText v-model="username" id="username_reset" type="text" class="w-full mb-7"
                        @keydown.enter="sendCode" />

                    <Button label="Send code" class="w-full mb-2" :disabled="!username || loading"
                        @click="sendCode"></Button>
                    <Button label="Back to log in" class="w-full" :disabled="loading" @click="backToLogIn"
                        severity="secondary"></Button>
                </div>
            </div>

            <div class="bg-surface-0 dark:bg-surface-900 p-8 shadow-lg rounded-lg" v-if="showResetPasswordForm">
                <div>
                    <label for="confirmation-code"
                        class="block text-surface-900 dark:text-surface-0 font-medium mb-2">Confirmation
                        code</label>
                    <InputMask v-model="resetPwdForm.confirmationCode" id="confirmation-code" class="w-full mb-3"
                        mask="999999" @keydown.enter="submitResetPassword" />

                    <label for="new-pwd" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">New
                        password</label>
                    <InputText v-model="resetPwdForm.password" id="new-pwd" type="password" class="w-full mb-3"
                        @keydown.enter="submitResetPassword" />

                    <label for="confirm-pwd" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">Confirm
                        password</label>
                    <InputText v-model="resetPwdForm.confirmPwd" id="confirm-pwd" type="password" class="w-full mb-5"
                        @keydown.enter="submitResetPassword" />

                    <Button label="Submit" class="w-full mb-2"
                        :disabled="!resetPwdForm.confirmationCode || !resetPwdForm.password || !resetPwdForm.confirmPwd || loading"
                        @click="submitResetPassword"></Button>
                    <Button label="Resend code" class="w-full" :disabled="loading" @click="sendCode"
                        severity="secondary"></Button>
                </div>
            </div> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
// import { signIn, resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import logo from '@/assets/vue.svg';
import { AuthenticationApi } from '@/apis';
import type { LoginForAccessTokenApiV1AuthTokenPostRequest } from '@/apis/AuthenticationApi.ts';
import { useI18n } from 'vue-i18n';

const { t }  = useI18n()
const router = useRouter();
const toast = useToast();

const loggingIn = ref(false);
const sendingCode = ref(false);
const resettingPwd = ref(false);
const username = ref("");
const password = ref("");
const showLoginForm = ref(true);
// const showSendCodeForm = ref(false);
// const showResetPasswordForm = ref(false);
// const resetPwdForm = reactive({
//     confirmationCode: '',
//     password: '',
//     confirmPwd: ''
// });

const loading = computed(() => {
    return loggingIn.value || sendingCode.value || resettingPwd.value;
});

async function login() {
    if (!username.value || !password.value || loggingIn.value) {
        return;
    }

    try {
        loggingIn.value = true;
        // await signIn({
        //     username: username.value,
        //     password: password.value
        // });
        let auth = new AuthenticationApi()
        let data: LoginForAccessTokenApiV1AuthTokenPostRequest = {
            username: username.value,
            password: password.value,
            grantType: 'password'
        }
        let accesToken = await auth.loginForAccessTokenApiV1AuthTokenPost(data)
        localStorage.setItem('accessToken', accesToken.accessToken)
        router.push('/');
    } catch (err: any) {
        loggingIn.value = false;
        toast.add({ severity: 'error', summary: 'Sign in failed', detail: err.message, life: 5000 });
    }
}

// async function sendCode() {
//     if (!username.value) {
//         return;
//     }

//     try {
//         sendingCode.value = true;
//         await resetPassword({ username: username.value });
//         showSendCodeForm.value = false;
//         showResetPasswordForm.value = true;
//     } catch (err: any) {
//         toast.add({ severity: 'error', summary: 'Error sending reset code', detail: err.message, life: 5000 });
//     }

//     sendingCode.value = false;
// }

// async function submitResetPassword() {
//     if (resetPwdForm.password !== resetPwdForm.confirmPwd) {
//         toast.add({ severity: 'error', summary: 'Passwords do not match', detail: 'Check passwords and try again', life: 5000 });
//         return;
//     }

//     try {
//         resettingPwd.value = true;
//         await confirmResetPassword({
//             confirmationCode: resetPwdForm.confirmationCode,
//             username: username.value,
//             newPassword: resetPwdForm.password
//         });
//         toast.add({ severity: 'success', summary: 'Password reset successfully', detail: 'Your password has been changed', life: 5000 });
//         backToLogIn();
//     } catch (err: any) {
//         toast.add({ severity: 'error', summary: 'Password reset failed', detail: err.message, life: 5000 });
//     }

//     resettingPwd.value = false;
// }

// function forgotPassword() {
//     resetPwdForm.confirmationCode = '';
//     resetPwdForm.password = '';
//     resetPwdForm.confirmPwd = '';
//     showLoginForm.value = false;
//     showResetPasswordForm.value = false;
//     showSendCodeForm.value = true;
// }

// function backToLogIn() {
//     password.value = '';
//     showSendCodeForm.value = false;
//     showResetPasswordForm.value = false;
//     showLoginForm.value = true;
// }

</script>