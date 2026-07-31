import type { Profile } from "@/types/cv";

export function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <div className="flex gap-4">
          <a href={`mailto:${profile.contact.email}`} className="hover:text-foreground">
            {profile.contact.email}
          </a>
          <a
            href={profile.contact.linkedin}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
