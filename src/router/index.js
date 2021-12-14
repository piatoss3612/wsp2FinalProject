import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: "/",
      name: "canvas_page",
      component: () => import("@/components/canvas_page"),
    },
    {
      path: "/gallery",
      name: "gallery_page",
      component: () => import("@/components/gallery_page"),
    },
    {
      path: "/*",
      name: "error_page",
      component: () => import("@/components/error_page"),
    },
  ],
});

export default router;