'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  FileCheck,
  Upload,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Clock
} from 'lucide-react';

export default function OrgVerificationPage() {
  const [org, setOrg] = useState<any>(null);
  const [docType, setDocType] = useState('NGO_DARPAN');
  const [docName, setDocName] = useState('NGO_Darpan_Registration.pdf');
  const [docText, setDocText] = useState(
    'GOVERNMENT OF INDIA\nNGO DARPAN REGISTRATION CERTIFICATE\nOrganization: Green Earth Trust\nUnique Darpan ID: TN/2021/0192834\nAuthorized Signatory: Ananya Sharma\nContact: +91 9811122334'
  );
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  useEffect(() => {
    loadOrg();
  }, []);

  const loadOrg = async () => {
    const res = await api.getMyOrg();
    if (res.success && res.data) {
      setOrg(res.data.organization);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setUploadResult(null);

    const res = await api.uploadOrgDoc({
      document_type: docType,
      document_name: docName,
      document_text: docText
    });
    setUploading(false);

    if (res.success && res.data) {
      setUploadResult(res.data);
      loadOrg();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Organization Verification & KYC</h1>
        <p className="text-sm text-stone-400 mt-1">
          Upload authorized legal documents. Our AI verification engine automatically extracts registration IDs and flags discrepancies for fast administrative approval.
        </p>
      </div>

      {/* Verification Status Banner */}
      <div className="bg-stone-900/80 backdrop-blur-xl p-6 rounded-3xl border border-stone-800 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Current Standing</span>
          <div className="text-xl font-bold text-white mt-0.5">{org?.name}</div>
          <div className="text-xs text-stone-400">Representative: {org?.representative_name}</div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            Status: {org?.verification_status || 'VERIFIED_NEW'}
          </span>
          <div className="text-xs font-semibold text-stone-300">
            Trust Rating: <strong className="text-amber-400">{org?.trust_score || 78.5}/100</strong>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload & AI Analysis Form or Application in Review */}
        {uploadResult ? (
          <div className="bg-stone-900/80 backdrop-blur-xl p-8 rounded-3xl border border-stone-800 shadow-xl space-y-6 text-center">
            <div className="w-14 h-14 mx-auto bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/30">
              <Clock className="w-7 h-7 text-amber-400 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                <span>Application Under Review</span>
              </div>
              <h3 className="text-xl font-bold text-white">Verification Document Submitted</h3>
              <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto leading-relaxed">
                Your KYC application has been recorded and submitted to the platform administrator for review. Once verified, your organization trust score will be elevated.
              </p>
            </div>

            <div className="p-4 bg-stone-950/60 rounded-2xl border border-stone-800 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-400">Document Type:</span>
                <span className="font-semibold text-stone-200">{docType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">File Name:</span>
                <span className="font-mono text-amber-300">{docName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">AI Risk Assessment:</span>
                <span className="font-bold text-amber-400">LOW_RISK_RECOMMEND_APPROVAL</span>
              </div>
            </div>

            <button
              onClick={() => setUploadResult(null)}
              className="w-full py-2.5 rounded-xl border border-stone-700 bg-stone-800/80 text-xs font-semibold text-stone-200 hover:bg-stone-800 hover:border-amber-500/40 transition-all"
            >
              Upload Additional Document
            </button>
          </div>
        ) : (
          <div className="bg-stone-900/80 backdrop-blur-xl p-8 rounded-3xl border border-stone-800 shadow-xl space-y-6">
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">Upload & AI OCR Analysis</h2>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Document Type</label>
                <select
                  value={docType}
                  onChange={e => setDocType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-800/90 border border-stone-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="NGO_DARPAN">NGO Darpan Registration Certificate</option>
                  <option value="REGISTRATION_CERT">Society / Trust Deed Certificate</option>
                  <option value="CIN_LLPIN">Company CIN / LLPIN Certificate</option>
                  <option value="ADDRESS_PROOF">Authorized Office Address Proof</option>
                  <option value="ID_PROOF">Representative Identity Document</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Document File Name</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={e => setDocName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-800/90 border border-stone-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Document Raw Content / OCR Text Sample
                </label>
                <textarea
                  rows={5}
                  required
                  value={docText}
                  onChange={e => setDocText(e.target.value)}
                  className="w-full p-3 font-mono text-xs rounded-xl bg-stone-800/90 border border-stone-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <FileCheck className="w-4 h-4" />
                <span>{uploading ? 'Processing OCR & Analysis...' : 'Submit & Analyze with AI'}</span>
              </button>
            </form>
          </div>
        )}

        {/* AI Inspection Results View */}
        <div className="space-y-6">
          {uploadResult?.ai_analysis ? (
            <div className="bg-stone-900/80 backdrop-blur-xl p-8 rounded-3xl border border-stone-800 shadow-xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                AI Document Inspection Report
              </span>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-stone-300">AI Anomaly Risk Assessment:</span>
                <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                  uploadResult.ai_analysis.ai_risk_score <= 20
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    : 'bg-rose-950/60 text-rose-300 border border-rose-800/50'
                }`}>
                  {uploadResult.ai_analysis.ai_risk_score}/100 Risk
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 text-xs space-y-1">
                <div className="font-bold text-white">Suggested Action:</div>
                <div className="text-stone-300 font-medium">{uploadResult.ai_analysis.suggested_review_status}</div>
              </div>

              {/* Extracted Identifiers */}
              <div className="space-y-2 text-xs">
                <div className="font-bold text-stone-300">Extracted Legal Identifiers:</div>
                <div className="bg-stone-950/60 border border-stone-800 p-3 rounded-xl font-mono text-[11px] text-stone-200 space-y-1">
                  {Object.entries(uploadResult.ai_analysis.extracted_data || {}).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-stone-400">{k}:</span>
                      <span className="font-semibold text-amber-300">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {uploadResult.ai_analysis.inconsistencies?.length > 0 && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 space-y-1">
                  <div className="font-bold">Flagged Discrepancies:</div>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {uploadResult.ai_analysis.inconsistencies.map((inc: string, idx: number) => (
                      <li key={idx}>{inc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-stone-900/80 backdrop-blur-xl p-8 rounded-3xl border border-stone-800 shadow-xl space-y-4 text-xs text-stone-400 text-center py-24">
              <Upload className="w-8 h-8 text-stone-600 mx-auto" />
              <p>Upload a document to trigger the server-side OCR & anomaly extraction pipeline.</p>
            </div>
          )}

          {/* Uploaded Documents List */}
          <div className="bg-stone-900/80 backdrop-blur-xl p-6 rounded-3xl border border-stone-800 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white">Uploaded Document Ledger</h3>
            {(org?.documents || []).length > 0 ? (
              <div className="space-y-2">
                {org.documents.map((d: any) => (
                  <div key={d.id} className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-white">{d.document_name}</div>
                      <div className="text-[10px] text-stone-400">{d.document_type}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-500">No documents uploaded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

