import Header from '@/components/Header'
import Experience from '@/components/Experience'
import Education from '@/components/Education'
import Skills from '@/components/Skills'

export default function Home() {
  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <Header />
      <div className="mt-8 space-y-8">
        <Experience />
        <Education />
        <Skills />
      </div>
    </main>
  )
}
