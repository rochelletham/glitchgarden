<template>
    <nav class="p-4 w-full fixed top-0">
        <div class="container mx-auto flex items-center justify-between">
            <div class="fixed left-8">
                <a href="/" class="text-light-green text-2xl font-semibold whitespace-nowrap ml-10 hover:text-opacity-75">GlitchGarden</a>
            </div>
            <div class="text-t-color md:flex space-x-8 ml-auto hover:text-t-color">
                <router-link :to="{ path: '/', query: { component: 'About' } }" class="text-light-green  px-3 py-2 -mr-7 hover:text-t-color">About</router-link>
                <div class="relative"  @mouseleave="hideDropdown">
                        <button @mouseover="showDropdown" class="text-light-green d px-3 py-2 -ml-1 hover:text-t-color">Other Exercises</button>
                        <div v-show="isDropdownVisible" @mouseover="showDropdown" class="absolute left-0 top-full pt-0 py-2 w-48 bg-secondary-bk rounded-md shadow-xl z-10">
                            <router-link :to="{ path: '/', query: { component: 'FlangerContent' } }" class="block text-left text-light-green hover:bg-tertiary-bk px-3 py-2 rounded-md">Flanger</router-link>
                            <router-link :to="{ path: '/', query: { component: 'EchoContent' } }" class="block text-left text-light-green hover:bg-gray-600 px-3 py-2 rounded-md">Echo</router-link>
                            <router-link :to="{ path: '/', query: { component: 'PhaserContent' } }" class="block text-left text-light-green hover:bg-tertiary-bk px-3 py-2 rounded-md">Phaser</router-link>
                            <router-link :to="{ path: '/', query: { component: 'ChorusContent' } }" class="block text-left text-light-green hover:bg-tertiary-bk px-3 py-2 rounded-md">Chorus</router-link>
                            <router-link :to="{ path: '/', query: { component: 'DoublingContent' } }" class="block text-left text-light-green hover:bg-gray-600 px-3 py-2 rounded-md">Doubling</router-link>
                            <router-link :to="{ path: '/', query: { component: 'StereoDelayContent' } }" class="block text-left text-light-green hover:bg-gray-600 px-3 py-2 rounded-md">Stereo Delay</router-link>
                        </div>
                    </div>
                </div>
        </div>   
    </nav>
    <div class="h-16"></div>
    <div class="h-3 bg-light-green"></div>
</template>


<script>

import '../assets/tailwind.css';
export default {
    name: 'NavigatorBar',
    data() {
        return {
            isDropdownVisible: false
        }
    },
    methods: {
        showDropdown() {
            this.isDropdownVisible = true;
        },
        hideDropdown() {
            this.isDropdownVisible = false;
        }
    }
}

</script>

<style>
.container {
    max-width: 1280px;
    margin: 0 auto;
    position: relative;
    
}

nav {
    width: 100%;
    height: auto;
    z-index: 50;
    background-color: theme('colors.secondary-bk');   
}
.dropdown-menu {
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s;
}

.dropdown-menu.active {
    opacity: 1;
    visibility: visible;
}

#line {
    background-color: rgba(148, 212, 122, 1);
}

</style>