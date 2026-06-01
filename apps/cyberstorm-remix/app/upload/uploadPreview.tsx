import { strFromU8, unzipSync } from "fflate";
import { useEffect, useState } from "react";
import { Markdown } from "~/commonComponents/Markdown/Markdown";

import { Heading } from "@thunderstore/cyberstorm";

const MAX_PREVIEW_BYTES = 100 * 1024 * 1024; // 100 MB

export default function UploadPreview({ file }: { file: File | null }) {
  const [readme, setReadme] = useState<string | null>(null);
  const [changelog, setChangelog] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setReadme(null);
      setChangelog(null);
      return;
    }

    if (file.size > MAX_PREVIEW_BYTES) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = new Uint8Array(reader.result as ArrayBuffer);
        const unzipped = unzipSync(data);
        const readmeFile = Object.keys(unzipped).find(
          (name) => name === "README.md"
        );
        const changelogFile = Object.keys(unzipped).find(
          (name) => name === "CHANGELOG.md"
        );
        if (readmeFile) {
          setReadme(strFromU8(unzipped[readmeFile]));
        }
        if (changelogFile) {
          setChangelog(strFromU8(unzipped[changelogFile]));
        }
      } catch (e) {}
    };
    reader.readAsArrayBuffer(file);
  }, [file]);

  return (
    <div style={{ margin: "0 3rem" }}>
      {readme && (
        <div>
          <Heading csLevel="2" csSize="2" style={{ margin: "2rem 0" }}>
            Readme Preview
          </Heading>
          <Markdown input={readme} />
        </div>
      )}
      {changelog && (
        <div>
          <Heading csLevel="2" csSize="2" style={{ margin: "2rem 0" }}>
            Changelog Preview
          </Heading>
          <Markdown input={changelog} />
        </div>
      )}
    </div>
  );
}
