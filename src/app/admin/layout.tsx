import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/firebase/session";
import { SignOutButton } from "@/components/admin/sign-out-button";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/profile", label: "Profiel" },
  { href: "/admin/generate", label: "CV genereren" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex max-w-5xl gap-8 px-4 py-10">
      <aside className="w-48 shrink-0">
        <nav className="flex flex-col gap-1 text-sm">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-4 px-3">
          <SignOutButton />
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
