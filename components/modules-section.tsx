'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function ModulesSection() {
    return (
        <section className="py-16 px-4 md:px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background -z-10" />

            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Функціонал платформи
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Оберіть модуль для роботи над державними послугами
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <Link href="/lego" className="group glass p-8 rounded-2xl border border-white/10 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                            <span className="text-6xl">🧱</span>
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                                <span className="text-2xl">🧱</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                                Lego-Diia Constructor
                            </h3>
                            <p className="text-muted-foreground mb-6 leading-relaxed">
                                Візуальний конструктор державних послуг з готових компонентів Diia Design System
                            </p>
                            <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition duration-300">
                                Відкрити конструктор <ArrowRight className="w-4 h-4 ml-2" />
                            </div>
                        </div>
                    </Link>

                    <Link href="/pipeline" className="group glass p-8 rounded-2xl border border-white/10 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 transition duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                            <span className="text-6xl">⚡</span>
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                                <span className="text-2xl">⚡</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-accent transition-colors">
                                AI Pipeline
                            </h3>
                            <p className="text-muted-foreground mb-6 leading-relaxed">
                                Автоматична генерація user flows на основі текстового опису (BRD) або документів
                            </p>
                            <div className="flex items-center text-accent font-semibold group-hover:translate-x-2 transition duration-300">
                                Запустити генерацію <ArrowRight className="w-4 h-4 ml-2" />
                            </div>
                        </div>
                    </Link>

                    <Link href="/evaluation" className="group glass p-8 rounded-2xl border border-white/10 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10 transition duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                            <span className="text-6xl">📊</span>
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                                <span className="text-2xl">📊</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-green-400 transition-colors">
                                Flow Evaluation
                            </h3>
                            <p className="text-muted-foreground mb-6 leading-relaxed">
                                Автоматична оцінка якості прототипів за стандартами WCAG та Diia Design System
                            </p>
                            <div className="flex items-center text-green-400 font-semibold group-hover:translate-x-2 transition duration-300">
                                Оцінити рішення <ArrowRight className="w-4 h-4 ml-2" />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    )
}
