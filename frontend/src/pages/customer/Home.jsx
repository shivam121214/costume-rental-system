import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-slate-100">
      <section className="bg-slate-900 text-white px-6 py-20 text-center">
        <h1 className="text-5xl font-bold leading-tight">
          Rent Amazing Costumes <br /> For Every Occasion
        </h1>

        <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
          Fancy dress, school events, parties, festivals and more.
          Book quality costumes easily with our rental system.
        </p>

        <div className="flex gap-4 justify-center mt-8 flex-wrap">
          <Link
            to="/request"
            className="bg-yellow-400 text-slate-900 px-6 py-3 rounded-xl font-semibold"
          >
            Book Now
          </Link>

          <Link
            to="/availability"
            className="border border-white px-6 py-3 rounded-xl"
          >
            Check Availability
          </Link>
        </div>
      </section>

      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          Why Choose Us
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold">Huge Collection</h3>
            <p className="text-slate-500 mt-2">
              Superheroes, cultural dresses, school characters and more.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold">Affordable Prices</h3>
            <p className="text-slate-500 mt-2">
              Budget-friendly rentals for all events and occasions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold">Easy Booking</h3>
            <p className="text-slate-500 mt-2">
              Check availability and send requests in minutes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;