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
                    v-for="(caster, id) in casters.data ?? {}"
                    :key="id"
                    class="caster-item"
                >
                    <fitted-content :max-width="264">
                        <span class="caster-name">{{ caster.name }}</span>
                        <badge class="caster-pronouns">
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
    overflow: hidden;
    border-radius: $default-border-radius;

    filter: drop-shadow(0 0 4px $drop-shadow-color);

    > .casters-header {
        font-size: 28px;
        text-align: center;
        width: 100%;
        background-color: $text-background-alpha;
        padding: 4px 0;
        border-bottom: 2px solid $accent-yellow;
    }

    > .casters-content {
        min-height: 100px;
        padding: 8px;
        @include striped-background();
        display: flex;
        flex-direction: column;
        justify-content: center;

        > .caster-item {
            margin: 6px 0;

            .caster-name {
                font-size: 30px;
            }

            .caster-pronouns {
                font-size: 20px;
                transform: translateY(-3px);
            }

            .caster-twitter {
                font-size: 22px;
                line-height: 22px;
            }
        }
    }
}
</style>
