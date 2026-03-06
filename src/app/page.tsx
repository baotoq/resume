"use client";

import { useRef } from "react";
import type { ProfilePage, WithContext } from "schema-dts";
import "@/styles/print.css";
import { EducationSection } from "@/components/resume/Education";
import { ExperienceSection } from "@/components/resume/Experience";
import { Header } from "@/components/resume/Header";
import { ProjectsSection } from "@/components/resume/Projects";
import { SkillsSection } from "@/components/resume/Skills";
import { Summary } from "@/components/resume/Summary";
import { PDFExportButton } from "@/components/ui/PDFExportButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { githubRepos } from "@/data/github";
import {
	contactInfo,
	education,
	experiences,
	mainInfo,
	skillCategories,
	summary,
} from "@/data/resume";

export default function ResumePage() {
	const resumeRef = useRef<HTMLDivElement>(null);

	const jsonLd: WithContext<ProfilePage> = {
		"@context": "https://schema.org",
		"@type": "ProfilePage",
		dateModified: "2026-03-06",
		mainEntity: {
			"@type": "Person",
			name: mainInfo.name,
			jobTitle: mainInfo.title,
			description: summary,
			url: "https://baotoq.github.io/resume",
			image: "https://baotoq.github.io/resume/opengraph-image.png",
			sameAs: [contactInfo.linkedin, contactInfo.github].filter(
				(url): url is string => Boolean(url),
			),
			worksFor: {
				"@type": "Organization",
				name: experiences[0].company.name,
				url: experiences[0].company.url,
			},
			alumniOf: {
				"@type": "CollegeOrUniversity",
				name: education[0].school,
			},
			knowsAbout: skillCategories.flatMap((cat) => cat.skills),
		},
	};

	return (
		<div className="min-h-screen bg-[var(--background)] py-12 px-4 sm:px-6 lg:px-8">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
				}}
			/>
			<div
				ref={resumeRef}
				className="relative max-w-4xl mx-auto bg-[var(--card)] shadow-xl rounded-2xl px-8 py-10 sm:px-12 sm:py-12 border border-[var(--border)] flex flex-col gap-12 animate-fade-in"
				id="resume-content"
			>
				<Header
					name={mainInfo.name}
					title={mainInfo.title}
					contact={contactInfo}
					pdfButton={<PDFExportButton contentRef={resumeRef} />}
					themeToggle={<ThemeToggle />}
				/>
				<Summary summary={summary} />
				<ExperienceSection experiences={experiences} />
				<EducationSection education={education} />
				<SkillsSection skills={skillCategories} />
				<ProjectsSection repos={githubRepos} />
			</div>
		</div>
	);
}
