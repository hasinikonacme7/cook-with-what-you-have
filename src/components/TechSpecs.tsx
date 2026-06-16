/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { DATABASE_SCHEMA_TABLES, API_ENDPOINTS, ORGANIC_GROWTH_SEO_PLAN, LAUNCH_ROADMAP } from '../data/deliverables';
import { Database, Server, Compass, CheckCircle2, Circle, ArrowRight } from 'lucide-react';

export default function TechSpecs() {
  const [activeTable, setActiveTable] = useState(DATABASE_SCHEMA_TABLES[0].name);
  const [activeEndpointIdx, setActiveEndpointIdx] = useState(0);
  const [techTab, setTechTab] = useState<'db' | 'api' | 'seo'>('db');

  const selectedTable = DATABASE_SCHEMA_TABLES.find(t => t.name === activeTable) || DATABASE_SCHEMA_TABLES[0];
  const selectedEndpoint = API_ENDPOINTS[activeEndpointIdx];

  return (
    <div className="space-y-8 font-sans" id="tech-specs-root">
      {/* Sub menu controls */}
      <div className="flex flex-wrap gap-2 justify-center border-b border-natural-border pb-4">
        <button
          id="btn-tech-db"
          onClick={() => setTechTab('db')}
          className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer ${
            techTab === 'db'
              ? 'bg-natural-green text-white shadow-xs'
              : 'bg-natural-green-light/45 text-natural-dark hover:bg-natural-green-light'
          }`}
        >
          <Database className="w-4 h-4" />
          Database Schema Catalog
        </button>
        <button
          id="btn-tech-api"
          onClick={() => setTechTab('api')}
          className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer ${
            techTab === 'api'
              ? 'bg-natural-green text-white shadow-xs'
              : 'bg-natural-green-light/45 text-natural-dark hover:bg-natural-green-light'
          }`}
        >
          <Server className="w-4 h-4" />
          API Sandbox Blueprint
        </button>
        <button
          id="btn-tech-seo"
          onClick={() => setTechTab('seo')}
          className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer ${
            techTab === 'seo'
              ? 'bg-natural-green text-white shadow-xs'
              : 'bg-natural-green-light/45 text-natural-dark hover:bg-natural-green-light'
          }`}
        >
          <Compass className="w-4 h-4" />
          Programmatic SEO & Roadmap
        </button>
      </div>

      {techTab === 'db' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6" id="db-schema-viewer">
          {/* Table List Sidebar */}
          <div className="md:col-span-1 space-y-2">
            <h4 className="text-xs font-bold text-natural-dark uppercase tracking-wider mb-3">
              Ecosystem Tables
            </h4>
            {DATABASE_SCHEMA_TABLES.map((table) => (
              <button
                key={table.name}
                id={`btn-table-select-${table.name}`}
                onClick={() => setActiveTable(table.name)}
                className={`w-full text-left px-4 py-3 rounded-xl font-mono text-xs transition duration-200 border cursor-pointer ${
                  activeTable === table.name
                    ? 'bg-natural-green-light/45 font-bold border-natural-green/30 text-natural-dark shadow-xs'
                    : 'bg-white border-natural-border text-natural-text hover:bg-natural-light-bg/50'
                }`}
              >
                📁 {table.name}
              </button>
            ))}
          </div>

          {/* Table Details panel */}
          <div className="md:col-span-3 bg-white border border-natural-border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="border-b border-natural-border pb-3">
              <h3 className="text-md font-bold text-natural-dark font-mono">
                Table: {selectedTable.name}
              </h3>
              <p className="text-natural-muted text-xs mt-1">
                {selectedTable.description}
              </p>
            </div>

            {/* Column grid list */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="bg-natural-soft-bg border-b border-natural-border text-natural-muted">
                    <th className="py-2.5 px-3">Column</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Constraints</th>
                    <th className="py-2.5 px-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-natural-border/40">
                  {selectedTable.columns.map((column) => (
                    <tr key={column.name} className="hover:bg-natural-green-light/10 transition">
                      <td className="py-2.5 px-3 font-bold text-natural-dark">{column.name}</td>
                      <td className="py-2.5 px-3 text-natural-green">{column.type}</td>
                      <td className="py-2.5 px-3 text-natural-light-muted italic">
                        {column.constraints || '-'}
                      </td>
                      <td className="py-2.5 px-3 text-natural-text font-sans">{column.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Scalability suggestion card */}
            <div className="mt-4 p-4 bg-natural-green-light/40 border border-natural-green/20 rounded-xl">
              <h4 className="text-xs font-bold text-natural-dark uppercase tracking-wide">
                ⚡ Architectural Scalability Insights
              </h4>
              <p className="text-[11px] text-natural-text mt-1 leading-relaxed">
                By index-binding the <code className="bg-natural-green-light/60 rounded px-1 text-natural-dark font-bold font-sans">user_id</code> and partitioning the <code className="bg-natural-green-light/60 rounded px-1 text-natural-dark font-bold font-sans">expiry_date</code> arrays, the pantry lookup executes in O(1) time complexity. We recommend PostgreSQL hosted on Google Cloud SQL with a low latency memory cache via Redis to keep visual scanner responses under 200ms globally.
              </p>
            </div>
          </div>
        </div>
      )}

      {techTab === 'api' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6" id="api-sandbox-viewer">
          {/* Side endpoint selection */}
          <div className="md:col-span-1 space-y-2">
            <h4 className="text-xs font-bold text-natural-dark uppercase tracking-wider mb-3">
              REST Endpoints
            </h4>
            {API_ENDPOINTS.map((ep, idx) => (
              <button
                key={idx}
                id={`btn-api-endpoint-${idx}`}
                onClick={() => setActiveEndpointIdx(idx)}
                className={`w-full text-left px-4 py-3 rounded-xl transition duration-250 border flex flex-col gap-1.5 cursor-pointer ${
                  activeEndpointIdx === idx
                    ? 'bg-natural-green-light/45 border-natural-green/30 shadow-xs text-natural-dark'
                    : 'bg-white border-natural-border hover:bg-natural-light-bg/50 text-natural-text'
                }`}
              >
                <div className="flex gap-2 items-center text-[10px] font-mono">
                  <span className={`px-2 py-0.5 rounded font-extrabold ${
                    ep.method === 'POST' ? 'bg-[#A27B5C]/20 text-[#8C6239]' : 'bg-natural-green/20 text-natural-dark'
                  }`}>
                    {ep.method}
                  </span>
                  <span className="text-natural-muted font-bold">Express route</span>
                </div>
                <div className="font-mono text-xs text-natural-dark font-bold truncate">
                  {ep.path}
                </div>
              </button>
            ))}
          </div>

          {/* Sandbox code blocks */}
          <div className="md:col-span-3 bg-natural-dark text-stone-200 rounded-2xl p-6 border border-natural-dark-hover space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono bg-natural-green/40 text-natural-green-light px-2 py-0.5 rounded mr-2">
                  SCHEMA_VERSION v1
                </span>
                <span className="text-xs font-mono text-white/60">{selectedEndpoint.path}</span>
              </div>
              <span className="text-[10px] text-[#AEC2B6] font-mono">JSON SPECIFICATION</span>
            </div>

            <p className="text-xs text-white/80 leading-relaxed font-sans italic">
              {selectedEndpoint.description}
            </p>

            {selectedEndpoint.requestBody && (
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-white/40 block">HTTP REQUEST PAYLOAD (JSON)</span>
                <pre className="p-3 bg-black/25 border border-white/5 rounded-lg text-[11px] font-mono text-[#E7DEC9] overflow-x-auto leading-normal">
                  {selectedEndpoint.requestBody}
                </pre>
              </div>
            )}

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-white/40 block">EXPECTED SUCCESS RESPONSE (200 OK)</span>
              <pre className="p-3 bg-black/25 border border-white/5 rounded-lg text-[11px] font-mono text-[#AEC2B6] overflow-x-auto leading-normal">
                {selectedEndpoint.responseBody}
              </pre>
            </div>
          </div>
        </div>
      )}

      {techTab === 'seo' && (
        <div className="max-w-4xl mx-auto space-y-8" id="seo-strategy-roadmap">
          {/* SEO Strategy block */}
          <div className="bg-white border border-natural-border rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="max-w-2xl">
              <h3 className="text-lg font-bold text-natural-dark">Programmatic Organic Hypergrowth</h3>
              <p className="text-natural-muted text-sm mt-1 leading-relaxed">
                How CWWH automatically pulls search volume from users questioning their leftover items online daily without ad spend.
              </p>
            </div>

            <hr className="border-natural-soft-bg" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ORGANIC_GROWTH_SEO_PLAN.pillars.map((pillar, idx) => (
                <div key={idx} className="bg-natural-soft-bg rounded-xl p-5 border border-natural-border space-y-2">
                  <h4 className="font-bold text-natural-dark text-sm">{pillar.title}</h4>
                  <p className="text-natural-text text-xs leading-relaxed">{pillar.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Launch checklist mapping */}
          <div className="bg-white border border-natural-border rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-natural-dark">12-Month Go-To-Market Roadmap</h3>
              <p className="text-natural-muted text-sm mt-1">
                Aligning milestone checkmarks from initial founder MVP to international hyper-growth modes.
              </p>
            </div>

            <div className="relative border-l border-natural-green/20 pl-6 ml-4 space-y-6">
              {LAUNCH_ROADMAP.map((phase, idx) => (
                <div key={idx} className="relative">
                  {/* Point icon */}
                  <span className="absolute -left-[31px] top-1 bg-white p-1 rounded-full text-natural-green">
                    <CheckCircle2 className="w-5 h-5 bg-white rounded-full text-natural-green" />
                  </span>
                  <div className="space-y-1">
                    <h4 className="font-bold text-natural-dark text-sm flex items-center gap-2">
                      {phase.item}
                      <span className="text-[10px] bg-natural-green-light text-natural-dark font-normal px-2 py-0.5 rounded-full">
                        GTM Track {idx + 1}
                      </span>
                    </h4>
                    <p className="text-natural-text text-xs leading-relaxed max-w-2xl">
                      {phase.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
