<template>
  <form class="flex flex-col gap-4">

    <div class="flex flex-col gap-2">
      <label for="name">Name</label>
      <InputText id="name" placeholder="Name" v-model="model.name.value" :invalid="model.name.invalid" />
    </div>

    <div class="flex gap-2">
      <label for="default">Default</label>
      <Checkbox id="default" binary v-model="model._default" />
    </div>

    <div class="flex flex-col gap-2">
      <label for="spec">Specifications</label>
      <Textarea id="spec" v-model="model.spec.value" placeholder="Specifications" rows="5" :invalid="model.spec.invalid"/>
    </div>

    <div class="flex flex-col gap-2">
      <label for="vendorName">VendorName</label>
      <Select 
        v-model="model.vendorName.value" 
        :options="vendors" 
        optionLabel="value" 
        placeholder="Select Vendor" 
        optionValue="value"
        :invalid="model.vendorName.invalid"
      />
    </div>

    <ButtonsCrud :create="create" @createElement="sendCreate" @updateElement="update" @deleteElement="delete_element" />
  </form>

  <section class="mt-8" v-if="vendor_info">
    <h3 class="text-xl mb-4 text-[var(--text-color)]">Spec Params definitions</h3>
    <DataTable :value="vendor_info" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"
      tableStyle="min-width: 50rem">
      <Column field="name" header="Name" style="width: 10%"/>
      <Column field="help" header="Help" style="width: 65%"/>
      <Column field="type" header="Type" style="width: 10%"/>
    </DataTable>
  </section>
  
</template>

<script setup lang="ts">
import { mountVendors, createElement, updateElement, deleteElement, getInformation } from '@/apis/combinedCrud';
import ButtonsCrud from "@/components/ButtonsCrud.vue";
import { useToast } from 'primevue/usetoast';
import { onMounted, ref, watch } from "vue";
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';
import yaml from 'js-yaml';

const emits = defineEmits(['deselect']);
const toast = useToast()
const props = defineProps({
  create: { type: Boolean, required: true },
  data: Object,
  type: { type: String, required: true }
});

let vendor_info = ref();


let vendors = ref<any[]>([]);
let model = ref({
  name: {
    value:"",
    invalid:false,
  },
  _default: false,
  spec:  {
    value:"",
    invalid:false
  },
  vendorName: {
    value : "",
    invalid:false
  },
})

onMounted(async () => {
  let aux = await mountVendors(props.type);
  vendors.value = aux.map((info:string)=>{
    return { 'value' : info }
  })
  getInfo(props.data?.vendorName)
  change_model();
});

watch(() => props.data, async () => {
  let aux = await mountVendors(props.type);
  vendors.value = aux.map((info:string)=>{
    return { 'value' : info }
  })
  change_model();
  getInfo(model.value.vendorName.value)
});

watch(
  ()=> model.value.vendorName.value,
  ()=> {
    getInfo(model.value.vendorName.value)
  }
)

function change_model() {
  model.value.name.value = props.data?.name ?? "";
  model.value._default = props.data?._default ?? false;
  model.value.spec.value = props.data?.spec ?? "";
  model.value.vendorName.value = props.data?.vendorName ?? "";
  return model;
}

function validate(){
  let made=true
  if(!model.value.name.value || model.value.name.value == ' ' || (props.data?.name != model.value.name.value && !props.create) ){
    toast.add({severity:'error',detail:'There is something wrong in Name'})
    model.value.name.invalid = true
    made=false
  }
  if(!model.value.vendorName.value || model.value.vendorName.value == ' '){
    toast.add({severity:'error',detail:'You have to select an VendorName for validating the request'})
    model.value.vendorName.invalid = true
    made=false
  }
  try{
    if(model.value.spec.value == '') throw new Error
    yaml.load(model.value.spec.value)
  }catch(err){
    toast.add({severity:'error',detail:'There is a mistake in the Specification Text Area'})
    model.value.spec.invalid = true
    made=false
  }
  return made
}

async function sendCreate() {
  if(!validate()) return
  let response = await createElement(props.type, model.value)
  if(response.worked){
    toast.add({severity:'success',detail:`${response.message}`})
    change_model()
  }else{
    toast.add({severity:'error',detail:`${response.message}`})
  }
}

async function delete_element() {
  let response = await deleteElement(props.type, model.value);
  if (response.worked) {
    toast.add({severity:'success',detail:`${response.message}`})
    emits('deselect')
  }else{
    toast.add({severity:'error',detail:`${response.message}`})
  }
}

async function update() {
  if(!validate()) return
  let response = await updateElement(props.type, model.value);
  console.log(response)
  if(response.worked){
    toast.add({severity:'success',detail:`${response.message}`})
  }else{
    toast.add({severity:'error',detail:`${response.message}`})
  }
}

async function getInfo(value: string) {
  vendor_info.value = await getInformation(props.type, value);
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
select{
 background-color: var(--p-inputtext-background); 
}
</style>
