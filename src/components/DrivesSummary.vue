<template>
  <div class="text-center">
    <h3>Drives</h3>
    <router-link to="/drives" class="btn btn-link">View All</router-link>
  </div>
  <ErrorState v-if="errorMessage" :err="errorMessage" />
  <template v-else>
    <LoadingState v-if="drives.length == 0" />
    <div v-else class="columns">
      <div
        v-for="item in drives"
        :key="item.drive.multisig"
        class="column col-4 col-md-12 my-2"
      >
        <div class="card">
          <div class="card-header">
            <div
              v-if="item.drive.state == 1"
              class="label label-rounded label-warning"
            >
              Pending
            </div>
            <div
              v-else-if="item.drive.state == 2"
              class="label label-rounded label-success"
            >
              Active
            </div>
            <div
              v-else-if="item.drive.state == 3"
              class="label label-rounded label-error"
            >
              Completed
            </div>
            <div v-else class="label label-rounded">Not Active</div>
            <div class="card-title h5">
              <router-link
                :to="{
                  name: 'Drive',
                  params: {
                    cid: [$filters.publicKeyToCID(item.drive.multisig)],
                  },
                }"
              >
                {{
                  $filters.publicKeyToCID(item.drive.multisig).substr(0, 15)
                }}...
              </router-link>
            </div>
            <div class="card-subtitle text-gray">
              Created at Block
              {{ $filters.numberArrayToCompact(item.drive.start) }}
            </div>
          </div>
          <div class="card-body text-break">
            <table class="table table-striped">
              <tbody>
                <tr>
                  <td class="text-bold">Owner</td>
                  <td>{{ item.drive.owner.substr(0, 15) }}...</td>
                </tr>
                <tr>
                  <td class="text-bold">Duration</td>
                  <td>
                    {{ $filters.numberArrayToCompact(item.drive.duration) }}
                    Blocks
                  </td>
                </tr>
                <tr>
                  <td class="text-bold">Storage Used</td>
                  <td>
                    {{
                      $filters.bytesToSize(
                        $filters.numberArrayToCompact(item.drive.occupiedSpace)
                      )
                    }}
                  </td>
                </tr>
                <tr>
                  <td class="text-bold">Storage</td>
                  <td>
                    {{
                      $filters.bytesToSize(
                        $filters.numberArrayToCompact(item.drive.size)
                      )
                    }}
                  </td>
                </tr>
                <tr>
                  <td class="text-bold">Billing Price</td>
                  <td>
                    {{ $filters.numberArrayToCompact(item.drive.billingPrice) }}
                    SO
                  </td>
                </tr>
                <tr>
                  <td class="text-bold">Billing Period</td>
                  <td>
                    {{
                      $filters.numberArrayToCompact(item.drive.billingPeriod)
                    }}
                    Block(s)
                  </td>
                </tr>
                <tr>
                  <td class="text-bold">Current Replicas</td>
                  <td>{{ item.drive.replicas }}</td>
                </tr>
                <tr>
                  <td class="text-bold">Min Replicators</td>
                  <td>{{ item.drive.minReplicators }}</td>
                </tr>
                <tr>
                  <td class="text-bold">Percent Approvers</td>
                  <td>{{ item.drive.percentApprovers }} %</td>
                </tr>
                <tr v-if="item.drive.replicators.length > 0">
                  <td class="text-bold">Replicators</td>
                  <td>
                    <ul
                      v-for="replicator in item.drive.replicators"
                      :key="replicator.replicator"
                    >
                      <li>{{ replicator.replicator.substr(0, 15) }}...</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="card-footer text-center">
            <router-link
              :to="{
                name: 'Drive',
                params: { cid: [$filters.publicKeyToCID(item.drive.multisig)] },
              }"
              class="btn"
            >
              More
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import ErrorState from "@/components/ErrorState.vue";
import LoadingState from "@/components/LoadingState.vue";
import { inject, onMounted, ref, watch } from "vue";
import axios from "axios";

export default {
  name: "DriveSummary",
  components: {
    ErrorState,
    LoadingState,
  },
  setup() {
    const siriusStore = inject("siriusStore");
    const drives = ref([]);
    const errorMessage = ref(null);

    const loadDetails = async () => {
      try {
        const contracts = await axios.get(
          `${siriusStore.state.selectedChainNode}/drives`
        );

        drives.value = contracts.data.data.slice(0, 6);
      } catch (err) {
        console.error("Drives Error", err);
        errorMessage.value = "Unable to fetch list of drives from node";
      }
    };

    onMounted(async () => {
      await loadDetails();
    });

    watch(
      () => siriusStore.state.selectedChainNode,
      async () => {
        drives.value = [];
        errorMessage.value = null;
        await loadDetails();
      }
    );

    return {
      drives,
      errorMessage,
    };
  },
};
</script>
