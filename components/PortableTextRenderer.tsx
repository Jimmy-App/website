import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

type PortableTextRendererProps = {
  value?: PortableTextBlock[] | null;
};

const PortableTextRenderer = ({ value }: PortableTextRendererProps) => {
  if (!value || value.length === 0) {
    return null;
  }

  return <PortableText value={value} />;
};

export default PortableTextRenderer;
