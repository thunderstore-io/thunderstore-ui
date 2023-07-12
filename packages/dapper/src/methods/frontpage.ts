import { CommunityCardProps } from "@thunderstore/components";
import { z } from "zod";

import { Dapper } from "../dapper";

// Schema describing the data received from backend, used to validate the data.
const schema = z.object({
  communities: z.array(
    z.object({
      bg_image_src: z.nullable(z.string()),
      download_count: z.number().min(0),
      identifier: z.string().min(1),
      name: z.string().min(1),
      package_count: z.number().min(0),
    })
  ),
  download_count: z.number().min(0),
  package_count: z.number().min(0),
});

// Define values returned by the Dapper method.
interface Frontpage {
  communities: CommunityCardProps[];
  downloadCount: number;
  packageCount: number;
}

// Method for transforming the received data to a format that will be
// passed on.
const transform = (viewData: z.infer<typeof schema>): Frontpage => ({
  communities: viewData.communities.map((c) => ({
    downloadCount: c.download_count,
    identifier: c.identifier,
    imageSrc: c.bg_image_src,
    name: c.name,
    packageCount: c.package_count,
  })),
  downloadCount: viewData.download_count,
  packageCount: viewData.package_count,
});

// Dapper method type, defining the parameters required to fetch the data.
export type GetFrontpage = () => Promise<Frontpage>;

// Method implementation for Dapper class.
export const getFrontpage: GetFrontpage = async function (this: Dapper) {
  return await this.queryAndProcess(
    "api/experimental/frontend/frontpage/",
    [],
    schema,
    transform
  );
};
