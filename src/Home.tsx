
// Components
import AnalyticsSummeryCard from "./components/AnalyticsSummeryCard.tsx";
import LastEvents from "./components/LastEvents.tsx";
import Overview from "./components/Overview.tsx";




function Home() {


  return <main className="flex-grow pt-16 bg-gray-100 p-4">
    <h1 className="text-2xl font-extrabold text-gray-800">Dashboard Overview</h1>
    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <Overview/>

      {/* Last Event */}
      <LastEvents/>

      {/* Analytics Summary Card */}
      <AnalyticsSummeryCard/>

    </div>
  </main>
}

export default Home
