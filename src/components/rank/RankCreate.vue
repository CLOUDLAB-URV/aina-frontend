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
            <select v-model="model.vendor" class="border p-2 rounded-xl border-[var(--surface-border)]">
                <option disabled value="">Please select one</option>
                <option v-for="vendor in vendors" :value="vendor">{{ vendor }}</option>
            </select>
        </div>
        <ButtonsCrud :create="create" @createElement="sendCreate" @updateElement="update" @deleteElement="delete_element" />
    </form>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRankStore } from "@/stores/rank";
import { RankApi } from "@/apis/api.ts";
import type { RerankingCreate,RerankingInfo } from "@/models";
import type {  AddRerankingApiV1RerankingsRerankingPostRequest,DeleteRerankingApiV1RerankingsRerankingRerankingNameDeleteRequest,UpdateRerankingApiV1RerankingsRerankingRerankingNamePatchRequest} from "@/apis/RerankingsApi.ts";
import ButtonsCrud from "@/components/ButtonsCrud.vue";

let rankStore = useRankStore();

const props = defineProps<{
  create: boolean;
  data?: RerankingInfo;
}>();


const emits = defineEmits(['deselect']);

let vendors = ref<any[]>([]);
let model = ref({
  name: "",
  default: false,
  spec: "",
  vendor: "",
})

onMounted(async () => {
  vendors.value = await RankApi.listRerankingVendorsApiV1RerankingsVendorsGet();
  change_model()
});

watch(() => props.data, () => {
  change_model();
});


function change_model() {
  console.log(props.data);
  model.value.name = props.data?.name ?? "";
  model.value.default = props.data?._default ?? false;
  model.value.spec = JSON.stringify(props.data?.spec) ?? "";
  model.value.vendor = props.data?.vendorName ?? "";
  return model;
}

function sendCreate() {
  let create: RerankingCreate = {
    name: model.value.name,
    _default: model.value.default,
    vendorName: model.value.vendor,
    spec: JSON.parse(model.value.spec),
  };
  let createParam: AddRerankingApiV1RerankingsRerankingPostRequest = {
    rerankingCreate: create,
  };
  RankApi.addRerankingApiV1RerankingsRerankingPost(createParam).then(() => {
    console.log("created " + model.value.name);
    rankStore.addRank(model.value);
  });
}

function delete_element() {
  console.log("delete");
  let name_llm: DeleteRerankingApiV1RerankingsRerankingRerankingNameDeleteRequest = {
    rerankingName: model.value.name,
  };
  RankApi.deleteRerankingApiV1RerankingsRerankingRerankingNameDelete(name_llm).then(() => {
    console.log("deleted " + model.value.name);
    rankStore.removeRank(model.value);
    emits('deselect');
  });
  console.log("deleted " + model.value.name);
}

function update() {
  console.log("update");
  let name_llm: UpdateRerankingApiV1RerankingsRerankingRerankingNamePatchRequest = {
    rerankingName: model.value.name,
    _default: model.value.default,
    body: JSON.parse(model.value.spec),
  };
  RankApi.updateRerankingApiV1RerankingsRerankingRerankingNamePatch(name_llm).then(() => {
    console.log("updated " + model.value.name);
    rankStore.updateRank(model.value);
  });
}

</script>
