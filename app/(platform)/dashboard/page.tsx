export default function DashboardPage() {
  return (
    <div className="p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Керування генерацією послуг</p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            Mock Mode Active
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Lego Constructor */}
        <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition bg-white dark:bg-gray-900">
          <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
            🧱
          </div>
          <h3 className="text-xl font-semibold mb-2">Lego-Diia Constructor</h3>
          <p className="text-gray-500 mb-4">
            Створення послуг з готових компонентів Дії. Drag-and-drop інтерфейс.
          </p>
          <button className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
            Відкрити Конструктор
          </button>
        </div>

        {/* Card 2: AI Debate */}
        <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition bg-white dark:bg-gray-900">
          <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
            💬
          </div>
          <h3 className="text-xl font-semibold mb-2">AI Debate Chamber</h3>
          <p className="text-gray-500 mb-4">
            Оцінка послуг 7-ма AI агентами. Леся, Ярослав, Кличко та інші.
          </p>
          <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Почати Дебати
          </button>
        </div>

        {/* Card 3: Quantum Optimization */}
        <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition bg-white dark:bg-gray-900">
          <div className="h-12 w-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
            🌌
          </div>
          <h3 className="text-xl font-semibold mb-2">Quantum Optimizer</h3>
          <p className="text-gray-500 mb-4">
            Оптимізація UX flow за допомогою квантових алгоритмів.
          </p>
          <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            Оптимізувати
          </button>
        </div>
      </div>

      <div className="mt-8 border rounded-xl p-6 bg-gray-50 dark:bg-gray-800">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded border">
            <span className="text-green-500">●</span>
            <span className="font-medium">System Initialized</span>
            <span className="text-gray-400 text-sm ml-auto">Just now</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded border">
            <span className="text-blue-500">●</span>
            <span className="font-medium">Mock Provider Loaded</span>
            <span className="text-gray-400 text-sm ml-auto">1 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
