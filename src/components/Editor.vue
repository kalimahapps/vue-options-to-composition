<template>
	<div
		class="flex-col
			grow
			font-firaCode
			grid
			desktop:grid-cols-2
			gap-4
			overflow-hidden
			pb-4
			pt-8
			px-1"
	>
		<div class="overflow-hidden relative">
			<transition name="slide">
				<div
					v-if="errorMessage"
					class="absolute
						bottom-0
						bg-rose-200
						font-poppins
						p-2
						text-red-900
						text-sm
						w-full
						whitespace-pre"
					v-html="errorMessage"
				/>
			</transition>

			<textarea
				v-model="userInput"
				placeholder="Paste your Vue 2 Options API code here.
The code between the <script> tags.

It should have: export default {
	...
}
"
				spellcheck="false"
				class="border
					h-full
					min-h-[300px]
					p-2
					pb-10
					resize-none
					shadow-md
					focus:shadow-[0_0_1em_0_rgba(0,0,0,0.1)]
					text-sm
					transition
					w-full
					focus:outline-none"
			/>
		</div>

		<div
			class="border h-full overflow-hidden relative"
		>
			<div
				v-if="loading"
				class="-translate-x-full
					absolute
					top-0
					bg-sky-600
					h-[2px]
					loading-animation
					rounded
					shadow-lg
					shadow-white
					w-20
					z-10"
				:class="compositionOutput && '!bg-white'"
			/>

			<div
				v-if="!compositionOutput"
				class="flex
					justify-center
					items-center
					font-poppins
					h-full
					p-20
					text-center
					text-lg
					text-sky-900/50
					w-full"
			>
				Paste your Vue2 Options API code in the left box to see the converted code here
			</div>

			<template v-else>
				<div
					v-if="!errorMessage"
					class="bg-[#1e2429]
						border-b
						border-sky-100/10
						flex
						gap-2
						p-2"
				>
					<div
						class="bg-zinc-200
							cursor-pointer
							flex
							items-center
							gap-2
							opacity-90
							hover:opacity-100
							p-2
							rounded
							transition"
						@click="showSectionComment = !showSectionComment"
					>
						<AkCheck v-if="showSectionComment" class="text-lg" />
						<AkXSmall v-else class="text-lg" />
						<div class="font-poppins text-xs">
							Section Comment
						</div>
					</div>
					<div
						class="bg-zinc-200
							cursor-pointer
							flex
							items-center
							gap-2
							opacity-80
							hover:opacity-100
							p-2
							rounded
							transition"
						@click="copyOutput"
					>
						<AnOutlinedCopy v-if="!copied " class="text-xl" />

						<div
							class="font-poppins text-sm"
						>
							{{ copied ? 'Copied!' : 'Copy' }}
						</div>
					</div>
				</div>

				<div
					v-if="compositionOutput"
					class="h-full
						max-h-[600px]
						desktop:max-h-none
						min-h-[300px]
						opacity-100
						overflow-auto
						transition"
					:class="errorMessage && '!opacity-80'"
					v-html="compositionOutput"
				/>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useClipboard, refDebounced } from '@vueuse/core';
import Worker from '@/worker.js?worker';
import { format } from '@/utils';
import Parser from '@/parser';

const { copy, copied } = useClipboard();

/**
 * Updated code after converting and formatting
 */
const updatedCode = ref('');

const showSectionComment = ref(true);

/**
 * User input code
 */
const userInput = ref('');

/**
 * Debounced user input code for better performance
 */
const debouncedInput = refDebounced(userInput);

/**
 * Copy the output (non-highlighted) code to clipboard
 */
const copyOutput = function(){
	copy(updatedCode.value);
};

/**
 * The convert, formatted and highlighted output code
 */
const compositionOutput = ref('');

/**
 * Error message to show if the input code is invalid
 */
const errorMessage = ref('');

/**
 * Loading animation
 */
const loading = ref(false);

/**
 * Start worker
 */
const worker = new Worker();

/**
 * Callback on worker message
 *
 * @param {any} event MessageEvent
 */
worker.addEventListener('message', (event: any) => {
	const { code, status } = event.data;

	// Don't process if there is an error
	if (errorMessage.value !== ''){
		return;
	}

	if (status === 'success'){
		compositionOutput.value = code;
		errorMessage.value = '';
	} else {
		errorMessage.value = code;
	}

	loading.value = false;
});

const processCode = () => {
	const { value } = debouncedInput;

	errorMessage.value = '';

	if (!value){
		compositionOutput.value = '';
		loading.value = false;
		worker.terminate();
		return;
	}

	try {
		loading.value = true;
		const ParseInput = new Parser(
			value, {
				showSectionComment: showSectionComment.value,
			}
		);
		const { imports, output, importDeclarations } = ParseInput.parse();

		// Add required imports (e.g. ref, computed, etc.)
		if (imports.length > 0) {
			output.unshift(`import { ${imports.join(', ')} } from 'vue';\n`);
		}

		// Add original import declarations to the top
		if (importDeclarations) {
			output.unshift(...importDeclarations);
		}

		updatedCode.value = output.join('\n');

		updatedCode.value = format(updatedCode.value);

		worker.postMessage({ code: updatedCode.value });
	} catch (error: any) {
		console.error(error);
		loading.value = false;

		// Slice from the error position to few characters after
		// to highlight the error in the input code
		if (!error.pos) {
			errorMessage.value = error.message;
			return;
		}

		const { pos, message } = error;
		const errorSnippet = value.slice(pos + 1, pos + 50);
		const char = value[pos];
		errorMessage.value = `${message}: \n <strong>${char}</strong>${errorSnippet} ...`;
	}
};

/**
 * Watch input and process it (parse, format, highlight ... etc.)
 */
watch(debouncedInput, processCode);
watch(showSectionComment, processCode);
</script>

<style scoped>
:deep(.shiki){
	overflow: auto;
	height: 100%;
	width: 100%;
	padding: 1em;
}

.slide-enter-active, .slide-leave-active {
  transition: all .3s ease;
}

.slide-enter, .slide-leave-to {
  transform: translateY(100%);
  opacity: 1;
}

.loading-animation {
	animation: loading 4s linear infinite;
}

@keyframes loading {
	0% {
		left: 0;
	}

	100% {
		left: 100%;
		transform: translateX(100%);
	}
}
</style>
