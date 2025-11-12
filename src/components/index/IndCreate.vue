<template>
  <form class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <label for="id">{{t('input.name.label')}}</label>
      <InputText id="Id" :placeholder="t('input.name.placeholder')" v-model="model.name.value" :invalid="model.name.invalid"/>
    </div>

    <div class="flex flex-col gap-2">
      <label for="vendorName">{{ t('input.index.label') }}</label>
      <Select 
        v-model="model.indexType.value" 
        :options="vendors" 
        optionLabel="value" 
        :placeholder="t('input.index.placeholder')" 
        :invalid="model.indexType.invalid"
        optionValue="value"
      />
    </div>

    <div class="flex flex-col gap-2">
      <label for="spec">{{ t('input.spec.label') }}</label>
      <Textarea id="spec" v-model="model.config.value" :placeholder="t('input.spec.placeholder')" rows="10"/>
    </div>

    <ButtonsCrud :create="create" @createElement="sendCreate" @updateElement="update" @deleteElement="delete_element" />
  </form>
</template>

<script setup lang="ts">
import type { CreateIndexApiV1IndexPostRequest, DeleteIndexApiV1IndexIndexIdDeleteRequest,UpdateIndexApiV1IndexIndexIdPatchRequest } from "@/apis/IndexApi.ts";
import ButtonsCrud from "@/components/ButtonsCrud.vue";
import { useToast } from 'primevue/usetoast';
import { onMounted, ref, watch } from "vue";
import InputText from 'primevue/inputtext';
import { useIndStore } from "@/stores/ind";
import Textarea from 'primevue/textarea';
import { IndApi } from "@/apis/api.ts";
import Select from 'primevue/select';
import { useI18n } from 'vue-i18n';
import yaml from 'js-yaml';

const {t} = useI18n()
const toast = useToast()
let indStore = useIndStore();

const props = defineProps<{
  create: boolean;
  data?: {
    name: string
    id: number,
    config: any,
    indexType: string
  }
}>();

const emits = defineEmits(['deselect']);
let vendors = ref<any[]>([]);
let model = ref({
  id: -1,
  name: {
    value:"",
    invalid:false
  },
  config: {
    value:"",
    invalid:false
  },
  indexType: {
    value: "",
    invalid:false
  },
})

onMounted(async () => {
  let response = await IndApi.listIndexTypesApiV1IndexTypesGet();
  vendors.value = response.map((vendor:any)=>{
    return {'value': vendor}
  })
});

watch(() => props.data, () => {
  change_model();
},{immediate:true});

function change_model() {
  model.value.name.value = props.data?.name ?? "";
  model.value.name.invalid = false;
  model.value.id = props.data?.id ?? -1;
  model.value.config.value = props.data?.config ?? "";
  model.value.config.invalid = false;
  model.value.indexType.value = props.data?.indexType ?? "";
  model.value.indexType.invalid = false;
}

function validate(){
  let made=true
  if(!model.value.name.value || model.value.name.value == ' '){
    toast.add({severity:'error',detail:'You have to put a Name to the Index'})
    model.value.name.invalid = true
    made=false
  }
  if(!model.value.indexType.value || model.value.indexType.value == ' '){
    toast.add({severity:'error',detail:'You have to select an IndexType for validating the request'})
    model.value.indexType.invalid = true
    made=false
  }
  try{
    yaml.load(model.value.config.value)
  }catch(err){
    toast.add({severity:'error',detail:'There is a mistake in the Configuration Text Area'})
    model.value.config.invalid = true
    made=false
  }
  return made
}

function sendCreate() {
  if(!validate()){return}
  let createParam: CreateIndexApiV1IndexPostRequest = {
    name: model.value.name.value,
    indexType: model.value.indexType.value,
    requestBody: yaml.load(model.value.config.value) as Object,
  };
  IndApi.createIndexApiV1IndexPost(createParam).then((res) => {
    indStore.addInd({
      name: res.name,
      id:res.id,
      indexType:res.indexType,
      config : yaml.dump(res.config)
    });
    toast.add({severity:'success',detail:"The Index has been created succesfully",life:3000})
    change_model()
  }).catch(()=>{
    toast.add({severity:'error',detail:'The name put in the field input name it has been already used'})
    model.value.name.invalid = true
  });
}

function delete_element() {
  let index: DeleteIndexApiV1IndexIndexIdDeleteRequest = {
    indexId: model.value.id,
  };
  IndApi.deleteIndexApiV1IndexIndexIdDelete(index).then(() => {
    indStore.removeInd(model.value.id);
    emits('deselect');
    toast.add({severity:'success',detail:'The Index has been deleted'})
  });
}

function update() {
  if(!validate()){return}
  let index: UpdateIndexApiV1IndexIndexIdPatchRequest = {
    indexId: model.value.id,
    name: model.value.name.value,
    requestBody: yaml.load(model.value.config.value) as Object,
  };
  IndApi.updateIndexApiV1IndexIndexIdPatch(index).then(() => {
    indStore.updateInd({
      name : model.value.name.value,
      id : props.data?.id ?? -1,
      config : model.value.config.value,
      indexType : model.value.indexType.value
    });
  }).catch(()=>{
    toast.add({severity:'error',detail:'The name put in the field input name it has been already used'})
  });
}

</script>

<style scoped>
textarea {
  padding: 1rem;
  background-color: var(--p-inputtext-backgroundcolor);
  border-radius: var(--p-inputtext-border-radius);
  border-color: var(--p-inputtext-border-color);
  -webkit-scrollbar: none;
}

select {
  background-color: var(--p-inputtext-background);
  border-radius: var(--p-button-border-radius);
}
</style>
