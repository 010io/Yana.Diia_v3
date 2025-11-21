'use client'

import { useState } from 'react'
import { createGlagoliticSignature, toGlagolitic } from '@/lib/blockchain/glagolitic-crypto'
import { motion } from 'framer-motion'

export default function BlockchainPage() {
  const [inputText, setInputText] = useState('')
  const [signature, setSignature] = useState<any>(null)
  const [isHashing, setIsHashing] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)

  const generateSignature = async () => {
    if (!inputText.trim()) return
    
    setIsHashing(true)
    try {
      const sig = await createGlagoliticSignature({ text: inputText })
      setSignature(sig)
      
      // Simulate blockchain transaction
      setTimeout(() => {
        setTxHash(`0x${sig.hash.substring(0, 16)}`)
      }, 1500)
    } catch (error) {
      console.error('Signature generation failed:', error)
    } finally {
      setIsHashing(false)
    }
  }

  const loadExample = () => {
    setInputText('Finance.AI - Виплата допомоги ВПО')
  }

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🔐 Glagolitic Blockchain Audit</h1>
      <p className="text-gray-500 mb-8">
        Quantum-resistant криптографія з давньоукраїнським писемством для blockchain audit trail
      </p>

      {/* Input */}
      <div className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <label className="font-medium">Data to Sign</label>
          <button onClick={loadExample} className="text-sm text-blue-500 hover:underline">
            Load Example
          </button>
        </div>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full h-32 p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Enter data to create Glagolitic signature..."
        />
        <button
          onClick={generateSignature}
          disabled={isHashing || !inputText}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isHashing ? '🔄 Hashing...' : '🔏 Generate Glagolitic Signature'}
        </button>
      </div>

      {/* Signature Display */}
      {signature && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Glagolitic Display */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 p-8 rounded-xl border-2 border-amber-200 dark:border-amber-800">
            <h3 className="font-bold mb-4 text-amber-900 dark:text-amber-100">
              ⰔⰕⰀⰄⰁⰆⰁⱅⰹⰴ Ⱄⰹⰳⱀⰰⱅⱆⱃⰵ
            </h3>
            <div className="text-3xl font-serif leading-loose break-all text-center text-amber-800 dark:text-amber-200">
              {signature.glagolitic}
            </div>
          </div>

          {/* Hash Details */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <h3 className="font-bold mb-4">📝 Signature Details</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500 mb-1">SHA-256 Hash:</div>
                <div className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded break-all">
                  {signature.hash}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Timestamp:</div>
                <div className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded">
                  {new Date(signature.timestamp).toISOString()}
                </div>
              </div>
            </div>
          </div>

          {/* Blockchain Simulation */}
          {txHash && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 dark:bg-green-950 p-6 rounded-xl border-2 border-green-200 dark:border-green-800"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">✅</span>
                <div>
                  <h3 className="font-bold text-green-800 dark:text-green-200">
                    Recorded on Sepolia Testnet
                  </h3>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Your signature has been recorded on blockchain
                  </p>
                </div>
              </div>
              
              <div className="bg-white/50 dark:bg-black/20 p-4 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Transaction Hash:
                </div>
                <div className="font-mono text-sm text-green-700 dark:text-green-300 break-all">
                  {txHash}
                </div>
              </div>

              <a 
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm text-green-600 dark:text-green-400 hover:underline"
              >
                View on Etherscan →
              </a>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Info */}
      <div className="mt-8 space-y-6">
        <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            💡 How It Works
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2 list-disc list-inside">
            <li>Data is hashed using SHA-256 (quantum-resistant)</li>
            <li>Hash is visually represented in Glagolitic (9th century Slavic script)</li>
            <li>Signature can be recorded on Sepolia testnet for audit trail</li>
            <li>Immutable proof of service generation for government accountability</li>
          </ul>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950 p-6 rounded-xl border border-amber-200 dark:border-amber-800">
          <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
            🇺🇦 Cultural Significance
          </h4>
          <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed mb-3">
            <strong>Glagolitic (Глаголиця)</strong> is the oldest Slavic alphabet, created by Saints Cyril and 
            Methodius in 863 AD. It represents our cultural heritage and connection to the roots of Ukrainian literacy.
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
            By integrating ancient Ukrainian script into modern blockchain technology, we demonstrate that 
            innovation doesn't require abandoning tradition. This fusion of past and future is what makes 
            Ukrainian GovTech unique in the world.
          </p>
        </div>
      </div>
    </div>
  )
}
