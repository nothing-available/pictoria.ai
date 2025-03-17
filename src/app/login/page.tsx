import Image from "next/image";
import AuthImg from "../../../public/authbackground.png";
import { Logo } from "@/components/common/Logo";
import { AuthForm } from "@/components/authentication/AuthForm";

export default function AuthenticationPage() {
  return (
    <main className='h-screen grid grid-cols-2 relative'>
      <div className='relative w-full flex flex-col bg-muted p-10 text-primary-foreground'>

        <div className='w-full h-[30%] bg-gradient-to-t from-transparent to-black/50 absolute top-0 left-0 z-10' />

        <div className='w-full h-[40%] bg-gradient-to-b from-transparent to-black/50 absolute bottom-0 left-0 z-10' />

        <Image
          src={AuthImg}
          alt='login Image'
          fill
          className='w-full h-full object-cover'
        />

        <div className='relative z-20 flex items-center'>
          <Logo />
        </div>

        <div className='relative z-20 mt-auto'>
          <blockquote>
            <p className='text-lg'>
              &ldquo;Pictoria AI is a game changer for the creative industry.
              It&apos;s a platform that allows you to create stunning visuals
              with ease.&rdquo;
            </p>

            <footer className='text-sm'>Sumit k.</footer>
          </blockquote>
        </div>
      </div>

      <div className='relative flex flex-col items-center justify-center p-8 h-full w-full'>
        <div className='max-w-xl w-[350px] mx-auto'>
          <AuthForm />
        </div>
      </div>
    </main>
  );
}
