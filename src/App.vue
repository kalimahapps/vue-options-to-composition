<template>
	<div
		class="bg-slate-100
			flex
			justify-center
			min-h-screen
			w-screen
			desktop:h-screen"
	>
		<div class="flex flex-col h-full max-w-[1200px] px-2 w-full">
			<div
				class="bg-slate-50/10
					border-b
					border-sky-900/10
					flex
					desktop:flex-row
					items-center
					flex-col
					py-4"
			>
				<div class="flex items-center">
					<img
						src="./assets/logo.svg"
						class="mr-6 w-16"
						alt="Vue logo"
					>

					<div>
						<h1
							class="font-extrabold
								font-niramit
								text-3xl
								text-sky-800"
						>
							Vue Composition API Converter
						</h1>

						<div
							class="font-niramit
								font-normal
								mt-1
								text-sky-700"
						>
							Convert your Vue 2 Options API code to Vue 3 Composition API
						</div>
					</div>
				</div>

				<div
					class="flex
						font-poppins
						ml-auto
						mt-4
						desktop:mt-0
						text-xs"
				>
					<a
						:class="buttonClasses"
						href="/"
					>
						Main
					</a>

					<a
						href="https://github.com/kalimahapps/vue-options-to-composition/issues/new"
						target="_blank"
						:class="buttonClasses"
					>
						Report a bug
					</a>

					<div
						:class="buttonClasses"
						@click="aboutModal = true"
					>
						About
					</div>

					<a
						target="_blank"
						href="https://twitter.com/KalimahApps"
						class="text-[#1DA1F2] text-lg"
						:class="buttonClasses"
					>
						<BxTwitter />
					</a>
				</div>
			</div>

			<Editor />

			<Transition name="fade">
				<AboutModal v-if="aboutModal" @close="aboutModal = false" />
			</Transition>
		</div>
	</div>
</template>

<script setup lang="ts">
const aboutModal = ref(false);

const buttonClasses = [
	'bg-zinc-200/80',
	'hover:bg-zinc-300',
	'cursor-pointer',
	'ml-2',
	'px-4',
	'py-2',
	'transition',
];
</script>

<style>
/* custom scrollbar */
::-webkit-scrollbar {
  width: 20px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: #6690a0;
  border-radius: 20px;
  border: 6px solid transparent;
  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #457385;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
