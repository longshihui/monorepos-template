import Example1 from "../src/index";

export default {
  title: "例子组件1",
  component: Example1,
};

export const Normalize = (args) => ({
  components: {
    Example1,
  },
  template: `<Example1></Example1>`,
});

Normalize.storyName = "快速开始使用";
