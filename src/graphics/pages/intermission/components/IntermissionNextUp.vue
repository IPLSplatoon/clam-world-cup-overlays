<template>
    <div class="intermission-next-up">
        <div class="title">Next up</div>
        <div class="separator" />
        <opacity-swap-transition>
            <fitted-content
                :key="`${teamAName}_${teamBName}`"
                :max-width="850"
                class="next-team-names"
            >
                <span class="team-name">{{ teamAName }}</span>
                vs
                <span class="team-name">{{ teamBName }}</span>
                <br>
                <span class="round-type">{{ roundType }}</span>
            </fitted-content>
        </opacity-swap-transition>
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

export default defineComponent({
    name: 'IntermissionNextUp',

    components: {
        OpacitySwapTransition,
        FittedContent
    },

    setup() {
        const nextRound = useReplicant<NextRound>('nextRound', DASHBOARD_BUNDLE_NAME);

        return {
            teamAName: computed(() => nextRound.data?.teamA.name),
            teamBName: computed(() => nextRound.data?.teamB.name),
            nextGames: computed(() => nextRound.data?.games.slice(0, 3)),
            moreGamesPresent: computed(() => nextRound.data?.games.length > 3),
            roundType: computed(() => {
                const gameCount = nextRound.data?.games.length;
                return nextRound.data?.round.type === 'PLAY_ALL' ? `Play all ${gameCount}` : `Best of ${gameCount}`;
            }),
            getStageImagePath
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

    .title {
        font-size: 56px;
        height: 72px;
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
        line-height: 35px;

        .team-name {
            font-size: 42px;
        }

        .round-type {
            font-size: 28px;
            font-style: italic;
        }
    }

    .next-games {
        display: flex;
        margin-top: 15px;

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
