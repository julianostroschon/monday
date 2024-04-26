import { sendMessage } from './domains/notify';
export interface Env {
	CHAT_API_SECRET: string;
	CHAT_API_URL: string;
	julianostroschon: number;
	team: {
		[developer: string]: number
	}
}

export default {
	async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {

		if (!request) {
			return new Response('Missing request', { status: 400 });
		}
		const token = await sendMessage(env, request)
		const init: RequestInit<RequestInitCfProperties> = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ token }),
			cf: { scrapeShield: false } 
		}
		const url = env.CHAT_API_URL
		console.log({ url })
		const requi = await fetch(url, init)
		console.log({ requi })
    return new Response(JSON.stringify(token), {
      headers: { 'content-type': 'text/plain' },
    });
	},
};