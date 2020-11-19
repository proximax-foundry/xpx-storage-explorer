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
  name: "PieChart",
  async setup() {
    const title = ref(null);
    const dynamicChart = ref(null);
    const dataSet = ref(null);

    const getRandom = () => {
      return Math.floor(Math.random() * Math.floor(256));
    };

    onMounted(() => {
      const results = {
        type: dataSet.value.data.type,
        data: {
          datasets: [
            {
              label: "",
              data: [],
              backgroundColor: [],
            },
          ],
          labels: [],
        },
      };

      if (dataSet.value.data.title != "") {
        title.value = dataSet.value.data.title;
      }

      dataSet.value.data.datasets.forEach((element) => {
        results.data.datasets[0].data.push(element.value);
        results.data.datasets[0].backgroundColor.push(
          "rgba(" + getRandom() + "," + getRandom() + "," + getRandom() + ",1)"
        );
        results.data.labels.push(element.name);
      });

      new Chart(dynamicChart.value, results);
    });

    dataSet.value = await axios.get(
      "https://api.noopschallenge.com/chartbot?type=pie"
    );

    return {
      title,
      dynamicChart,
    };
  },
};
</script>
