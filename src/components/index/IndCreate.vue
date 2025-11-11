<template>
  <form class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <label for="id">Index Name</label>
      <InputText id="Id" placeholder="Id" v-model="model.name" />
    </div>

    <div class="flex flex-col gap-2">
      <label for="vendorName">Index Type</label>
      <select v-model="model.indexType" class="border p-2 rounded-xl border-[var(--surface-border)]">
        <option disabled value="">Please select one</option>
        <option v-for="vendor in vendors" :value="vendor">{{ vendor }}</option>
      </select>
    </div>

    <div class="flex flex-col gap-2">
      <label for="spec">Configuration</label>
      <textarea v-model="model.config" id="spec" placeholder="Configuration" class="border p-2" rows="10" />
    </div>

    <ButtonsCrud :create="create" @createElement="sendCreate" @updateElement="update" @deleteElement="delete_element" />
  </form>
  <!-- <section class="mt-8">
    <h3 class="text-xl mb-4 text-[var(--text-color)]">Spec Params definitions</h3>
    <DataTable :value="vendor_info" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"
      tableStyle="min-width: 50rem">
      <Column field="name" header="Name" style="width: 10%"></Column>
      <Column field="help" header="Help" style="width: 65%"></Column>
      <Column field="type" header="Type" style="width: 10%"></Column>
    </DataTable>
  </section> -->
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useIndStore } from "@/stores/ind";
import { IndApi } from "@/apis/api.ts";
import type { CreateIndexApiV1IndexPostRequest } from "@/apis/IndexApi.ts";
import ButtonsCrud from "@/components/ButtonsCrud.vue";
import yaml from 'js-yaml';

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

// let vendor_info = ref();
let vendors = ref<any[]>([]);
let model = ref({
  id: -1,
  name: "",
  config: "",
  indexType: "",
})

onMounted(async () => {
  vendors.value = await IndApi.listIndexTypesApiV1IndexTypesGet();
  change_model()
});

watch(() => props.data, () => {
  change_model();
});


function change_model() {
  console.log(props.data);
  model.value.name = props.data?.name ?? "";
  model.value.id = props.data?.id ?? -1;
  model.value.config = props.data?.config ?? "";
  model.value.indexType = props.data?.indexType ?? "";
  return model;
}

function sendCreate() {
  IndApi.createIndexApiV1IndexPost({
    name: model.value.name,
    indexType: model.value.indexType,
    requestBody: yaml.load(model.value.config) as Object,
  }).then((res) => {
    console.log("created " + model.value.name);
    // let create = {
    //   name: model.value.name,
    //   id: model.value.id,
    //   indexType: model.value.indexType,
    //   config: model.value.config,
    // }
    model.value.id = res.id;
    indStore.addInd(model.value);
  });
}

function delete_element() {
  console.log("delete");
  IndApi.deleteIndexApiV1IndexIndexIdDelete({
    indexId: model.value.id,
  }).then(() => {
    console.log("deleted " + model.value.name);
    indStore.removeInd(model.value);
    emits('deselect');
  });
  console.log("deleted " + model.value.name);
}

function update() {
  console.log("update");
  IndApi.updateIndexApiV1IndexIndexIdPatch({
    indexId: model.value.id,
    name: model.value.name,
    requestBody: yaml.load(model.value.config) as Object,
  }).then(() => {
    console.log("updated " + model.value.name);
    // let change = {
    //   name: model.value.name,
    //   id: model.value.id,
    //   indexType: model.value.indexType,
    //   config: model.value.config,
    // }\
    // console.log(res)
    // model.value.id = res.id;
    indStore.updateInd(model.value);
  });
}

// async function getInfo(value: string) {
//   let name: GetRerankingVendorDescApiV1RerankingsVendorVendorNameGetRequest = {
//     vendorName: value
//   }
//   vendor_info.value = transformParams(Object.values(await IndApi.getRerankingVendorDescApiV1RerankingsVendorVendorNameGet(name))[1]);
// }

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
