import type { ReactNode } from 'react';

interface ComponentDemoProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const ComponentDemo = ({
  title,
  description,
  children,
}: ComponentDemoProps) => {
  return (
    <div className="border border-component-block rounded mb-8">
      <div className="px-5 py-4 border-b border-component-block">
        <h2 className="my-0">{title}</h2>
        {description && <p>{description}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

export default ComponentDemo;
