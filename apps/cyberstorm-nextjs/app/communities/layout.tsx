import CommunitiesLayout from "./CommunitiesLayout";

// This is a Server Component
export default function Layout({ children }: { children: React.ReactNode }) {
  return <CommunitiesLayout>{children}</CommunitiesLayout>;
}
