

<template>
    <nav class="bg-gray-900 p-4">
        <div class="max-w-screen-xl mx-auto flex justify-between items-center">
            <a href="#" class="text-white text-2xl font-semibold">WebEfx</a>
            
            <div class="hidden md:flex space-x-8">
                <a href="#" class="text-white hover:bg-gray-700 px-3 py-2 rounded-md">About</a>

                <!-- Dropdown Menu -->
                <div class="relative">
                <button id="services-btn" class="text-white hover:bg-gray-700 px-3 py-2 rounded-md">Other Exercises</button>
                <div id="dropdown" class="absolute hidden bg-gray-700 text-white rounded-md mt-2 py-2 px-4 space-y-2">
                    <router-link to="/DelayContent.vue" class="block">Feedback Delay</router-link>
                    <router-link to="/VibratoContent.vue" class="block">Vibrato</router-link>
                    <router-link to="/FlangerContent" class="block">Flanger</router-link>
                    <router-link to="/ChorusContent.vue" class="block">Chorus</router-link>
                    <router-link to="/WhiteChorusContent.vue"class="block">White Chorus</router-link>
                    <router-link to="/DoublingContent.vue" class="block">Doubling</router-link>
                    <router-link to="/EchoContent.vue" class="block">Echo</router-link> 
                </div>
            </div>
        </div>
        </div>
    </nav>
</template>

<script>

import '../assets/tailwind.css';
export default {
    name: 'NavigatorBar',
    mounted() {
        const servicesBtn = document.getElementById('services-btn');
        const dropdown = document.getElementById('dropdown');

        servicesBtn.addEventListener('click', () => {
            dropdown.classList.toggle('hidden');
        });
    }
}

</script>