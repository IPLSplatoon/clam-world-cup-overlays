<template>
    <span
        class="badge"
        :style="{ backgroundColor: color, color: textColor }"
    >
        <slot />
    </span>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import { computed } from 'vue';
import { getContrastingTextColor } from '@iplsplatoon/vue-components';
import { COLORS } from '../styles/colors';

export default defineComponent({
    name: 'Badge',

    props: {
        color: {
            type: String,
            default: COLORS.accentYellow
        }
    },

    setup(props) {
        const textColor = computed(() => getContrastingTextColor(props.color));

        return {
            textColor
        };
    }
});
</script>

<style lang="scss">
span.badge {
    padding: 1px 6px;
    border-radius: 8px;
    margin-left: 8px;
    display: inline-block;
}
</style>
