export default function Dashboard() {
  return (
    <div
      className="min-h-screen p-10"
      style={{ backgroundColor: "#EEEBDA" }}
    >
      <h1
        className="text-5xl font-bold mb-10 text-[#2B2B4A]"
      >
        Welcome to SourceIt
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="font-bold text-xl text-gray-900">
            Create Request
          </h2>
          <p className="text-gray-600 mt-2">
            Ask for any custom product.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="font-bold text-xl text-gray-900">
            Track Requests
          </h2>
          <p className="text-gray-600 mt-2">
            View request status updates.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="font-bold text-xl text-gray-900">
            Get Quotations
          </h2>
          <p className="text-gray-600 mt-2">
            Receive offers from suppliers.
          </p>
        </div>

      </div>
    </div>
  );
}