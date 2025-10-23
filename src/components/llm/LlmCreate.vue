<template>
  <form class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <label for="name">Name</label>
      <InputText id="name" placeholder="Name" v-model="llm_model.name" />
    </div>

    <div class="flex gap-2">
      <label for="default">Default</label>
      <Checkbox id="default" binary v-model="llm_model._default" />
    </div>

    <div class="flex flex-col gap-2">
      <label for="spec">Specifications</label>
      <textarea v-model="llm_model.spec" id="spec" placeholder="Specifications" class="border p-2" />
    </div>

    <div class="flex flex-col gap-2">
      <label for="vendorName">VendorName</label>
      <select v-model="llm_model.vendorName" @click.prevent="getInfo(llm_model.vendorName)"
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
import { mountVendors, createElement, updateElement, deleteElement, getInformation } from '@/apis/combinedCrud';
import { onMounted, ref, watch } from "vue";
import ButtonsCrud from "@/components/ButtonsCrud.vue";

let vendor_info = ref();

const props = defineProps({
  create: { type: Boolean, required: true },
  data: Object,
  type: { type: String, required: true }
});


const emits = defineEmits(['deselect']);

let vendors = ref<any[]>([]);
let llm_model = ref({
  name: "",
  _default: false,
  spec: "",
  vendorName: "",
})

onMounted(async () => {
  vendors.value = await mountVendors(props.type);
  change_model();
});

watch(() => props.data, async () => {
  vendors.value = await mountVendors(props.type);
  change_model();
});


function change_model() {
  llm_model.value.name = props.data?.name ?? "";
  llm_model.value._default = props.data?._default ?? false;
  llm_model.value.spec = props.data?.spec ?? "";
  llm_model.value.vendorName = props.data?.vendorName ?? "";
  return llm_model;
}

function sendCreate() {
  createElement(props.type, llm_model.value);
}

function delete_element() {
  deleteElement(props.type, llm_model.value);
}

function update() {
  updateElement(props.type, llm_model.value);
}

async function getInfo(value: string) {
  vendor_info.value = await getInformation(props.type, value);
}

</script>
