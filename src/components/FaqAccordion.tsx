import { CopyBlocks, Text } from "./Content";
import type { ContentSection } from "../lib/sections";
export function FaqAccordion({ section }: { section: ContentSection }) {
  return (
    <details className="faq-accordion" open>
      <summary>
        <h2>
          <Text>{section.heading}</Text>
        </h2>
        <span aria-hidden="true">+</span>
      </summary>
      <CopyBlocks blocks={section.blocks} />
    </details>
  );
}
