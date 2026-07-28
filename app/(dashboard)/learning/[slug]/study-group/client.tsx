'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export function StudyGroupClient({ slug }: { slug: string }) {
  return (
    <div style={{ padding: 20, background: '#222', color: '#eee', fontFamily: 'monospace' }}>
      <h2>StudyGroupClient loaded</h2>
      <p>slug: {slug}</p>
      <p>No server actions, no CourseStudyGroup — bare client component.</p>
      <Link href={`/learning/${slug}`}>← Back to course</Link>
    </div>
  );
}
