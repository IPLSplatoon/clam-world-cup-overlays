<template>
    <transition
        @enter="scoreboardEnter"
        @leave="scoreboardLeave"
        @before-enter="beforeScoreboardEnter"
    >
        <div
            v-if="scoreboardData.data?.isVisible"
            class="scoreboard-wrapper"
        >
            <div class="scoreboard-teams">
                <div class="scoreboard-team-layout">
                    <opacity-swap-transition>
                        <fitted-content
                            :key="teamAName"
                            :max-width="290"
                            class="team-name"
                            align="right"
                        >
                            {{ teamAName }}
                        </fitted-content>
                    </opacity-swap-transition>
                    <div class="team-score font-numeric">
                        {{ teamA?.score }}
                    </div>
                    <div
                        class="team-color"
                        :style="{ backgroundColor: teamA?.color }"
                    />
                    <div class="separator" />
                    <div />
                    <div />
                    <opacity-swap-transition>
                        <fitted-content
                            :key="teamBName"
                            :max-width="290"
                            class="team-name"
                            align="right"
                        >
                            {{ teamBName }}
                        </fitted-content>
                    </opacity-swap-transition>
                    <div class="team-score font-numeric">
                        {{ teamB?.score }}
                    </div>
                    <div
                        class="team-color"
                        :style="{ backgroundColor: teamB?.color }"
                    />
                </div>
            </div>
            <div class="scoreboard-extra">
                <div class="scoreboard-tournament-logo" />
                <opacity-swap-transition>
                    <fitted-content
                        :key="scoreboardData.data?.flavorText"
                        :max-width="280"
                        class="flavor-text"
                        align="right"
                    >
                        {{ scoreboardData.data?.flavorText }}
                    </fitted-content>
                </opacity-swap-transition>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import FittedContent from '../../../components/FittedContent.vue';
import { computed } from 'vue';
import { useReplicant } from 'nodecg-vue-composable';
import { ActiveRound, ScoreboardData } from 'schemas';
import { DASHBOARD_BUNDLE_NAME } from '../../../../shared/constants';
import OpacitySwapTransition from '../../../components/OpacitySwapTransition.vue';
import { addDots } from '../../../../shared/helpers/stringHelper';
import gsap from 'gsap';

export default defineComponent({
    name: 'Scoreboard',

    components: { OpacitySwapTransition, FittedContent },

    setup() {
        const activeRound = useReplicant<ActiveRound>('activeRound', DASHBOARD_BUNDLE_NAME);
        const teamA = computed(() => activeRound.data?.teamA);
        const teamB = computed(() => activeRound.data?.teamB);

        const scoreboardData = useReplicant<ScoreboardData>('scoreboardData', DASHBOARD_BUNDLE_NAME);

        return {
            teamA,
            teamB,
            teamAName: computed(() => addDots(teamA.value.name)),
            teamBName: computed(() => addDots(teamB.value.name)),
            scoreboardData,
            scoreboardEnter: (elem: HTMLElement, done: gsap.Callback) => {
                gsap.to(elem, { y: 0, opacity: 1, ease: 'power2.out', onComplete: done });
            },
            beforeScoreboardEnter: (elem: HTMLElement) => {
                gsap.set(elem, { y: -25, opacity: 0 });
            },
            scoreboardLeave: (elem: HTMLElement, done: gsap.Callback) => {
                gsap.to(elem, { y: -25, opacity: 0, ease: 'power2.in', onComplete: done });
            }
        };
    }
});
</script>

<style lang="scss">
@import '../../../styles/constants';

.scoreboard-wrapper {
    position: absolute;
    top: 30px;
    left: 30px;
    width: 380px;
    height: 170px;

    filter: drop-shadow(-2px 2px 4px $drop-shadow-color);

    > .scoreboard-teams {
        @include striped-background();
        position: relative;
        max-width: 100%;
        height: 105px;
        padding: 6px 4px 6px 16px;
        margin: 0;
        z-index: -2;
        overflow: hidden;
        border-radius: $default-border-radius $default-border-radius 0 0;

        > .scoreboard-team-layout {
            height: 100%;
            display: grid;
            column-gap: 16px;
            grid-template-rows: 1fr 2px 1fr;
            grid-template-columns: 290px 1fr 1fr;
            align-items: center;
            position: relative;
            z-index: 2;

            > .team-score {
                text-align: center;
                font-size: 36px;
                transition: color 500ms;
            }

            > .team-name {
                font-size: 30px;
                height: 42px;
            }

            > .separator {
                height: 100%;
                width: 100%;
                background-color: $accent-yellow;
            }

            > .team-color {
                width: 35px;
                height: 50px;
                border-radius: $default-border-radius;
                transition: background-color 500ms;
            }
        }
    }

    > .scoreboard-extra {
        height: 42px;
        border-radius: 0 0 $default-border-radius $default-border-radius;
        filter: drop-shadow(0 -2px 5px rgba(255, 255, 255, 0.35));
        background-color: $text-background;

        > .scoreboard-tournament-logo {
            position: absolute;
            width: 70px;
            height: 70px;
            background-image: url('/bundles/clam-world-cup-overlays/assets/logo-color-notext.png');
            background-size: contain;
            background-repeat: no-repeat;
            filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.25));
            transform: translate(10px, -5px);
            image-rendering: -webkit-optimize-contrast;
        }

        > .flavor-text {
            font-size: 28px;
            float: right;
            margin-right: 8px;
        }
    }
}
</style>
