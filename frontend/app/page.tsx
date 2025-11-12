import { BuyMeACoffeeButton } from './components/buy-me-a-coffee-button';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50 font-sans dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <main className="flex flex-col items-center gap-8 px-6 text-center">
        {/* Header */}
          <div className="flex flex-col items-center gap-6 text-center"> </div>
          <div className="text-8xl animate-bounce">🍺</div>
          <h1 className="text-7xl font-bold tracking-tight text-black dark:text-white">
            Buy Me a Beer
          </h1>
          <p className="max-w-4xl text-2xl text-zinc-700 dark:text-zinc-400 leading-relaxed whitespace-nowrap">
            Buy me a pint and tell me your name, and I&apos;ll drink to you🍻
          </p>
          <BuyMeACoffeeButton />
        </main>
    </div>
  );
}
