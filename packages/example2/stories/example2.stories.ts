import Example2 from "../src/index";

export default {
  title: "例子组件2",
  component: Example2,
};

export const Normalize = (args) => ({
  components: {
    Example2,
  },
  template: `<Example2></Example2>`,
});
