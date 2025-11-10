<template>
    <div class="w-full rounded-lg p-4 space-y-6">
        <div v-if="loading" class="text-sm opacity-70">Loading settings...</div>
        <div v-else-if="error" class="text-red-500">{{ error }}</div>
        <div v-else>
            <section v-if="indexSettings">
                <h2 class="font-semibold text-lg mb-3">Index Settings</h2>
                <div class="grid gap-4 sm:grid-cols-2">
                    <div v-for="(setting, key) in indexSettings" :key="`index-${key}`">
                        <label class="font-medium mb-1 block">{{ setting.name }}</label>
                        <template v-if="setting.component === 'radio'">
                            <div class="flex flex-wrap gap-4">
                                <div v-for="(choice, idx) in setting.choices" :key="`${key}-radio-${idx}`"
                                    class="flex items-center gap-2">
                                    <RadioButton :inputId="`${key}-radio-${idx}`" :name="key"
                                        :value="choice[1] || choice" v-model="formValues[`index.${key}`]" />
                                    <label :for="`${key}-radio-${idx}`">{{ choice[0] || choice }}</label>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <component :is="resolveComponent(setting)" :label="setting.name"
                                v-model="formValues[`index.${key}`]" v-bind="getComponentProps(setting)" />
                        </template>
                    </div>
                </div>
            </section>

            <section v-if="reasonSettings" class="mt-6">
                <h2 class="font-semibold text-lg mb-3">Reasoning Settings</h2>
                <div class="grid gap-4 sm:grid-cols-2">
                    <div v-for="(setting, key) in reasonSettings" :key="`reason-${key}`">
                        <label class="font-medium mb-1 block">{{ setting.name }}</label>
                        <template v-if="setting.component === 'radio'">
                            <div class="flex flex-wrap gap-4">
                                <div v-for="(choice, idx) in setting.choices" :key="`${key}-radio-${idx}`"
                                    class="flex items-center gap-2">
                                    <RadioButton :inputId="`${key}-radio-${idx}`" :name="key"
                                        :value="choice[1] || choice"
                                        v-model="formValues[`reasoning.${currentReasoning}.${key}`]" />
                                    <label :for="`${key}-radio-${idx}`">{{ choice[0] || choice }}</label>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <component :is="resolveComponent(setting)" :label="setting.name"
                                v-model="formValues[`reasoning.${currentReasoning}.${key}`]"
                                v-bind="getComponentProps(setting)" />
                        </template>
                    </div>
                </div>
            </section>

            <div v-if="indexSettings || reasonSettings" class="flex justify-end mt-6">
                <button class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700" @click="saveSettings"
                    :disabled="saving">
                    {{ saving ? 'Saving...' : 'Save Settings' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { AgentResponse } from '@/models';
import { AgApi, IndApi, ReasonApi } from '@/apis/api';
import { Checkbox, InputNumber, InputText, RadioButton, Select, Textarea } from 'primevue';


const props = defineProps<{ agent?: AgentResponse }>();

const loading = ref(false);
const saving = ref(false);
const error = ref<string>();
const currentReasoning = ref<string>();
const indexSettings = ref<Record<string, Record<string, any>>>();
const reasonSettings = ref<Record<string, Record<string, any>>>();
const formValues = ref<Record<string, any>>({});

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

        // 2. Extract reasoning and index info
        const reasoningName: string = currentValues['reasoning.use'];
        const indexId = agent.indexId;

        currentReasoning.value = reasoningName;

        // 3. Fetch schemas
        const [reasonConfig, indexConfig] = await Promise.all([
            ReasonApi.getReasoningConfigApiV1ReasoningsReasoningNameConfigGet({
                reasoningName: reasoningName,
            }),
            IndApi.getIndexSettingsApiV1IndexIndexIdSettingsGet({
                indexId: indexId,
            }),
        ]);

        reasonSettings.value = reasonConfig;
        indexSettings.value = indexConfig;

        // 4. Merge values
        const merged: Record<string, any> = {};

        // index
        for (const key in indexConfig) {
            const fullKey = `index.options.${indexId}.${key}`;
            merged[`index.${key}`] = currentValues[fullKey] ?? indexConfig[key].value;
        }

        // reasoning
        for (const key in reasonConfig) {
            const fullKey = `reasoning.options.${reasoningName}.${key}`;
            merged[`reasoning.${reasoningName}.${key}`] =
                currentValues[fullKey] ?? reasonConfig[key].value;
        }

        formValues.value = merged;
    } catch (err: any) {
        console.error(err);
        error.value = err?.message || 'Failed to load settings';
    } finally {
        loading.value = false;
    }
}

watch(
    () => props.agent,
    (newAgent) => {
        if (newAgent) loadSettings(newAgent);
    },
    { immediate: true }
);

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
        await AgApi.updateAgentSettingsApiV1AgentsSettingsAgentIdPatch({ agentId: props.agent?.id, requestBody: formValues.value });
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
</style>