import Image from "next/image";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex  items-center justify-center h-full w-full">
        <main className="flex-1 max-w-2xl lg:mx-auto p-5 md:px-10 w-full">
           <div className="flex items-center justify-center">
             <Image width={100} height={100} src={'/images/logo.svg'} alt="logo" />
           </div>
            {children}
        </main>
    </div>
  );
}