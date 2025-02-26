import LinkedInBioForm from "@/app/linkedin-bio/_components/linkedin-bio-form";

export default async function LinkedInBioPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-muted">
      <h1 className="text-2xl font-bold mb-8">Generate LinkedIn Bio</h1>
      <LinkedInBioForm />
    </div>
  );
}
