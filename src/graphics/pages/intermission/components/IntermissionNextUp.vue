<template>
    <div class="intermission-next-up">
        <div class="title">Next up</div>
        <div class="separator" />
        <opacity-swap-transition>
            <fitted-content
                :key="`${teamA?.name}_${teamB?.name}`"
                :max-width="850"
                class="next-team-names"
            >
                <div class="team-name-content-wrapper">
                    <div class="team-name-container">
                        <div
                            v-if="!isBlank(teamA?.romanizedName)"
                            class="secondary-name"
                        >
                            {{ teamA?.romanizedName }}
                        </div>
                        <div class="team-name">{{ teamA?.name }}</div>
                    </div>
                    <span class="versus">vs</span>
                    <div class="team-name-container">
                        <div
                            v-if="!isBlank(teamB?.romanizedName)"
                            class="secondary-name"
                        >
                            {{ teamB?.romanizedName }}
                        </div>
                        <div class="team-name">{{ teamB?.name }}</div>
                    </div>
                </div>
            </fitted-content>
        </opacity-swap-transition>
        <span class="round-type">{{ roundType }}</span>
        <div class="next-games">
            <div
                v-for="(game, index) in nextGames"
                :key="`${index}_${game.mode}_${game.stage}`"
                class="next-game"
                :class="{ 'faded': moreGamesPresent && index === 2 }"
                :style="{ backgroundImage: `url('${getStageImagePath(game.stage)}')` }"
            >
                <div class="content-background" />
                <div class="stage-data">
                    <div class="mode">{{ game.mode }}</div>
                    <div class="stage">{{ game.stage }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import OpacitySwapTransition from '../../../components/OpacitySwapTransition.vue';
import FittedContent from '../../../components/FittedContent.vue';
import { useReplicant } from 'nodecg-vue-composable';
import { DASHBOARD_BUNDLE_NAME } from '../../../../shared/constants';
import { NextRound } from 'schemas';
import { computed } from 'vue';
import { getStageImagePath } from '../../../helpers/imageHelper';
import { isBlank } from '@iplsplatoon/vue-components';

export default defineComponent({
    name: 'IntermissionNextUp',

    components: {
        OpacitySwapTransition,
        FittedContent
    },

    setup() {
        const nextRound = useReplicant<NextRound>('nextRound', DASHBOARD_BUNDLE_NAME);

        return {
            teamA: computed(() => nextRound.data?.teamA),
            teamB: computed(() => nextRound.data?.teamB),
            nextGames: computed(() => nextRound.data?.games.slice(0, 3)),
            moreGamesPresent: computed(() => nextRound.data?.games.length > 3),
            roundType: computed(() => {
                const gameCount = nextRound.data?.games.length;
                return nextRound.data?.round.type === 'PLAY_ALL' ? `Play all ${gameCount}` : `Best of ${gameCount}`;
            }),
            getStageImagePath,
            isBlank
        };
    }
});
</script>

<style lang="scss">
@import '../../../styles/constants';

.intermission-next-up {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: -10px;

    .title {
        font-size: 56px;
    }

    .separator {
        width: 400px;
        height: 3px;
        background-color: $accent-yellow;
        margin: 8px 0 16px;
    }

    .next-team-names {
        margin: 5px 0;
        font-size: 40px;

        .team-name-content-wrapper {
            display: flex;
            align-items: center;
            height: 86px;
        }

        .team-name-container {
            text-align: center;
        }

        .team-name {
            font-size: 42px;
        }

        .secondary-name {
            font-size: 24px;
            margin-bottom: -10px;
        }

        .versus {
            margin: 0 10px;
            color: $accent-yellow;
        }
    }

    .round-type {
        font-size: 28px;
        font-style: italic;
    }

    .next-games {
        display: flex;
        margin-top: 15px;
        height: 135px;

        .next-game {
            width: 235px;
            height: 135px;
            background-size: cover;
            background-position: center;
            border-radius: $default-border-radius;
            margin-right: 16px;
            color: white;
            position: relative;
            overflow: hidden;
            text-align: left;

            @supports not (overflow-wrap: anywhere) {
                border: 3px solid rgba(255, 255, 255, 0.35);
            }

            @supports (overflow-wrap: anywhere) {
                outline: 3px solid rgba(255, 255, 255, 0.35);
            }

            &.faded {
                opacity: 0.7;
            }

            > .content-background {
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
                background-color: rgba(34, 34, 34, 0.6);
            }

            > .stage-data {
                position: absolute;
                bottom: 8px;
                left: 0;
                z-index: 100;
                line-height: 30px;
                filter: drop-shadow(0 0 4px #222);
                margin: 0 10px;

                .mode {
                    font-size: 22px;
                    margin-bottom: 2px;
                }

                .stage {
                    font-size: 24px;
                    border-top: 2px solid $accent-yellow;
                    padding-top: 2px;
                }
            }
        }
    }
}
</style>
