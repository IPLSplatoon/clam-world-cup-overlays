<template>
    <div class="lower-third-active-round">
        <opacity-swap-transition>
            <fitted-content
                :key="`${teamA?.name}_${teamB?.name}`"
                :max-width="1400"
            >
                <span class="team-name">{{ addDots(teamA?.name) }}</span>
                <span class="scores font-numeric">{{ teamA?.score }} - {{ teamB?.score }}</span>
                <span class="team-name">{{ addDots(teamB?.name) }}</span>
            </fitted-content>
        </opacity-swap-transition>
    </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import OpacitySwapTransition from '../../../components/OpacitySwapTransition.vue';
import FittedContent from '../../../components/FittedContent.vue';
import { useReplicant } from 'nodecg-vue-composable';
import { DASHBOARD_BUNDLE_NAME } from '../../../../shared/constants';
import { ActiveRound } from 'schemas';
import { computed } from 'vue';
import { addDots } from '../../../../shared/helpers/stringHelper';

export default defineComponent({
    name: 'LowerThirdActiveRound',

    components: { FittedContent, OpacitySwapTransition },

    setup() {
        const activeRound = useReplicant<ActiveRound>('activeRound', DASHBOARD_BUNDLE_NAME);
        const teamA = computed(() => activeRound.data?.teamA);
        const teamB = computed(() => activeRound.data?.teamB);

        return {
            teamA,
            teamB,
            addDots
        };
    }
});
</script>

<style lang="scss">
@import '../../../styles/constants';

.lower-third-active-round {
    .team-name {
        font-size: 40px;
    }

    .scores {
        margin: 0 12px;
        color: $accent-yellow;
        font-weight: 700;
        font-size: 42px;
    }
}
</style>
