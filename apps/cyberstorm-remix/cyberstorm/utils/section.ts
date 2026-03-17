// Calculates the final section UUID based on an optionally requested section
// and the community filters, defaulting to the highest priority section or
// an empty string if "all" is explicitly passed.
export function getSectionDefault(
  section: string | null,
  sections?: { uuid: string; priority: number }[]
): string {
  if (section) {
    return section === "all" ? "" : section;
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
