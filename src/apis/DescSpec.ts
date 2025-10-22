export function transformParams(data: any) {
  const transformedArray = [];

  for (const name in data) {
    if (data.hasOwnProperty(name)) {
      const paramDetails = data[name];

      if (
        paramDetails &&
        paramDetails.help !== undefined &&
        paramDetails.type !== undefined
      ) {
        transformedArray.push({
          name: name,
          help: paramDetails.help,
          type: cleanTypeString(paramDetails.type),
        });
      }
    }
  }

  return transformedArray;
}

function cleanTypeString(typeString: any) {
  if (!typeString) return "Any";
  let cleaned = typeString.replace(/<class '(.+?)'>/, "$1");
  cleaned = cleaned.replace("typing.", "");
  return cleaned.trim();
}
