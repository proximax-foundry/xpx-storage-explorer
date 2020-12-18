<template>
  <div class="text-center">
    <h3>Drives</h3>
    <router-link to="/drives" class="btn btn-link">View All</router-link>
  </div>
  <div class="columns">
    <div
      v-for="item in driveDetails"
      :key="item.Id"
      class="column col-md-12 card mb-2 mr-2 p-0"
    >
      <div class="card-header">
        <div v-if="item.state == 1" class="label label-rounded label-warning">
          Pending
        </div>
        <div
          v-else-if="item.state == 2"
          class="label label-rounded label-success"
        >
          Active
        </div>
        <div
          v-else-if="item.state == 3"
          class="label label-rounded label-error"
        >
          Completed
        </div>
        <div v-else class="label label-rounded">Not Active</div>
        <div class="card-title h5">
          <router-link
            :to="{ name: 'Drive Details', params: { cid: [item.Id] } }"
          >
            {{ item.Id.substr(0, 15) }}...
          </router-link>
        </div>
        <div class="card-subtitle text-gray">
          Created at Block {{ $filters.numberArrayToCompact(item.start) }}
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
                    {{ replicator.replicator.substr(0, 15) }}...
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td class="text-bold">Billing Price</td>
              <td>{{ $filters.numberArrayToCompact(item.billingPrice) }} SO</td>
            </tr>
            <tr>
              <td class="text-bold">Billing Period</td>
              <td>
                {{ $filters.numberArrayToCompact(item.billingPeriod) }} Block(s)
              </td>
            </tr>
            <tr>
              <td class="text-bold">Current Replicas</td>
              <td>{{ item.replicas }}</td>
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
              <td class="text-bold">Storage Used</td>
              <td>
                {{
                  $filters.bytesToSize(
                    $filters.numberArrayToCompact(item.occupiedSpace)
                  )
                }}
              </td>
            </tr>
            <tr>
              <td class="text-bold">Storage</td>
              <td>
                {{
                  $filters.bytesToSize($filters.numberArrayToCompact(item.size))
                }}
              </td>
            </tr>
            <tr>
              <td class="text-bold">Duration</td>
              <td>{{ $filters.numberArrayToCompact(item.duration) }} Blocks</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-footer text-center">
        <router-link
          :to="{ name: 'Drive Details', params: { cid: [item.Id] } }"
          class="btn"
        >
          More
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, inject, ref } from "vue";
import axios from "axios";

export default {
  name: "DriveSummary",
  async setup() {
    const internalInstance = getCurrentInstance();
    const siriusStore = inject("siriusStore");
    const driveDetails = ref([]);

    const drives = await axios.get(
      "http://testnet1.dfms.io:6366/api/v1/contract/ls"
    );
    drives.data.Ids.forEach(async (id) => {
      const resp = await axios.get(
        `${
          siriusStore.state.selectedNode
        }/drive/${internalInstance.appContext.config.globalProperties.$filters.cidToPublicKey(
          id
        )}`
      );

      resp.data.drive.Id = id;
      driveDetails.value.push(resp.data.drive);
    });

    return {
      driveDetails,
    };
  },
};
</script>
