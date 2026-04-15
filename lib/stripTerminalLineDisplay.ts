/** Strip synthetic viewport labels (`html|json|table[NNN] │`) for on-screen display; logs keep full lines for classification. */
const VIEWPORT_LABEL = /^(?:html|json|table)\[\d{3}\] │ ?/;

export function stripTerminalLineDisplay(line: string): string {
  return line.replace(VIEWPORT_LABEL, '');
}
