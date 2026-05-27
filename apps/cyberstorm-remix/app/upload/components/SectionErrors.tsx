import { NewAlert } from "@thunderstore/cyberstorm";

export function SectionErrors({ errors }: { errors: string[] }) {
  if (errors.length === 0) return null;

  return (
    <NewAlert csVariant="danger" rootClasses="upload__alert">
      <ul>
        {errors.map((msg) => (
          <li key={msg}>{msg}</li>
        ))}
      </ul>
    </NewAlert>
  );
}
