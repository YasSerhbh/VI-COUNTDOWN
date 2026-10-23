import { Suspense } from 'react';
import CountdownApp from './components/CountdownApp';

export default function Home() {
  return (
    <Suspense fallback={<div className="loading-stage" />}>
      <CountdownApp />
    </Suspense>
  );
}
