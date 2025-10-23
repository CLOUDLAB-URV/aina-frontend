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
      <label for="spec">Specifications</label>
      <textarea v-model="model.config" id="spec" placeholder="Specifications" class="border p-2" />
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
import type { IndexInfo } from "@/models";
import type { CreateIndexApiV1IndexPostRequest, DeleteIndexApiV1IndexIndexIndexIdDeleteRequest, UpdateIndexApiV1IndexIndexIndexIdPatchRequest } from "@/apis/IndexApi.ts";
import ButtonsCrud from "@/components/ButtonsCrud.vue";
// import type { Config } from "primevue";
// import { transformParams } from "@/apis/DescSpec.ts";

let indStore = useIndStore();

const props = defineProps<{
  create: boolean;
  data?: IndexInfo
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
  model.value.config = JSON.stringify(props.data?.config) ?? "";
  model.value.indexType = props.data?.indexType ?? "";
  return model;
}

function sendCreate() {
  let createParam: CreateIndexApiV1IndexPostRequest = {
    name: model.value.name,
    indexType: model.value.indexType,
    body: JSON.parse(model.value.config),
  };
  IndApi.createIndexApiV1IndexPost(createParam).then(() => {
    console.log("created " + model.value.name);
    let create = {
      name: model.value.name,
      id: model.value.id,
      indexType: model.value.indexType,
      config: JSON.parse(model.value.config),
    }
    indStore.addInd(create);
  });
}

function delete_element() {
  console.log("delete");
  let index: DeleteIndexApiV1IndexIndexIndexIdDeleteRequest = {
    indexId: model.value.id,
  };
  IndApi.deleteIndexApiV1IndexIndexIndexIdDelete(index).then(() => {
    console.log("deleted " + model.value.name);
    indStore.removeInd(model.value);
    emits('deselect');
  });
  console.log("deleted " + model.value.name);
}

function update() {
  console.log("update");
  let index: UpdateIndexApiV1IndexIndexIndexIdPatchRequest = {
    indexId: model.value.id,
    name: model.value.name,
    body: JSON.parse(model.value.config),
  };
  IndApi.updateIndexApiV1IndexIndexIndexIdPatch(index).then(() => {
    console.log("updated " + model.value.name);
    let change = {
      name: model.value.name,
      id: model.value.id,
      indexType: model.value.indexType,
      config: JSON.parse(model.value.config),
    }
    indStore.updateInd(change);
  });
}

// async function getInfo(value: string) {
//   let name: GetRerankingVendorDescApiV1RerankingsVendorVendorNameGetRequest = {
//     vendorName: value
//   }
//   vendor_info.value = transformParams(Object.values(await IndApi.getRerankingVendorDescApiV1RerankingsVendorVendorNameGet(name))[1]);
// }

</script>
