<template>
  <div class="text-center">
    <h3>Drives</h3>
    <router-link to="/drives" class="btn btn-link">View All</router-link>
  </div>
  <div class="columns">
    <div
      v-for="item in driveDetails"
      :key="item.drive"
      class="column col-md-12 card mb-2 mr-2 p-0"
    >
      <div class="card-header">
        <div v-if="item.replicas == 0" class="label label-rounded label-error">
          Not Active
        </div>
        <div
          v-else-if="item.replicas < item.minReplicators"
          class="label label-rounded label-warning"
        >
          Pending
        </div>
        <div v-else class="label label-rounded label-success">Active</div>
        <div class="card-title h5">
          <router-link
            :to="{ name: 'Drive Details', params: { cid: item.drive } }"
          >
            {{ item.drive.substr(0, 15) }}...
          </router-link>
        </div>
        <div class="card-subtitle text-gray">
          Created at Block&nbsp;{{ item.created }}
        </div>
      </div>
      <div class="card-body">
        <table class="table table-striped">
          <tbody>
            <tr>
              <td class="text-bold">Owner</td>
              <td>{{ item.owner.substr(0, 15) }}...</td>
            </tr>
            <tr>
              <td class="text-bold">Replicators</td>
              <td>
                <ul v-for="replicator in item.replicators" :key="replicator">
                  <li class="text-ellipsis">
                    {{ replicator.substr(0, 15) }}...
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td class="text-bold">Billing Price</td>
              <td>{{ item.billingPrice }} SO</td>
            </tr>
            <tr>
              <td class="text-bold">Billing Period</td>
              <td>
                {{ item.billingPeriod }}
                {{ item.billingPeriod > 1 ? "Blocks" : "Block" }}
              </td>
            </tr>
            <tr>
              <td class="text-bold">Min Replicators</td>
              <td>{{ item.minReplicators }}</td>
            </tr>
            <tr>
              <td class="text-bold">Percent Approvers</td>
              <td>{{ item.percentApprovers }} %</td>
            </tr>
            <tr>
              <td class="text-bold">Storage</td>
              <td>{{ item.space }} MB</td>
            </tr>
            <tr>
              <td class="text-bold">Root</td>
              <td>{{ item.root.substr(0, 15) }}...</td>
            </tr>
            <tr>
              <td class="text-bold">Duration</td>
              <td>{{ item.duration }} Blocks</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-footer text-center">
        <button class="btn">More</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";

export default {
  name: "DriveSummary",
  async setup() {
    const driveDetails = ref([]);

    const drives = await axios.get("mock/testnet1.dfms.io.json");
    drives.data.drives.forEach(async (contractKey) => {
      const driveDetail = await axios.get(
        `mock/testnet1.dfms.io/${contractKey}.json`
      );
      driveDetails.value.push(driveDetail.data.Contract);
    });

    return {
      driveDetails,
    };
  },
};
</script>
