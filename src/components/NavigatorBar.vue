<template>
    <nav class="bg-gray-900 p-4 w-full fixed top-0">
        <div class="container mx-auto flex items-center justify-between">
            <div class="fixed left-8">
                <a href="/" class="text-white text-2xl font-semibold whitespace-nowrap">GlitchGarden</a>
            </div>
            <div class="hidden md:flex space-x-8 ml-auto">
                <!-- <a href="" class="text-white hover:bg-gray-700 px-3 py-2 rounded-md">About</a> -->
                <router-link :to="{ path: '/', query: { component: 'About' } }" class="text-white hover:bg-gray-700 px-3 py-2 rounded-md">About</router-link>
                <div class="relative"  @mouseleave="hideDropdown">
                        <button @mouseover="showDropdown" class="text-white hover:bg-gray-700 px-3 py-2 rounded-md">Other Exercises</button>
                        <div v-show="isDropdownVisible" @mouseover="showDropdown" class="absolute left-0 top-full pt-0 py-2 w-48 bg-gray-700 rounded-md shadow-xl z-10">
                            <router-link :to="{ path: '/', query: { component: 'FlangerContent' } }" class="block text-left text-white hover:bg-gray-600 px-3 py-2 rounded-md">Flanger</router-link>
                            <router-link :to="{ path: '/', query: { component: 'PhaserContent' } }" class="block text-left text-white hover:bg-gray-600 px-3 py-2 rounded-md">Phaser</router-link>
                            <router-link :to="{ path: '/', query: { component: 'ChorusContent' } }" class="block text-left text-white hover:bg-gray-600 px-3 py-2 rounded-md">Chorus</router-link>
                            <router-link :to="{ path: '/', query: { component: 'DoublingContent' } }" class="block text-left text-white hover:bg-gray-600 px-3 py-2 rounded-md">Doubling</router-link>
                            <router-link :to="{ path: '/', query: { component: 'EchoContent' } }" class="block text-left text-white hover:bg-gray-600 px-3 py-2 rounded-md">Echo</router-link>
                        </div>
                    </div>
                </div>
        </div>
    </nav>
    <div class="h-8"></div>
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
    /* height: 4rem; 64px, matches h-16 */
    
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
</style>