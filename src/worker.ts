import { highlight } from '@/utils/highlight';

onmessage = async (event) => {
	const { code } = event.data;
	try {
		const highlighted = await highlight(code);

		postMessage({
			status: 'success',
			code: highlighted,
		});
	} catch (error: any) {
		postMessage({
			status: 'error',
			error: error.message,
		});
	}
};