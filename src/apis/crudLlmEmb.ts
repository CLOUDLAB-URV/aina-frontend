import { LlmApi } from "@/apis/api.ts";
import { type LlmCreate } from "@/models";
import type {
  AddLlmApiV1LlmsLlmPostRequest,
  DeleteLlmApiV1LlmsLlmLlmNameDeleteRequest,
  UpdateLlmApiV1LlmsLlmLlmNamePatchRequest,
} from "@/apis/LlmsApi.ts";
import router from "@/router";

export function change_model(props: any) {
  let llm_model = {
    name: "",
    default: false,
    spec: "",
    vendor: "",
  };
  llm_model.name = props?.name ?? "";
  llm_model.default = props?._default ?? false;
  llm_model.spec = JSON.stringify(props?.spec) ?? "";
  llm_model.vendor = props?.vendorName ?? "";
  console.log(llm_model);
  return llm_model;
}

export function sendCreate(llm_model: any) {
  console.log("create");
  console.log(llm_model);
  let create: LlmCreate = {
    name: llm_model.name,
    _default: llm_model.default,
    vendorName: llm_model.vendor,
    spec: JSON.parse(llm_model.spec),
  };
  let createParam: AddLlmApiV1LlmsLlmPostRequest = {
    llmCreate: create,
  };
  LlmApi.addLlmApiV1LlmsLlmPost(createParam);
  router.push("/general");
}

export function deleteLLm(llm_model: any) {
  console.log("delete");
  let name_llm: DeleteLlmApiV1LlmsLlmLlmNameDeleteRequest = {
    llmName: llm_model.name,
  };
  LlmApi.deleteLlmApiV1LlmsLlmLlmNameDelete(name_llm);
  console.log("deleted " + llm_model.name);
  router.push("/general");
}

export function updateLlm(llm_model: any) {
  console.log("update");
  let name_llm: UpdateLlmApiV1LlmsLlmLlmNamePatchRequest = {
    llmName: llm_model.name,
    _default: llm_model.default,
    body: JSON.parse(llm_model.spec),
  };
  LlmApi.updateLlmApiV1LlmsLlmLlmNamePatch(name_llm);
  console.log("updated " + llm_model.name);
  router.push("/general");
}
