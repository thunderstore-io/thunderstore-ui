// import { z } from "zod";
import { fetchDynamicHTML } from "@thunderstore/thunderstore-api";

import { DapperTsInterface } from "../index";
// import { formatErrorMessage } from "../utils";

// const dynamicHTMLSchema = z.object({
//   dynamic_htmls: z.array(z.string().nonempty()),
// });

export async function getDynamicHTML(
  this: DapperTsInterface,
  placement: string
) {
  const data = await fetchDynamicHTML({
    config: this.config,
    params: { placement },
    data: {},
    queryParams: {},
  });
  // const parsed = dynamicHTMLSchema.safeParse(data);

  // if (!parsed.success) {
  //   throw new Error(formatErrorMessage(parsed.error));
  // }

  return data.dynamic_htmls;
}
