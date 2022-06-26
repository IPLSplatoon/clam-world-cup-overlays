<template>
    <div
        class="team-roster"
        :class="position === '1' ? 'position-1' : 'position-2'"
    >
        <div class="team-roster-content">
            <div class="team-name-wrapper">
                <fitted-content
                    v-if="!isBlank(teamData?.romanizedName)"
                    :max-width="450"
                    class="team-name secondary-name"
                    align="center"
                >
                    <span>{{ addDots(teamData?.romanizedName) }}</span>
                </fitted-content>
                <fitted-content
                    :max-width="450"
                    class="team-name"
                    align="center"
                >
                    <span>{{ addDots(teamData?.name) }}</span>
                </fitted-content>
            </div>
            <div class="players">
                <div
                    v-for="player in players"
                    :key="player.name"
                >
                    <fitted-content
                        v-if="!isBlank(player.romanizedName)"
                        :max-width="450"
                        class="team-player secondary-name"
                        align="center"
                    >
                        {{ addDots(player.romanizedName) }}
                    </fitted-content>
                    <fitted-content
                        :max-width="450"
                        class="team-player"
                        :align="position === '1' ? 'left' : 'right'"
                    >
                        {{ addDots(player.name) }}
                    </fitted-content>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import { computed, PropType } from 'vue';
import { useReplicant } from 'nodecg-vue-composable';
import { ActiveRound } from 'schemas';
import { DASHBOARD_BUNDLE_NAME } from '../../../../shared/constants';
import FittedContent from '../../../components/FittedContent.vue';
import { addDots } from '../../../../shared/helpers/stringHelper';
import { isBlank } from '@iplsplatoon/vue-components';
import { TeamPronounData } from 'types/schemas';

export default defineComponent({
    name: 'TeamRoster',

    components: { FittedContent },

    props: {
        team: {
            type: String as PropType<'A' | 'B'>,
            required: true
        },
        position: {
            type: String as PropType<'1' | '2'>,
            required: true
        }
    },

    setup(props) {
        const teamPronounData = useReplicant<TeamPronounData>('teamPronounData', undefined);
        const activeRound = useReplicant<ActiveRound>('activeRound', DASHBOARD_BUNDLE_NAME);
        const teamData = computed(() => props.team === 'A' ? activeRound.data?.teamA : activeRound.data?.teamB);

        return {
            teamData,
            players: computed(() => teamData.value?.players.slice(0, 5)),
            addDots,
            isBlank,
            pronounsVisible: computed(() => props.team === 'A' ? teamPronounData.data?.teamA : teamPronounData.data?.teamB)
        };
    }
});
</script>

<style lang="scss">
@import '../../../styles/constants';

.team-roster {
    width: 500px;
    height: 475px;
    margin: 0 45px;

    &.position-1 {
        .players {
            align-items: flex-start;
        }

        .team-image {
            right: -25px;
        }
    }

    &.position-2 {
        .players {
            align-items: flex-end;
        }

        .team-image {
            left: -25px;
        }
    }

    .team-roster-content {
        width: 100%;
        height: 100%;
        border-radius: $default-border-radius;
        filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.2));
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
        @include striped-background();

        .team-name-wrapper {
            background-color: rgba(14, 14, 14, 0.8);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
            border-bottom: 2px solid $accent-yellow;
            height: 120px;
        }

        .team-name {
            font-size: 50px;

            &.secondary-name {
                font-size: 25px;
                margin-bottom: -8px;
            }
        }

        .players {
            width: calc(100% - 48px);
            margin: 5px 24px 10px;
            display: flex;
            flex-direction: column;
        }

        .team-player {
            font-size: 40px;
            height: 55px;

            &.secondary-name {
                font-size: 22px;
                height: 30px;
                margin-bottom: -5px;
                margin-top: 3px;
            }
        }
    }
}
</style>
