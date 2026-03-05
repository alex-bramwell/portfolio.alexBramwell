import SplitHeading from "./SplitHeading";

export default {
  title: "Components/SplitHeading",
  component: SplitHeading,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Splits text content into individual words and animates each with a staggered 3D reveal on scroll. Supports `<em>` for accent-coloured words and configurable heading level.",
      },
    },
  },
};

export const Default = {
  render: () => (
    <SplitHeading className="section-main-heading">
      Build something <em>remarkable</em>
    </SplitHeading>
  ),
};

export const WithLineBreak = {
  render: () => (
    <SplitHeading className="section-main-heading">
      Design systems<br />meet <em>engineering</em>
    </SplitHeading>
  ),
};

export const AsH3 = {
  render: () => (
    <SplitHeading tag="h3" className="section-main-heading">
      Smaller <em>heading</em>
    </SplitHeading>
  ),
};
