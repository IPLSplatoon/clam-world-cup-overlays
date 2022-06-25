<template>
    <div class="lower-third-active-round">
        <opacity-swap-transition>
            <fitted-content
                :key="`${teamA?.name}_${teamB?.name}`"
                :max-width="1400"
            >
                <div class="team-name-content-wrapper">
                    <div class="team-name-container">
                        <div
                            v-if="!isBlank(teamA?.romanizedName)"
                            class="secondary-name"
                        >
                            {{ addDots(teamA?.romanizedName) }}
                        </div>
                        <div class="team-name">{{ addDots(teamA?.name) }}</div>
                    </div>
                    <span class="scores font-numeric">{{ teamA?.score }} - {{ teamB?.score }}</span>
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
import { isBlank } from '@iplsplatoon/vue-components';

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
            addDots,
            isBlank
        };
    }
});
</script>

<style lang="scss">
@import '../../../styles/constants';

.lower-third-active-round {
    .team-name-content-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .team-name {
        font-size: 40px;
    }

    .team-name-container {
        text-align: center;
    }

    .secondary-name {
        font-size: 22px;
        margin-bottom: -10px;
    }

    .scores {
        margin: 0 12px;
        color: $accent-yellow;
        font-size: 42px;
    }
}
</style>
