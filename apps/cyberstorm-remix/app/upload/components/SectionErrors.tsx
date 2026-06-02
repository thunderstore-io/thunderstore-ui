import { NewAlert } from "@thunderstore/cyberstorm";

export function SectionErrors({ errors }: { errors: string[] }) {
  if (errors.length === 0) return null;

  return (
    <NewAlert csVariant="danger" rootClasses="upload__alert">
      <div>
        {errors.map((msg) => (
          <div key={msg}>{msg}</div>
        ))}
      </div>
    </NewAlert>
  );
}
