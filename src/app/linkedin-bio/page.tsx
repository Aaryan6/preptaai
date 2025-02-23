import LinkedInBioForm from "@/components/linkedin-bio-form";

export default async function LinkedInBioPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-50">
      <h1 className="text-2xl font-bold mb-8">Generate LinkedIn Bio</h1>
      <LinkedInBioForm />
    </div>
  );
}
