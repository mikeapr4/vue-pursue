import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import VuePursue from "../src/vue-pursue.js";

const Child = {
  props: ["user"],
  computed: {
    validName: vm => !!vm.user.name
  },
  template: '<div><template v-if="validName">{{ user.name }}</template></div>'
};
const Component = {
  name: "Component",
  components: { Child },
  data() {
    return {
      currentUser: 1,
      users: {
        1: { name: "Joe" },
        2: { name: "Karen" }
      }
    };
  },
  computed: {
    user: vm => vm.users[vm.currentUser]
  },
  template: '<div><Child :user="user"/></div>'
};
const UnnamedComponent = { ...Component };
delete UnnamedComponent.name;

const StoreComponent = {
  ...Component,
  data() {
    return {};
  },
  computed: {
    currentUser: vm => vm.$store.state.currentUser,
    ...Vuex.mapState(["users"]),
    ...Vuex.mapState({ allUsers: "users" }),
    ...Vuex.mapGetters(["authenticated"]),
    ...Vuex.mapGetters({ auth: "authenticated" }),
    user: vm => vm.users[vm.currentUser]
  },
  watch: {
    allUsers() {},
    auth: {
      immediate: true,
      sync: true,
      handler() {}
    }
  }
};

describe("Vue Pursue", () => {
  it("should work with Vue only", () => {
    const localVue = createLocalVue();
    localVue.use(VuePursue);
    const wrapper = mount(Component, { localVue });
    expect(localVue.pursue(wrapper.vm.users[1])).toEqual({
      computed: ["Component.user", "Child.validName"],
      components: ["Component", "Child"],
      unrecognised: 0
    });
    const deps = {
      computed: ["Component.user"],
      components: ["Component"],
      unrecognised: 0
    };
    expect(localVue.pursue(wrapper.vm.users)).toEqual(deps);
    expect(localVue.pursue(() => wrapper.vm.currentUser)).toEqual(deps);
    expect(localVue.pursue(wrapper.vm, "currentUser")).toEqual(deps);

    // No reactivity for the 2nd record
    expect(localVue.pursue(wrapper.vm.users[2])).toEqual({
      computed: [],
      components: [],
      unrecognised: 0
    });
  });

  it("should work with unnamed components", () => {
    const localVue = createLocalVue();
    localVue.use(VuePursue);
    const wrapper = mount(UnnamedComponent, { localVue });
    expect(localVue.pursue(wrapper.vm.users[1])).toEqual({
      computed: ["user", "Child.validName"],
      components: ["Child"],
      unrecognised: 1
    });
  });

  it("should work with Vuex", () => {
    const localVue = createLocalVue();
    localVue.use(Vuex);
    const store = new Vuex.Store({
      plugins: [VuePursue],
      state: {
        currentUser: 1,
        users: {
          1: { name: "Joe" },
          2: { name: "Karen" }
        },
        token: 123
      },
      getters: {
        authenticated: state => !!state.token
      }
    });
    const wrapper = mount(StoreComponent, { localVue, store });
    wrapper.vm.allUsers;
    wrapper.vm.authenticated;
    wrapper.vm.auth;
    wrapper.vm.$watch('auth', () => {}, { immediate: true });
    expect(localVue.pursue(store.state.users[1])).toEqual({
      computed: ["Component.user", "Child.validName"],
      components: ["Component", "Child"],
      unrecognised: 0
    });
    expect(localVue.pursue(store.state.users[1], "name")).toEqual({
      computed: ["Child.validName"],
      components: ["Child"],
      unrecognised: 0
    });
    expect(localVue.pursue(store.state.users)).toEqual({
      computed: ["Component.user"],
      components: ["Component"],
      unrecognised: 0
    });
    expect(localVue.pursue(() => store.state.token)).toEqual({
      computed: ["authenticated", "Component.user", "Component.currentUser"],
      components: ["Component"],
      unrecognised: 0
    });
  });
});
