<template>
    <opacity-swap-transition>
        <fitted-content
            :key="`${teamAName}_${teamBName}`"
            :max-width="1300"
        >
            <div class="next-round-content-wrapper">
                <span class="next-up font-numeric">Next up:</span>
                <div class="team-name-container">
                    <div
                        v-if="!isBlank(teamA?.romanizedName)"
                        class="secondary-name"
                    >
                        {{ addDots(teamA?.romanizedName) }}
                    </div>
                    <div class="team-name">{{ addDots(teamA?.name) }}</div>
                </div>
                <span class="versus">vs</span>
                <div class="team-name-container">
                    <div
                        v-if="!isBlank(teamB?.romanizedName)"
                        class="secondary-name"
                    >
                        {{ addDots(teamB?.romanizedName) }}
                    </div>
                    <div class="team-name">{{ addDots(teamB?.name) }}</div>
                </div>
            </div>
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
import { isBlank } from '@iplsplatoon/vue-components';

export default defineComponent({
    name: 'LowerThirdNextRound',

    components: { FittedContent, OpacitySwapTransition },

    setup() {
        const nextRound = useReplicant<NextRound>('nextRound', DASHBOARD_BUNDLE_NAME);

        return {
            teamA: computed(() => nextRound.data?.teamA),
            teamB: computed(() => nextRound.data?.teamB),
            addDots,
            isBlank
        };
    }
});
</script>

<style lang="scss">
@import '../../../styles/constants';

.next-round-content-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;

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

    .team-name-container {
        text-align: center;
    }

    .secondary-name {
        font-size: 22px;
        margin-bottom: -10px;
    }
}
</style>
