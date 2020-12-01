<template>
  <div class="columns">
    <div class="column col-6">
      <SuspenseTemplate>
        <template #default>
          <LineChart />
        </template>
      </SuspenseTemplate>
    </div>
    <div class="column col-6">
      <SuspenseTemplate>
        <template #default>
          <PieChart />
        </template>
      </SuspenseTemplate>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import SuspenseTemplate from "@/components/SuspenseLoadErrorTemplate.vue";

export default {
  name: "Statistics",
  components: {
    SuspenseTemplate,
    LineChart: defineAsyncComponent(() =>
      import("@/components/LineChart.vue" /* webpackChunkName: "lineChart" */)
    ),
    PieChart: defineAsyncComponent(() =>
      import("@/components/PieChart.vue" /* webpackChunkName: "pieChart" */)
    ),
  },
};
</script>
