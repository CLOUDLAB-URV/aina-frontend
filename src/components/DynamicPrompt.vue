<template>
    <div class="w-full rounded-lg p-4 space-y-6">
        <div v-if="loading" class="text-sm opacity-70"><i18n-t keypath="settings.loading" /></div>
        <div v-else-if="error" class="text-red-500">{{ error }}</div>
        <div v-else>
            <section class="mb-6">
                <h2 class="font-semibold text-lg mb-3"><i18n-t keypath="settings.label" /></h2>
                <div class="grid gap-4 sm:grid-cols-2">
                    <div v-for="(setting, key) in reasonAppSettings" :key="`general-${key}`">
                        <label class="font-medium block" :class="setting.component == 'checkbox' ? 'mb-0' : 'mb-2'">
                            {{ setting.name }}
                        </label>
                        <template v-if="setting.component === 'radio'">
                            <div class="flex flex-wrap gap-4">
                                <div v-for="(choice, idx) in setting.choices" :key="`${key}-radio-${idx}`"
                                    class="flex items-center gap-2">
                                    <RadioButton :inputId="`${key}-radio-${idx}`" :name="key"
                                        :value="choice[1] || choice" v-model="formValues[`reasoning.${key}`]" />
                                    <label :for="`${key}-radio-${idx}`">{{ choice[0] || choice }}</label>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <component :is="resolveComponent(setting)" :label="setting.name"
                                v-model="formValues[`reasoning.${key}`]" v-bind="getComponentProps(setting)"
                                class="w-full" />
                        </template>
                    </div>
                </div>
            </section>

            <section v-if="reasonSettings">
                <h2 class="font-semibold text-lg mb-3"><i18n-t keypath="reasoning.settings" /></h2>
                <div class="mb-4">
                    <label class="font-medium mb-2 block"><i18n-t keypath="reasoning.type" /></label>
                    <Select v-model="currentReasoning" :options="reasoningOptions" class="w-full" />
                </div>
                <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div v-for="(setting, key) in reasonSettings" :key="`reason-${key}`"
                        :class="{ 'flex gap-2 items-center': setting.component == 'checkbox' }">
                        <label class="font-medium block" :class="setting.component == 'checkbox' ? 'mb-0' : 'mb-2'">
                            {{ setting.name }}
                        </label>
                        <template v-if="setting.component === 'radio'">
                            <div class="flex flex-wrap gap-4">
                                <div v-for="(choice, idx) in setting.choices" :key="`${key}-radio-${idx}`"
                                    class="flex items-center gap-2">
                                    <RadioButton :inputId="`${key}-radio-${idx}`" :name="key"
                                        :value="choice[1] || choice"
                                        v-model="formValues[`reasoning.options.${currentReasoning}.${key}`]" />
                                    <label :for="`${key}-radio-${idx}`">{{ choice[0] || choice }}</label>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <component :is="resolveComponent(setting)" :label="setting.name"
                                v-model="formValues[`reasoning.options.${currentReasoning}.${key}`]"
                                v-bind="getComponentProps(setting)" class="w-full" />
                        </template>
                    </div>
                </div>
            </section>

            <section v-if="indexSettings" class="mt-6">
                <h2 class="font-semibold text-lg mb-3"><i18n-t keypath="settings.norm" /> <i18n-t keypath="index" />
                </h2>
                <div class="mb-4">
                    <label class="font-medium mb-1 block"><i18n-t keypath="index" /> ID</label>
                    <Select class="w-full" label="Index ID" v-model="currentIndex" :options="indices" optionLabel="name"
                        optionValue="id" />
                </div>
                <div class="grid gap-4 sm:grid-cols-1 lg:grid-cols-4">
                    <div v-for="(setting, key) in indexSettings" :key="`index-${key}`"
                        :class="{ 'flex gap-2 items-center': setting.component == 'checkbox' }">
                        <label class="font-medium block">{{ setting.name }}</label>
                        <template v-if="setting.component === 'radio'">
                            <div class="flex flex-wrap gap-4">
                                <div v-for="(choice, idx) in setting.choices" :key="`${key}-radio-${idx}`"
                                    class="flex items-center gap-2 w-full ">
                                    <RadioButton :inputId="`${key}-radio-${idx}`" :name="key"
                                        :value="choice[1] || choice"
                                        v-model="formValues[`index.options.${currentIndex}.${key}`]" />
                                    <label class="text-center" :for="`${key}-radio-${idx}`">{{ choice[0] || choice
                                        }}</label>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <component :is="resolveComponent(setting)" :label="setting.name"
                                v-model="formValues[`index.options.${currentIndex}.${key}`]"
                                v-bind="getComponentProps(setting)" class="w-full" />
                        </template>
                    </div>
                </div>
            </section>

            <div v-if="indexSettings || reasonSettings" class="flex justify-end mt-6">
                <button class="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    @click="saveSettings" :disabled="saving">
                    {{ saving ? 'Saving...' : 'Save Settings' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { type IndexInfo, type AgentResponse } from '@/models';
import { AgApi, IndApi, ReasonApi } from '@/apis/api';
import { Checkbox, InputNumber, InputText, RadioButton, Select, Textarea } from 'primevue';


const props = defineProps<{ agent?: AgentResponse }>();

const loading = ref(false);
const saving = ref(false);
const error = ref<string>();
const currentReasoning = ref<string>();
const currentIndex = ref<string>();

const indices = ref<IndexInfo[]>([]);

const reasonAppSettings = ref<Record<string, any>>();
const reasonSettings = ref<Record<string, any>>();
const indexSettings = ref<Record<string, any>>();

const formValues = ref<Record<string, any>>({});
const reasoningOptions = ref<string[]>([]);

async function loadSettings(agent: AgentResponse) {
    if (!agent) return;

    loading.value = true;
    error.value = undefined;

    try {
        const currentValues = await AgApi.getCurrentAgentSettingsApiV1AgentsSettingsAgentIdCurrentGet({
            agentId: agent.id,
        });

        if (!currentValues['reasoning.use']) {
            throw new Error('Agent reasoning type not set');
        }

        if (!agent.indexId) {
            throw new Error('Agent index not set');
        }

        const reasoningName: string = currentValues['reasoning.use'];
        const indexId = agent.indexId;

        currentReasoning.value = reasoningName;
        currentIndex.value = indexId;

        const [reasonAppConfig, reasonConfig, indexConfig, indicesList] = await Promise.all([
            ReasonApi.getReasoningAppSettingsApiV1ReasoningsSettingsGet(),
            ReasonApi.getReasoningConfigApiV1ReasoningsReasoningNameConfigGet({
                reasoningName: reasoningName,
            }),
            IndApi.getIndexSettingsApiV1IndexIndexIdSettingsGet({
                indexId: indexId,
            }),
            IndApi.listIndicesApiV1IndexGet(),
        ]);

        indices.value = indicesList;

        // delete 'use' key
        delete reasonAppConfig['use'];

        reasonAppSettings.value = reasonAppConfig;
        reasonSettings.value = reasonConfig;
        indexSettings.value = indexConfig;

        const merged: Record<string, any> = {};

        for (const key in reasonAppConfig) {
            const fullKey = `reasoning.${key}`;
            merged[fullKey] =
                currentValues[fullKey] ?? reasonAppConfig[key].value;
        }

        for (const key in reasonConfig) {
            const fullKey = `reasoning.options.${reasoningName}.${key}`;
            merged[fullKey] =
                currentValues[fullKey] ?? reasonConfig[key].value;
        }

        for (const key in indexConfig) {
            const fullKey = `index.options.${indexId}.${key}`;
            merged[fullKey] = currentValues[fullKey] ?? indexConfig[key].value;
        }

        formValues.value = merged;
    } catch (err: any) {
        console.error(err);
        error.value = err?.message || 'Failed to load settings';
    } finally {
        loading.value = false;
    }
}

onMounted(async () => {
    let reasonings = await ReasonApi.listReasoningsApiV1ReasoningsGet();
    reasoningOptions.value = reasonings.map(r => r || '');
});

watch(
    () => props.agent,
    (newAgent) => {
        if (newAgent) loadSettings(newAgent);
    },
    { immediate: true }
);

watch(currentReasoning, async (newReasoning) => {
    if (props.agent && newReasoning) {
        await AgApi.updateAgentSettingsApiV1AgentsSettingsAgentIdPatch({
            agentId: props.agent.id,
            body: {
                'reasoning.use': newReasoning
            }
        });
        loadSettings(props.agent);
    }
});

function resolveComponent(setting: Record<string, any>) {
    switch (setting.component) {
        case 'dropdown':
            return Select;
        case 'checkbox':
            return Checkbox;
        case 'radio':
            return RadioButton;
        case 'number':
            return InputNumber;
        default:
            if (setting.kwargs && setting.kwargs.lines && setting.kwargs.lines > 1) {
                return Textarea;
            }
            return InputText;
    }
}

function getComponentProps(setting: Record<string, any>) {
    let res: Record<string, any> = {};
    if (Array.isArray(setting.choices?.[0])) {
        res.options = setting.choices;
        res.optionLabel = (s: string[]) => s[0];
        res.optionValue = (s: string[]) => s[1];
    } else if (Array.isArray(setting.choices)) {
        res.options = setting.choices;
    }
    if (setting.component !== 'dropdown'
        && setting.component !== 'checkbox'
        && setting.component !== 'radio'
        && setting.component !== 'number'
        && setting.kwargs && setting.kwargs.lines && setting.kwargs.lines > 1) {
        res.rows = setting.kwargs.lines;
    }
    res.cols = setting.kwargs?.cols || 50;
    return res;
}

async function saveSettings() {
    if (!props.agent) return;
    saving.value = true;
    try {
        await AgApi.updateAgentSettingsApiV1AgentsSettingsAgentIdPatch({ agentId: props.agent?.id, body: formValues.value });
        if (currentIndex.value && currentIndex.value !== props.agent.indexId) {
            await AgApi.updateAgentApiV1AgentsAgentIdPatch({
                agentId: props.agent.id,
                agentUpdate: {
                    indexId: currentIndex.value
                }
            });
        }
    } catch (err: any) {
        console.error(err);
        error.value = err?.message || 'Failed to save settings';
    } finally {
        saving.value = false;
    }
}
</script>

<style scoped>
div {
    background-color: var(--surface-overlay);
}

@media (max-width: 991px) {
    textarea {
        width: 100%;
    }
}
</style>