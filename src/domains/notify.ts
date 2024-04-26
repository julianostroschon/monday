import { sign } from '@tsndr/cloudflare-worker-jwt';

import type { Env } from 'src';
import { constructMessage } from './messages/constructMessage';

async function constructPayload({ julianostroschon }: Env, request: Request): Promise<{ phonenumber?: number, message: string }> {

  const { message, sender, receivers = [] } = await constructMessage(request)
  console.log({ message, receivers });
  if ('coderabbitai[bot]' === sender) {
    return {
      message
    };
  }

  return {
    phonenumber: julianostroschon,
    message
  };
}

export async function sendMessage(env: Env, request: Request) {
  const payload = await constructPayload(env, request)
  const token = await sign(payload, env.CHAT_API_SECRET)
  return token
}