<template>
    <div class="intermission-main">
        <opacity-swap-transition>
            <fitted-content
                :key="mainFlavorText"
                :max-width="950"
                class="flavor-text"
            >
                {{ mainFlavorText }}
            </fitted-content>
        </opacity-swap-transition>
        <div class="separator" />
        <intermission-main-info-row
            :value="nowPlaying"
            :visible="musicShown"
            icon="music"
        />
        <intermission-main-info-row
            :visible="nextRoundTimeVisible"
            icon="clock"
        >
            <span v-if="nextRoundStartDiffNow > 1">
                Resuming in <span class="minutes">~{{ nextRoundStartDiffNow }}</span> minutes...
            </span>
            <span v-else-if="nextRoundStartDiffNow === 1">
                Resuming in <span class="minutes">~{{ nextRoundStartDiffNow }}</span> minute...
            </span>
            <span v-else>
                The stream will resume soon!
            </span>
        </intermission-main-info-row>
    </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import FittedContent from '../../../components/FittedContent.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMusic } from '@fortawesome/free-solid-svg-icons/faMusic';
import { useReplicant } from 'nodecg-vue-composable';
import { MainFlavorText, MusicShown, NextRoundStartTime, NowPlaying } from 'schemas';
import { DASHBOARD_BUNDLE_NAME } from '../../../../shared/constants';
import { computed, ref, watch } from 'vue';
import IntermissionMainInfoRow from './IntermissionMainInfoRow.vue';
import { setNextStageTimer } from '../../../helpers/timerHelper';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';
import OpacitySwapTransition from '../../../components/OpacitySwapTransition.vue';
import { getSongNameAsString } from '../../../helpers/musicHelper';

library.add(faMusic, faClock);

export default defineComponent({
    name: 'IntermissionMain',

    components: { OpacitySwapTransition, IntermissionMainInfoRow, FittedContent },

    setup() {
        const mainFlavorText = useReplicant<MainFlavorText>('mainFlavorText', DASHBOARD_BUNDLE_NAME);
        const nowPlaying = useReplicant<NowPlaying>('nowPlaying', DASHBOARD_BUNDLE_NAME);
        const musicShown = useReplicant<MusicShown>('musicShown', DASHBOARD_BUNDLE_NAME);
        const nextRoundStartTime = useReplicant<NextRoundStartTime>('nextRoundStartTime', DASHBOARD_BUNDLE_NAME);
        const nextRoundStartDiffNow = ref(0);

        watch(() => nextRoundStartTime.data?.startTime, startTime => {
            setNextStageTimer(startTime, (newValue) => nextRoundStartDiffNow.value = newValue);
        }, { immediate: true });

        return {
            nowPlaying: computed(() => getSongNameAsString(nowPlaying.data)),
            musicShown: computed(() => musicShown.data ?? true),
            nextRoundStartDiffNow,
            nextRoundTimeVisible: computed(() => nextRoundStartTime.data?.isVisible ?? false),
            mainFlavorText: computed(() => mainFlavorText.data ?? '')
        };
    }
});
</script>

<style lang="scss">
@import '../../../styles/constants';

.intermission-main {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .flavor-text {
        font-size: 64px;
        height: 90px;
        margin-bottom: 5px;
    }

    .separator {
        width: 400px;
        height: 3px;
        background-color: $accent-yellow;
        margin: 8px 0;
    }

    span.minutes {
        font-size: 45px;
    }
}
</style>
