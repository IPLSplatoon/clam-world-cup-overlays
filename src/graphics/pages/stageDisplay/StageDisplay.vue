<template>
    <div class="stage-display-wrapper">
        <transition
            v-for="(game, index) in games"
            :key="`game_${index}`"
            mode="out-in"
            @enter="stageEnter"
            @leave="stageLeave"
            @before-enter="beforeStageEnter"
        >
            <div
                :key="`${matchId}_${index}_${game.mode}_${game.stage}`"
                class="stage"
                :data-stage="game.stage"
                :class="{
                    darkened: shouldDarkenImage(game.winner),
                    'darken-text': game.winner === 'none',
                    [`game-count-${games.length}`]: true
                }"
            >
                <div class="stage-content">
                    <div class="stage-data">
                        <div class="stage-mode">{{ game.mode }}</div>
                        <div class="stage-name">{{ game.stage }}</div>
                    </div>
                    <opacity-swap-transition>
                        <div
                            v-if="game.winner !== 'none'"
                            :key="winnerNames[index].name"
                            class="stage-winner"
                        >
                            <div class="stage-winner-name">{{ winnerNames[index].name }}</div>
                            <div
                                v-if="!isBlank(winnerNames[index].romanizedName)"
                                class="secondary-name"
                            >
                                {{ winnerNames[index].romanizedName }}
                            </div>
                        </div>
                    </opacity-swap-transition>
                    <div class="covers-content stage-background" />
                    <div class="covers-content darkened-background" />
                    <div
                        class="covers-content stage-image"
                        :style="{ backgroundImage: `url('${getStageImagePath(game.stage)}')` }"
                    />
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import { useReplicant } from 'nodecg-vue-composable';
import { DASHBOARD_BUNDLE_NAME } from '../../../shared/constants';
import { ActiveRound } from 'schemas';
import { computed, onMounted } from 'vue';
import OpacitySwapTransition from '../../components/OpacitySwapTransition.vue';
import gsap from 'gsap';
import { getStageImagePath, loadAndCheckIfImageExists } from '../../helpers/imageHelper';
import { addDots } from '../../../shared/helpers/stringHelper';
import { bindEntranceToTimelineGenerator } from '../../helpers/obsSourceHelper';
import { isBlank } from '@iplsplatoon/vue-components';

const STAGE_SHOW_HIDE_ANIMATION_DURATION = 0.35;

export default defineComponent({
    name: 'StageDisplay',

    components: { OpacitySwapTransition },

    setup() {
        const activeRound = useReplicant<ActiveRound>('activeRound', DASHBOARD_BUNDLE_NAME);
        const games = computed(() => activeRound.data?.games);

        onMounted(() => {
            bindEntranceToTimelineGenerator(() => {
                const revealTl = gsap.timeline({ delay: 0.5 });

                revealTl
                    .fromTo(
                        '.stage', {
                            y: -35,
                            opacity: 0
                        }, {
                            duration: STAGE_SHOW_HIDE_ANIMATION_DURATION,
                            y: 0,
                            opacity: 1,
                            ease: 'power2.out',
                            stagger: 0.08,
                            delay: 0.1
                        });

                return revealTl;
            });
        });

        return {
            games,
            shouldDarkenImage: (winner: string) => (winner !== 'none' || activeRound.data?.match.isCompleted),
            winnerNames: computed(() => games.value?.map(game => {
                switch (game.winner) {
                    case 'alpha':
                        return {
                            name: addDots(activeRound.data?.teamA.name),
                            romanizedName: addDots(activeRound.data?.teamA.romanizedName as string | undefined)
                        };
                    case 'bravo':
                        return {
                            name: addDots(activeRound.data?.teamB.name),
                            romanizedName: addDots(activeRound.data?.teamB.romanizedName as string | undefined)
                        };
                    default:
                        return { name: undefined, romanizedName: undefined };
                }
            })),
            matchId: computed(() => activeRound.data?.match.id),
            getStageImagePath,
            isBlank,

            async stageEnter(elem: HTMLElement, done: gsap.Callback) {
                await loadAndCheckIfImageExists(getStageImagePath(elem.dataset.stage));
                gsap.to(elem, {
                    duration: STAGE_SHOW_HIDE_ANIMATION_DURATION,
                    opacity: 1,
                    y: 0,
                    ease: 'power2.out',
                    onComplete: done
                });
            },
            beforeStageEnter(elem: HTMLElement) {
                gsap.set(elem, { y: -35, opacity: 0 });
            },
            stageLeave(elem: HTMLElement, done: gsap.Callback) {
                gsap.to(elem, {
                    duration: STAGE_SHOW_HIDE_ANIMATION_DURATION,
                    opacity: 0,
                    y: 35,
                    ease: 'power2.in',
                    onComplete: done
                });
            }
        };
    }
});
</script>

