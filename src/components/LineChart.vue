<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title h4">{{ title }}</div>
    </div>
    <div class="card-image">
      <canvas ref="dynamicChart"></canvas>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Chart from "chart.js";
import axios from "axios";

export default {
  async setup() {
    const title = ref(null);
    const dynamicChart = ref(null);
    const dataSet = ref(null);

    const getRandom = () => {
      return Math.floor(Math.random() * Math.floor(256));
    };

    onMounted(() => {
      const results = {
        type: "line",
        data: {
          datasets: [],
          labels: [],
        },
      };

      if (dataSet.value.data.title != "") {
        title.value = dataSet.value.data.title;
      }

      dataSet.value.data.datasets.forEach((element) => {
        let values = [];
        element.data.forEach((e) => {
          values.push(e.value);
        });
        results.data.datasets.push({
          label: element.name,
          data: values,
          backgroundColor: "rgba(0,0,0,0)",
          borderColor:
            "rgba(" +
            getRandom() +
            "," +
            getRandom() +
            "," +
            getRandom() +
            ",1)",
          borderWidth: 1,
        });
        results.data.labels = dataSet.value.data.periods;
      });

      new Chart(dynamicChart.value, results);
    });

    dataSet.value = await axios.get(
      "https://api.noopschallenge.com/chartbot?type=time"
    );

    return {
      title,
      dynamicChart,
    };
  },
};
</script>
