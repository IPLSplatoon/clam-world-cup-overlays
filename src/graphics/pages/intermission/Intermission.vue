<template>
    <div class="intermission-wrapper">
        <div class="intermission-main-content">
            <div class="intermission-slides">
                <transition
                    mode="out-in"
                    @leave="slideLeave"
                    @enter="slideEnter"
                    @before-enter="beforeSlideEnter"
                >
                    <component :is="activeBreakSlide" />
                </transition>
            </div>
        </div>
        <div class="intermission-main-content-broadcasters">
            <img
                class="ipl-streamed-logo"
                src="/bundles/clam-world-cup-overlays/assets/ipl-streamed-logo.png"
            >
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import IntermissionMain from './components/IntermissionMain.vue';
import IntermissionNextUp from './components/IntermissionNextUp.vue';
import { computed } from 'vue';
import { useReplicant } from 'nodecg-vue-composable';
import { DASHBOARD_BUNDLE_NAME } from '../../../shared/constants';
import { NextRound } from 'schemas';
import gsap from 'gsap';
import { useSlides } from '../../helpers/useSlides';
import OpacitySwapTransition from '../../components/OpacitySwapTransition.vue';

export default defineComponent({
    name: 'Intermission',

    components: { OpacitySwapTransition, IntermissionMain, IntermissionNextUp },

    setup() {
        const nextRound = useReplicant<NextRound>('nextRound', DASHBOARD_BUNDLE_NAME);

        const slides = useSlides([
            { component: 'IntermissionMain' },
            { component: 'IntermissionNextUp', enabled: computed(() => nextRound.data?.showOnStream) }
        ]);

        return {
            activeBreakSlide: slides.activeComponent,
            slideLeave(elem: HTMLElement, done: gsap.Callback) {
                gsap.to(elem, { y: 15, opacity: 0, ease: 'power2.in', duration: 0.5, onComplete: done });
            },
            beforeSlideEnter(elem: HTMLElement) {
                gsap.set(elem, { y: -15, opacity: 0 });
            },
            slideEnter(elem: HTMLElement, done: gsap.Callback) {
                gsap.to(elem, { y: 0, opacity: 1, ease: 'power2.out', duration: 0.5, onComplete: done });
            }
        };
    }
});
</script>

<style lang="scss">
@import '../../styles/constants';

.intermission-wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.intermission-main-content {
    @include striped-background(rgba(21, 21, 21, 0.99), rgba(14, 14, 14, 0.99));
    filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.2));
    border-radius: $default-border-radius;
    width: 1000px;
    height: 400px;
    z-index: 100;
    padding: 15px 25px;
    display: flex;
    justify-content: center;

    > .intermission-slides {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
    }
}

.intermission-main-content-broadcasters {
    position: absolute;
    bottom: 15px;
    image-rendering: -webkit-optimize-contrast;
    filter: drop-shadow(0 0 1px rgba(34, 34, 34, 1));

    > .ipl-streamed-logo {
        height: 60px;
    }
}
</style>
