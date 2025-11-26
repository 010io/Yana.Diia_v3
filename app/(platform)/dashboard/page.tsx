export default function DashboardPage() {
    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Панель Управління</h1>
                <p className="text-gray-600">Ласкаво просимо до Yana.Diia.AI Platform</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border rounded-2xl p-6 hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-4">🧱</div>
                    <h3 className="text-xl font-bold mb-2">Lego-Diia Constructor</h3>
                    <p className="text-gray-600 mb-4">
                        Створення державних послуг з готових компонентів
                    </p>
                    <button className="w-full px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800">
                        Відкрити →
                    </button>
                </div>

                <div className="bg-white border rounded-2xl p-6 hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-4">⚡</div>
                    <h3 className="text-xl font-bold mb-2">AI Pipeline</h3>
                    <p className="text-gray-600 mb-4">
                        Автоматична генерація flows з BRD
                    </p>
                    <button className="w-full px-6 py-3 bg-blue-400 text-white rounded-xl hover:bg-blue-500">
                        Запустити →
                    </button>
                </div>

                <div className="bg-white border rounded-2xl p-6 hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-4">📊</div>
                    <h3 className="text-xl font-bold mb-2">Flow Evaluation</h3>
                    <p className="text-gray-600 mb-4">
                        Оцінка за WCAG та Diia DS
                    </p>
                    <button className="w-full px-6 py-3 border-2 border-black rounded-xl hover:bg-gray-50">
                        Оцінити →
                    </button>
                </div>
            </div>
        </div>
    );
}
