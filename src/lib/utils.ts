// Small utilities used across the app
// Export a `cn` helper (classNames) used by UI components
export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(' ');
}

export default cn;
