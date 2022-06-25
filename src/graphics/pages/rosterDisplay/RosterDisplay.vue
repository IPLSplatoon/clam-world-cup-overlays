<template>
    <div class="rosters-layout">
        <team-roster
            team="A"
            position="1"
        />
        <div class="versus font-numeric">VS</div>
        <team-roster
            team="B"
            position="2"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import TeamRoster from './components/TeamRoster.vue';
import gsap from 'gsap';
import { bindEntranceToTimeline } from '../../helpers/obsSourceHelper';
import { onMounted } from 'vue';

export default defineComponent({
    name: 'RosterDisplay',

    components: { TeamRoster },

    setup() {
        onMounted(() => {
            const teamRevealTl = gsap.timeline();
            teamRevealTl
                .fromTo(
                    '.rosters-layout .team-roster',
                    { opacity: 0, y: -35 },
                    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1, delay: 1.25 })
                .fromTo(
                    '.rosters-layout .versus',
                    { opacity: 0 },
                    { opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.1 },
                    '-=0.35');

            bindEntranceToTimeline(teamRevealTl);
        });
    }
});
</script>

<style lang="scss">
.rosters-layout {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    > .versus {
        font-size: 100px;
        text-align: center;
        filter: drop-shadow(0 0 10px rgba(34, 34, 34, 1)) drop-shadow(0 0 25px rgba(34, 34, 34, 1));
    }
}
</style>
