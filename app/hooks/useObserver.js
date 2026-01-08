import { useEffect, useState } from "react";

export default function useMessageObserver(messages, messagesRefs, containerRef) {
  const [visibleMessages, setVisibleMessages] = useState(new Set());

  useEffect(() => {
    if (!messagesRefs.current || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleMessages((prev) => {
          const next = new Set(prev);
          entries.forEach((entry) => {
            const id = entry.target.dataset.id;

            if (entry.isIntersecting) {
              next.add(id)
            }
            else {
              next.delete(id)

            }
          });
          return next;
        });
      },
      {
        root: containerRef.current,
        threshold: 0.5,
      }
    );

    Object.values(messagesRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [messages, messagesRefs, containerRef]);

  return visibleMessages;
}
