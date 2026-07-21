// Calculates the final section UUID based on an optionally requested section
// and the community filters, defaulting to the highest priority section or
// an empty string if "all" is explicitly passed.
export function getSectionDefault(
  section: string | null,
  sections?: { uuid: string; priority: number }[]
): string {
  if (section === "all") return "";

  // Honour a requested section only if the community actually has it — a stale
  // or junk uuid would 400 the listing API, so ignore it and fall through to
  // the default below (as if none was requested). Without a known section list
  // (undefined) we can't validate, so trust the requested value as before.
  if (section && (!sections || sections.some((s) => s.uuid === section))) {
    return section;
  }

  if (sections && sections.length > 0) {
    let maxPrioritySection = sections[0];
    for (let i = 1; i < sections.length; i++) {
      if (sections[i].priority > maxPrioritySection.priority) {
        maxPrioritySection = sections[i];
      }
    }
    return maxPrioritySection.uuid;
  }

  return "";
}