<style lang="scss">
@import '../../styles/constants';

.stage-display-wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 20px;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    .stage {
        height: 650px;

        &.game-count-7 {
            width: 225px;
        }

        &.game-count-5 {
            width: 300px;
        }

        &.game-count-3 {
            width: 325px;
        }

        &:not(:last-child) {
            margin-right: 35px;
        }

        &.darkened {
            .darkened-background {
                background-color: rgba(34, 34, 34, 0.5) !important;
            }

            .stage-content {
                filter: drop-shadow(-2px 2px 4px $drop-shadow-color), grayscale(0.5);
            }

            &.darken-text {
                .stage-data {
                    color: #AAA !important;
                }
            }
        }

        .stage-content {
            width: 100%;
            height: 100%;
            border-radius: $default-border-radius;
            position: relative;
            display: flex;
            align-items: flex-end;
            color: white;

            @supports (overflow-wrap: anywhere) {
                outline: 4px solid $text-background;
            }

            @supports not (overflow-wrap: anywhere) {
                &:after {
                    content: '';
                    position: absolute;
                    left: -4px;
                    top: -4px;
                    width: 100%;
                    height: 100%;
                    border: 4px solid $text-background;
                    border-radius: $default-border-radius;
                }
            }

            .stage-winner {
                position: absolute;
                width: calc(100% - 24px);
                top: 0;
                left: 0;
                z-index: 2;
                margin: 8px 12px;
                overflow-wrap: anywhere;
                max-height: 340px;
                overflow: hidden;
                filter: drop-shadow(0 0 4px rgba(34, 34, 34, 0.75));

                @supports not (overflow-wrap: anywhere) {
                    word-break: break-all;
                }

                .stage-winner-name {
                    font-size: 28px;
                    line-height: 36px;
                }

                .secondary-name {
                    font-size: 20px;
                    line-height: 28px;
                    opacity: 90%;
                }
            }

            .stage-data {
                position: absolute;
                width: calc(100% - 24px);
                bottom: 0;
                left: 0;
                z-index: 2;
                margin: 8px 12px;
                filter: drop-shadow(0 0 4px $drop-shadow-color);
                transition: color 500ms;

                .stage-name {
                    font-size: 36px;
                    line-height: 43px;
                    border-top: 2px solid $accent-yellow;
                    padding-top: 3px;
                    margin-bottom: 5px;
                }

                .stage-mode {
                    font-size: 26px;
                    line-height: 32px;
                    margin-bottom: 5px;
                }
            }

            .covers-content {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                border-radius: $default-border-radius;
            }

            .stage-background {
                background: linear-gradient(to top, rgba(34, 34, 34, 0.9) 0%, rgba(34, 34, 34, 0) 75%);
            }

            .darkened-background {
                background-color: rgba(34, 34, 34, 0);
                transition: background-color 500ms;
            }

            .stage-image {
                z-index: -1;
                background-position: center;
                background-size: cover;
                background-repeat: no-repeat;
                opacity: 99%;
            }
        }
    }
}
</style>
