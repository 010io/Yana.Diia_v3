import { ArrowRight, Brain, Zap, Shield, GitBranch, MessageCircle, FileJson } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Header from '@/components/header'
import Hero from '@/components/hero'
import Features from '@/components/features'
import Mission from '@/components/mission'
import Architecture from '@/components/architecture'
import InputOutput from '@/components/input-output'
import Ranking from '@/components/ranking'
import PowerFeatures from '@/components/power-features'
import Innovations from '@/components/innovations'
import Principles from '@/components/principles'
import Contacts from '@/components/contacts'
import Footer from '@/components/footer'
import LLMOpsArchitecture from '@/components/llmops-architecture'
import FlowEvaluator from '@/components/flow-evaluator'
import LiveDemo from '@/components/live-demo'
import CaseStudies from '@/components/case-studies'
import DiaIntegrations from '@/components/diia-integrations'
import APIIntegrations from '@/components/api-integrations'
import IntegrationRoadmap from '@/components/integration-roadmap'
import Team from '@/components/team'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Mission />
      <LLMOpsArchitecture />
      <FlowEvaluator />
      <InputOutput />
      <Ranking />
      <Features />
      <LiveDemo />
      <CaseStudies />
      <DiaIntegrations />
      <APIIntegrations />
      <IntegrationRoadmap />
      <PowerFeatures />
      <Innovations />
      <Principles />
      <Architecture />
      <Team />
      <Contacts />
      <Footer />
    </main>
  )
}
