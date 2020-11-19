<template>
  <div class="columns">
    <div class="column col-6">
      <Susp>
        <template #default>
          <LineChart />
        </template>
      </Susp>
    </div>
    <div class="column col-6">
      <Susp>
        <template #default>
          <PieChart />
        </template>
      </Susp>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import Susp from "@/components/SuspenseLoadError.vue";

export default {
  name: "Statistics",
  components: {
    Susp,
    LineChart: defineAsyncComponent(() =>
      import("@/components/LineChart.vue" /* webpackChunkName: "lineChart" */)
    ),
    PieChart: defineAsyncComponent(() =>
      import("@/components/PieChart.vue" /* webpackChunkName: "pieChart" */)
    ),
  },
};
</script>
