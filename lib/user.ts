export function getNameAndInitials(
  candidates: Array<string | null | undefined>,
  fallback: string,
) {
  const selectedName = candidates
    .map((candidate) => candidate?.trim())
    .find((candidate) => Boolean(candidate));
  const initials = (selectedName ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return { name: selectedName ?? fallback, initials };
}
