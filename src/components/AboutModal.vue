<template>
	<div
		class="bg-sky-100/80
			fixed
			top-0
			left-0
			grid
			place-content-center
			h-screen
			w-screen"
	>
		<div
			class="bg-white
				family-poppins
				h-[500px]
				max-h-[80vh]
				max-w-[100vw]
				overflow-auto
				pb-8
				prose
				px-8
				relative
				rounded-md
				shadow-xl
				w-[750px]"
		>
			<div
				class="absolute
					top-4
					right-4
					cursor-pointer
					font-bold
					opacity-70
					hover:opacity-100
					text-lg
					transition"
				@click="$emit('close')"
			>
				<CgClose />
			</div>

			<h2>About</h2>

			<p>
				This is a tool to convert Vue 2 Options API code to Vue 3 Composition API code.
				It was designed to help you migrate your Vue 2 code to Vue 3.
			</p>

			<p>
				In most of the cases it will work just fine, but it's not perfect.
				If you find a bug, please report it.
			</p>

			<h3>Built by: </h3>

			<p>
				<strong><a href="https://twitter.com/KalimahApps">KalimahApps</a></strong>
			</p>

			<h3>Built with: </h3>

			<ul>
				<li><a href="https://vitejs.dev/" target="_blank">Vite</a></li>

				<li><a href="https://v3.vuejs.org/" target="_blank">Vue 3</a></li>

				<li><a href="https://tailwindcss.com/" target="_blank">TailwindCSS</a></li>

				<li>
					<a href="https://marketplace.visualstudio.com/items?itemName=KalimahApps.jameel">Jameel Dark Theme</a>
				</li>

				<li>
					<a href="https://www.npmjs.com/package/@kalimahapps/vue-icons">Vue Icons</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
defineEmits(['close']);
</script>
