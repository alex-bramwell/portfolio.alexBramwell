import "../src/styles/_base.scss";

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || "dark";
      document.documentElement.setAttribute("data-theme", theme);
      document.body.style.background = "var(--color-background)";
      document.body.style.color = "var(--color-text-primary)";
      document.body.style.fontFamily = "var(--font-body)";
      return <Story />;
    },
  ],
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Toggle light/dark theme",
      defaultValue: "dark",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "dark", title: "Dark" },
          { value: "light", title: "Light" },
        ],
        showName: true,
      },
    },
  },
};

export default preview;
