import { LlmApi, EmbApi, RankApi } from "@/apis/api";
import { useLlmStore } from "@/stores/llm";
import { useEmbStore } from "@/stores/emb";
import { useRankStore } from "@/stores/rank";
import {
  type AddLlmApiV1LlmsLlmPostRequest,
  type DeleteLlmApiV1LlmsLlmLlmNameDeleteRequest,
  type UpdateLlmApiV1LlmsLlmLlmNamePatchRequest,
  type GetVendorDescApiV1LlmsVendorVendorNameGetRequest,
} from "@/apis/LlmsApi.ts";
import type {
  GetEmbeddingVendorDescApiV1EmbeddingsVendorVendorNameGetRequest,
  UpdateEmbeddingApiV1EmbeddingsEmbeddingEmbeddingNamePatchRequest,
  DeleteEmbeddingApiV1EmbeddingsEmbeddingEmbeddingNameDeleteRequest,
  AddEmbeddingApiV1EmbeddingsEmbeddingPostRequest,
} from "@/apis/EmbeddingsApi.ts";
import type {
  GetRerankingVendorDescApiV1RerankingsVendorVendorNameGetRequest,
  UpdateRerankingApiV1RerankingsRerankingRerankingNamePatchRequest,
  DeleteRerankingApiV1RerankingsRerankingRerankingNameDeleteRequest,
  AddRerankingApiV1RerankingsRerankingPostRequest,
} from "@/apis/RerankingsApi";
import { transformParams } from "@/apis/DescSpec.ts";
import type {
  LlmCreate,
  RerankingCreate,
  EmbeddingCreate,
} from "@/models/index.ts";
import yaml from "js-yaml";

export async function mount(type: String) {
  const llmStore = useLlmStore();
  const embStore = useEmbStore();
  const rankStore = useRankStore();
  let data;
  if (type == "llm") {
    data = await LlmApi.listLlmsApiV1LlmsGet();
    llmStore.data = parse_data(data);
  } else if (type == "emb") {
    data = await EmbApi.listEmbeddingsApiV1EmbeddingsGet();
    embStore.data = parse_data(data);
  } else if (type == "rank") {
    data = await RankApi.listRerankingsApiV1RerankingsGet();
    rankStore.data = parse_data(data);
  }
}

function parse_data(data: any) {
  return Object.values(data).map((llm: any) => {
    let aux = {
      name: llm.name,
      _default: llm._default,
      vendorName: llm.vendorName,
      spec: "",
    };
    aux.spec = yaml.dump(llm.spec);
    return aux;
  });
}

export async function mountVendors(type: String) {
  if (type == "llm") {
    return await LlmApi.listVendorsApiV1LlmsVendorsGet();
  } else if (type == "emb") {
    return await EmbApi.listEmbeddingVendorsApiV1EmbeddingsVendorsGet();
  } else if (type == "rank") {
    return await RankApi.listRerankingVendorsApiV1RerankingsVendorsGet();
  }
}

export async function createElement(type: String, model: any) {
  if (type == "llm") {
    const llmStore = useLlmStore();
    let create: LlmCreate = {
      name: model.name,
      _default: model._default,
      vendorName: model.vendorName,
      spec: yaml.load(model.spec) as object,
    };
    let createParam: AddLlmApiV1LlmsLlmPostRequest = {
      llmCreate: create,
    };
    await LlmApi.addLlmApiV1LlmsLlmPost(createParam).then(() => {
      llmStore.addLlm(model);
      console.log(llmStore.data);
    });
  } else if (type == "emb") {
    const embStore = useEmbStore();
    let create: EmbeddingCreate = {
      name: model.name,
      _default: model._default,
      vendorName: model.vendorName,
      spec: yaml.load(model.spec) as object,
    };
    let createParam: AddEmbeddingApiV1EmbeddingsEmbeddingPostRequest = {
      embeddingCreate: create,
    };
    await EmbApi.addEmbeddingApiV1EmbeddingsEmbeddingPost(createParam).then(
      () => {
        embStore.addEmb(model);
      }
    );
  } else if (type == "rank") {
    const rankStore = useRankStore();
    let create: RerankingCreate = {
      name: model.name,
      _default: model._default,
      vendorName: model.vendorName,
      spec: yaml.load(model.spec) as any,
    };
    let createParam: AddRerankingApiV1RerankingsRerankingPostRequest = {
      rerankingCreate: create,
    };
    await RankApi.addRerankingApiV1RerankingsRerankingPost(createParam).then(
      () => {
        rankStore.addRank(model);
      }
    );
  }
}

