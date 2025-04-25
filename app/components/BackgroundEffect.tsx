'use client';

export default function BackgroundEffect() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] 
          bg-[size:14px_24px]" />
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] 
          rounded-full bg-primary/20 opacity-20 blur-[100px]" />
      <div className="absolute right-0 top-1/4 -z-10 h-[310px] w-[310px] 
          rounded-full bg-primary opacity-20 blur-[100px]" />
    </div>
  );
} 