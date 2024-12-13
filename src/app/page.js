import RefinanceCalculator from '@/components/RefinanceCalculator';
import HomeAdder from '@/components/HomeAdder';
import PortfolioSimulator from '@/components/PortfolioSimulator';


export default function Home() {
  return (
    <main className="min-h-screen p-8">
      {/* <RefinanceCalculator /> */}
      {/* <HomeAdder /> */}
      <PortfolioSimulator />
    </main>
  )
}