export async function deleteElement(type: String, model: any) {
  if (type == "llm") {
    console.log("delete");
    let llmStore = useLlmStore();
    let name_llm: DeleteLlmApiV1LlmsLlmLlmNameDeleteRequest = {
      llmName: model.name,
    };
    await LlmApi.deleteLlmApiV1LlmsLlmLlmNameDelete(name_llm);
    llmStore.removeLlm(model);
    return "deselect";
  } else if (type == "emb") {
    const embStore = useEmbStore();
    let name_llm: DeleteEmbeddingApiV1EmbeddingsEmbeddingEmbeddingNameDeleteRequest =
      {
        embeddingName: model.name,
      };
    await EmbApi.deleteEmbeddingApiV1EmbeddingsEmbeddingEmbeddingNameDelete(
      name_llm
    );
    console.log("deleted " + model.name);
    embStore.removeEmb(model);
    return "deselect";
  } else if (type == "rank") {
    const rankStore = useRankStore();
    let name_llm: DeleteRerankingApiV1RerankingsRerankingRerankingNameDeleteRequest =
      {
        rerankingName: model.name,
      };
    await RankApi.deleteRerankingApiV1RerankingsRerankingRerankingNameDelete(
      name_llm
    );
    console.log("deleted " + model.name);
    rankStore.removeRank(model);
    return "deselect";
  }
  return "wrong";
}

export function updateElement(type: String, model: any) {
  if (type == "llm") {
    let llmStore = useLlmStore();
    let name_llm: UpdateLlmApiV1LlmsLlmLlmNamePatchRequest = {
      llmName: model.name,
      _default: model._default,
      requestBody: yaml.load(model.spec) as Object,
    };
    LlmApi.updateLlmApiV1LlmsLlmLlmNamePatch(name_llm).then(() => {
      llmStore.updateLlm({
        name: model.name,
        _default: model._default,
        vendorName: model.vendorName,
        spec: model.spec,
      });
    });
  } else if (type == "emb") {
    const embStore = useEmbStore();
    let name_llm: UpdateEmbeddingApiV1EmbeddingsEmbeddingEmbeddingNamePatchRequest =
      {
        embeddingName: model.name,
        _default: model._default,
        requestBody: yaml.load(model.spec) as Object,
      };
    EmbApi.updateEmbeddingApiV1EmbeddingsEmbeddingEmbeddingNamePatch(
      name_llm
    ).then(() => {
      console.log("updated " + model.name);
      embStore.updateEmb(model);
    });
  } else if (type == "rank") {
    const rankStore = useRankStore();
    let name_llm: UpdateRerankingApiV1RerankingsRerankingRerankingNamePatchRequest =
      {
        rerankingName: model.name,
        _default: model._default,
        requestBody: yaml.load(model.spec) as any,
      };
    RankApi.updateRerankingApiV1RerankingsRerankingRerankingNamePatch(
      name_llm
    ).then(() => {
      console.log("updated " + model.name);
      rankStore.updateRank(model);
    });
  }
}

export async function getInformation(type: String, value: string) {
  if (type == "llm") {
    let name: GetVendorDescApiV1LlmsVendorVendorNameGetRequest = {
      vendorName: value,
    };
    return transformParams(
      Object.values(
        await LlmApi.getVendorDescApiV1LlmsVendorVendorNameGet(name)
      )[1]
    );
  } else if (type == "emb") {
    console.log(value);
    let name: GetEmbeddingVendorDescApiV1EmbeddingsVendorVendorNameGetRequest =
      {
        vendorName: value,
      };
    return transformParams(
      Object.values(
        await EmbApi.getEmbeddingVendorDescApiV1EmbeddingsVendorVendorNameGet(
          name
        )
      )[1]
    );
  } else if (type == "rank") {
    let name: GetRerankingVendorDescApiV1RerankingsVendorVendorNameGetRequest =
      {
        vendorName: value,
      };
    return transformParams(
      Object.values(
        await RankApi.getRerankingVendorDescApiV1RerankingsVendorVendorNameGet(
          name
        )
      )[1]
    );
  }
}
