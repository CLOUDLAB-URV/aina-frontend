<template>
  <form class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <label for="name">Name</label>
      <InputText id="name" placeholder="Name" v-model="model.name" />
    </div>

    <div class="flex gap-2">
      <label for="default">Default</label>
      <Checkbox id="default" binary v-model="model.default" />
    </div>

    <div class="flex flex-col gap-2">
      <label for="spec">Specifications</label>
      <textarea v-model="model.spec" id="spec" placeholder="Specifications" class="border p-2" />
    </div>

    <div class="flex flex-col gap-2">
      <label for="vendorName">VendorName</label>
      <select v-model="model.vendor" @click.prevent="getInfo(model.vendor)"
        class="border p-2 rounded-xl border-[var(--surface-border)]">
        <option disabled value="">Please select one</option>
        <option v-for="vendor in vendors" :value="vendor">{{ vendor }}</option>
      </select>
    </div>
    <ButtonsCrud :create="create" @createElement="sendCreate" @updateElement="update" @deleteElement="delete_element" />
  </form>
  <section class="mt-8">
    <h3 class="text-xl mb-4 text-[var(--text-color)]">Spec Params definitions</h3>
    <DataTable :value="vendor_info" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"
      tableStyle="min-width: 50rem">
      <Column field="name" header="Name" style="width: 10%"></Column>
      <Column field="help" header="Help" style="width: 65%"></Column>
      <Column field="type" header="Type" style="width: 10%"></Column>
    </DataTable>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useEmbStore } from "@/stores/emb";
import { EmbApi } from "@/apis/api.ts";
import type { EmbeddingInfo, EmbeddingCreate } from "@/models";
import type { AddEmbeddingApiV1EmbeddingsEmbeddingPostRequest, DeleteEmbeddingApiV1EmbeddingsEmbeddingEmbeddingNameDeleteRequest, UpdateEmbeddingApiV1EmbeddingsEmbeddingEmbeddingNamePatchRequest, GetEmbeddingVendorDescApiV1EmbeddingsVendorVendorNameGetRequest } from "@/apis/EmbeddingsApi.ts";
import ButtonsCrud from "@/components/ButtonsCrud.vue";
import { transformParams } from "@/apis/DescSpec.ts";

let embStore = useEmbStore();

const props = defineProps<{
  create: boolean;
  data?: EmbeddingInfo;
}>();


const emits = defineEmits(['deselect']);

let vendor_info = ref();
let vendors = ref<any[]>([]);
let model = ref({
  name: "",
  default: false,
  spec: "",
  vendor: "",
})

onMounted(async () => {
  vendors.value = await EmbApi.listEmbeddingVendorsApiV1EmbeddingsVendorsGet();
  change_model()
});

watch(() => props.data, () => {
  change_model();
});


function change_model() {
  model.value.name = props.data?.name ?? "";
  model.value.default = props.data?._default ?? false;
  model.value.spec = JSON.stringify(props.data?.spec) ?? "";
  model.value.vendor = props.data?.vendorName ?? "";
  return model;
}

function sendCreate() {
  let create: EmbeddingCreate = {
    name: model.value.name,
    _default: model.value.default,
    vendorName: model.value.vendor,
    spec: JSON.parse(model.value.spec),
  };
  let createParam: AddEmbeddingApiV1EmbeddingsEmbeddingPostRequest = {
    embeddingCreate: create,
  };
  EmbApi.addEmbeddingApiV1EmbeddingsEmbeddingPost(createParam).then((data) => {
    console.log("created " + model.value.name);
    console.log(data)
    embStore.addEmb(create);
  });
}

function delete_element() {
  console.log("delete");
  let name_llm: DeleteEmbeddingApiV1EmbeddingsEmbeddingEmbeddingNameDeleteRequest = {
    embeddingName: model.value.name,
  };
  EmbApi.deleteEmbeddingApiV1EmbeddingsEmbeddingEmbeddingNameDelete(name_llm).then(() => {
    console.log("deleted " + model.value.name);
    embStore.removeEmb(model.value);
    emits('deselect');
  });
  console.log("deleted " + model.value.name);
}

function update() {
  console.log("update");
  let name_llm: UpdateEmbeddingApiV1EmbeddingsEmbeddingEmbeddingNamePatchRequest = {
    embeddingName: model.value.name,
    _default: model.value.default,
    body: JSON.parse(model.value.spec),
  };
  EmbApi.updateEmbeddingApiV1EmbeddingsEmbeddingEmbeddingNamePatch(name_llm).then(() => {
    console.log("updated " + model.value.name);
    let change = {
      name: model.value.name,
      _default: model.value.default,
      vendorName: model.value.vendor,
      spec: JSON.parse(model.value.spec),
    }
    embStore.updateEmb(change);
  });
}

async function getInfo(value: string) {
  let name: GetEmbeddingVendorDescApiV1EmbeddingsVendorVendorNameGetRequest = {
    vendorName: value
  }
  vendor_info.value = transformParams(Object.values(await EmbApi.getEmbeddingVendorDescApiV1EmbeddingsVendorVendorNameGet(name))[1]);
}

</script>
