<template>
    <transition
        name="info-row"
    >
        <div
            v-if="visible"
            class="info-row"
        >
            <opacity-swap-transition>
                <font-awesome-icon
                    :key="value"
                    :icon="icon"
                    class="icon"
                />
            </opacity-swap-transition>
            <opacity-swap-transition>
                <fitted-content
                    :key="value"
                    :max-width="900"
                    class="info-row-text"
                >
                    <slot>
                        {{ value }}
                    </slot>
                </fitted-content>
            </opacity-swap-transition>
        </div>
    </transition>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import OpacitySwapTransition from '../../../components/OpacitySwapTransition.vue';
import FittedContent from '../../../components/FittedContent.vue';

export default defineComponent({
    name: 'IntermissionMainInfoRow',

    components: { FontAwesomeIcon, OpacitySwapTransition, FittedContent },

    props: {
        value: {
            type: String,
            default: ''
        },
        icon: {
            type: String,
            required: true
        },
        visible: {
            type: Boolean,
            default: true
        }
    }
});
</script>

<style lang="scss">
.info-row {
    display: flex;
    align-items: center;
    height: 55px;

    .icon {
        font-size: 42px;
        margin-right: 16px;
    }

    .info-row-text {
        font-weight: 500;
        font-size: 36px;
    }
}

.info-row-leave-active {
    transition: height 500ms ease 100ms, opacity 500ms ease;
}

.info-row-enter-active {
    transition: height 500ms ease, opacity 500ms ease 100ms;
}

.info-row-enter-from,
.info-row-leave-to {
    height: 0;
    opacity: 0;
}
</style>
