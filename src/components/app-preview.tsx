import Image from "next/image";

export function AppPreview() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 pb-20">
      <Image
        src="/images/app-preview.png"
        alt="App Preview"
        width={1000}
        height={1000}
        className="rounded-md w-full"
      />
    </div>
  );
}
