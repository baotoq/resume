import type { ContactInfo } from "@/types/resume";
import type { ReactNode } from "react";
import {
  MailOutlined,
  PhoneOutlined,
  LinkedinOutlined,
  GithubOutlined,
} from "@ant-design/icons";

interface HeaderProps {
  name: string;
  title: string;
  contact: ContactInfo;
  pdfButton?: ReactNode;
  themeToggle?: ReactNode;
}

export function Header({ name, title, contact, pdfButton, themeToggle }: HeaderProps) {
  return (
    <header className="relative pb-8">
      {/* Subtle border line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--border)]" />

      <div className="flex flex-col gap-5">
        {/* Name, Title and PDF Button Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] tracking-tight">
              {name}
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-[var(--accent)] mt-2">
              {title}
            </p>
          </div>
          {/* PDF Button and Theme Toggle */}
          <div className="no-print flex justify-center md:justify-end items-center gap-3">
            {pdfButton}
            {themeToggle}
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
          <a
            href={`mailto:${contact.email}`}
            className="print-only flex items-center gap-2 px-4 py-2 bg-[var(--muted)] rounded-full border border-[var(--border)]"
          >
            <MailOutlined className="text-[var(--accent)]" />
            <span className="text-sm text-[var(--foreground)]">{contact.email}</span>
          </a>

          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="print-only flex items-center gap-2 px-4 py-2 bg-[var(--muted)] rounded-full border border-[var(--border)]"
            >
              <PhoneOutlined className="text-[var(--accent)]" />
              <span className="text-sm text-[var(--foreground)]">{contact.phone}</span>
            </a>
          )}

          {contact.linkedin && (
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 bg-[var(--muted)] hover:bg-[var(--accent)]/10 rounded-full border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all duration-200"
            >
              <LinkedinOutlined className="text-[var(--accent)]" />
              <span className="text-sm text-[var(--foreground)] group-hover:text-[var(--accent)]">LinkedIn</span>
            </a>
          )}

          {contact.github && (
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 bg-[var(--muted)] hover:bg-[var(--accent)]/10 rounded-full border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all duration-200"
            >
              <GithubOutlined className="text-[var(--accent)]" />
              <span className="text-sm text-[var(--foreground)] group-hover:text-[var(--accent)]">GitHub</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
