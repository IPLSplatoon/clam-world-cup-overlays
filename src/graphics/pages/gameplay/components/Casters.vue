<template>
    <transition
        @enter="castersEnter"
        @leave="castersLeave"
        @before-enter="beforeCastersEnter"
    >
        <div
            v-if="castersVisible"
            class="casters-wrapper"
        >
            <div class="casters-header">
                Commentators
            </div>
            <div class="casters-content">
                <div
                    v-for="(caster, id, index) in casters.data ?? {}"
                    :key="id"
                    class="caster-item"
                >
                    <fitted-content :max-width="264">
                        <span class="caster-name">{{ caster.name }}</span>
                        <badge
                            class="caster-pronouns"
                            :color="index % 2 === 0 ? COLORS.accent1 : COLORS.accent2"
                        >
                            {{ caster.pronouns }}
                        </badge>
                    </fitted-content>
                    <fitted-content :max-width="264">
                        <span class="caster-twitter">{{ caster.twitter }}</span>
                    </fitted-content>
                </div>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import { NodeCGBrowser } from 'nodecg/browser';
import { defineComponent } from '@vue/runtime-core';
import { useReplicant } from 'nodecg-vue-composable';
import { Casters } from 'schemas';
import { DASHBOARD_BUNDLE_NAME } from '../../../../shared/constants';
import FittedContent from '../../../components/FittedContent.vue';
import Badge from '../../../components/Badge.vue';
import { COLORS } from '../../../styles/colors';
import { ref } from 'vue';
import gsap from 'gsap';

export default defineComponent({
    name: 'Casters',

    components: { FittedContent, Badge },

    setup() {
        const casters = useReplicant<Casters>('casters', DASHBOARD_BUNDLE_NAME);
        const castersVisible = ref(false);

        nodecg.listenFor('mainShowCasters', DASHBOARD_BUNDLE_NAME, () => {
            castersVisible.value = true;

            setTimeout(() => {
                castersVisible.value = false;
            }, 15 * 1000);
        });

        return {
            casters,
            COLORS,
            castersVisible,

            castersEnter: (elem: HTMLElement, done: gsap.Callback) => {
                gsap.to(elem, { y: 0, opacity: 1, ease: 'power2.out', onComplete: done });
            },
            beforeCastersEnter: (elem: HTMLElement) => {
                gsap.set(elem, { y: 25, opacity: 0 });
            },
            castersLeave: (elem: HTMLElement, done: gsap.Callback) => {
                gsap.to(elem, { y: 25, opacity: 0, ease: 'power2.in', onComplete: done });
            }
        };
    }
});
</script>

<style lang="scss">
@import '../../../styles/constants';

.casters-wrapper {
    position: absolute;
    bottom: 30px;
    right: 60px;
    width: 280px;

    filter: drop-shadow(-2px 2px 4px $drop-shadow-color);

    > .casters-header {
        font-size: 28px;
        font-weight: 500;
        text-align: center;
        width: 100%;
        background-color: $text-background-secondary-alpha;
        border-radius: $default-border-radius $default-border-radius 0 0;
        padding: 4px 0;
        filter: drop-shadow(0 2px 5px rgba(34, 34, 34, 0.25));
    }

    > .casters-content {
        min-height: 100px;
        padding: 8px;
        background-color: $text-background-alpha;
        border-radius: 0 0 $default-border-radius $default-border-radius;
        display: flex;
        flex-direction: column;
        justify-content: center;

        > .caster-item {
            margin: 6px 0;

            .caster-name {
                font-weight: 600;
                font-size: 30px;
            }

            .caster-pronouns {
                font-size: 20px;
                transform: translateY(-3px);
            }

            .caster-twitter {
                font-size: 22px;
                font-weight: 400;
                line-height: 22px;
            }
        }
    }
}
</style>
