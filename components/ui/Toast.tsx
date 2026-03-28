'use client';

import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  visible: boolean;
  onDone: () => void;
}

export default function Toast({ message, visible, onDone }: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onDone, 200);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onDone]);

  if (!visible && !show) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[60] flex items-center gap-2.5 px-4 py-3 bg-text-1 text-white text-sm rounded-xl shadow-lg transition-all duration-200 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <CheckCircle size={16} className="text-green shrink-0" />
      {message}
    </div>
  );
}
