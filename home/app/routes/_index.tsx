import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export function loader({ context }: LoaderFunctionArgs) {
  const coreAPIHost = context.env.CORE_API_HOST;
  return { coreAPIHost };
}

export default function Component() {
  const [deviceId, setDeviceId] = useState('');
  const { coreAPIHost } = useLoaderData<typeof loader>();
  const [deviceData, setDeviceData] = useState({});

  useEffect(() => {
    if (!deviceId || deviceId.length !== 36) return;
    const websocket = new WebSocket(`wss://${coreAPIHost}?device_id=${deviceId}`);
    websocket.addEventListener('message', (event) => {
      console.log('Message received from server');
      console.log(event.data);
      setDeviceData(JSON.parse(event.data));
    });
    return () => {
      websocket.close();
    };
  }, [deviceId]);
  return (
    <div>
      <h1>Device Data</h1>
      <input type="text" value={deviceId} onChange={(e) => setDeviceId(e.target.value)} />
      <div>{JSON.stringify(deviceData, null, 2)}</div>
    </div>
  );
}
