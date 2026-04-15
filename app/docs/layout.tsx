import DocsSidebar from '@/components/DocsSidebar';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="docs-layout">
            <DocsSidebar />
            <div className="docs-content prose">
                {children}
            </div>
        </div>
    );
}
