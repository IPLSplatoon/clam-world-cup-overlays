<template>
    <opacity-swap-transition>
        <fitted-content
            :key="`${teamAName}_${teamBName}`"
            :max-width="1300"
        >
            <span class="next-up font-numeric">Next up:</span>
            <span class="team-name">{{ addDots(teamAName) }}</span>
            <span class="versus">vs</span>
            <span class="team-name">{{ addDots(teamBName) }}</span>
        </fitted-content>
    </opacity-swap-transition>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import { useReplicant } from 'nodecg-vue-composable';
import { NextRound } from 'schemas';
import { DASHBOARD_BUNDLE_NAME } from '../../../../shared/constants';
import { computed } from 'vue';
import OpacitySwapTransition from '../../../components/OpacitySwapTransition.vue';
import FittedContent from '../../../components/FittedContent.vue';
import { addDots } from '../../../../shared/helpers/stringHelper';

export default defineComponent({
    name: 'LowerThirdNextRound',

    components: { FittedContent, OpacitySwapTransition },

    setup() {
        const nextRound = useReplicant<NextRound>('nextRound', DASHBOARD_BUNDLE_NAME);

        return {
            teamAName: computed(() => nextRound.data?.teamA.name),
            teamBName: computed(() => nextRound.data?.teamB.name),
            addDots
        };
    }
});
</script>

<style lang="scss">
@import '../../../styles/constants';

.next-up {
    color: $accent-yellow;
    margin-right: 10px;
}

.team-name {
    font-size: 40px;
}

.versus {
    margin: 0 9px;
}
</style>
