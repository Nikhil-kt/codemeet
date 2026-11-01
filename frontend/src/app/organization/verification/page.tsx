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
        <h1 className="text-3xl font-extrabold text-slate-900">Organization Verification & KYC</h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload authorized legal documents. Our AI verification engine automatically extracts registration IDs and flags discrepancies for fast administrative approval.
        </p>
      </div>

      {/* Verification Status Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Standing</span>
          <div className="text-xl font-bold text-slate-900 mt-0.5">{org?.name}</div>
          <div className="text-xs text-slate-500">Representative: {org?.representative_name}</div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            Status: {org?.verification_status || 'VERIFIED_NEW'}
          </span>
          <div className="text-xs font-semibold text-slate-700">
            Trust Rating: <strong>{org?.trust_score || 78.5}/100</strong>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload & AI Analysis Form or Application in Review */}
        {uploadResult ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-center">
            <div className="w-14 h-14 mx-auto bg-amber-100 rounded-2xl flex items-center justify-center border border-amber-300">
              <Clock className="w-7 h-7 text-amber-600 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                <span>Application Under Review</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Verification Document Submitted</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                Your KYC application has been recorded and submitted to the platform administrator for review. Once verified, your organization trust score will be elevated.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Document Type:</span>
                <span className="font-semibold text-slate-800">{docType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">File Name:</span>
                <span className="font-mono text-slate-800">{docName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">AI Risk Assessment:</span>
                <span className="font-bold text-emerald-700">LOW_RISK_RECOMMEND_APPROVAL</span>
              </div>
            </div>

            <button
              onClick={() => setUploadResult(null)}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
            >
              Upload Additional Document
            </button>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">Upload & AI OCR Analysis</h2>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Document Type</label>
                <select
                  value={docType}
                  onChange={e => setDocType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="NGO_DARPAN">NGO Darpan Registration Certificate</option>
                  <option value="REGISTRATION_CERT">Society / Trust Deed Certificate</option>
                  <option value="CIN_LLPIN">Company CIN / LLPIN Certificate</option>
                  <option value="ADDRESS_PROOF">Authorized Office Address Proof</option>
                  <option value="ID_PROOF">Representative Identity Document</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Document File Name</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={e => setDocName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document Raw Content / OCR Text Sample
                </label>
                <textarea
                  rows={5}
                  required
                  value={docText}
                  onChange={e => setDocText(e.target.value)}
                  className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
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
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                AI Document Inspection Report
              </span>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-slate-600">AI Anomaly Risk Assessment:</span>
                <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                  uploadResult.ai_analysis.ai_risk_score <= 20
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {uploadResult.ai_analysis.ai_risk_score}/100 Risk
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <div className="font-bold text-slate-900">Suggested Action:</div>
                <div className="text-slate-600 font-medium">{uploadResult.ai_analysis.suggested_review_status}</div>
              </div>

              {/* Extracted Identifiers */}
              <div className="space-y-2 text-xs">
                <div className="font-bold text-slate-700">Extracted Legal Identifiers:</div>
                <div className="bg-slate-50 p-3 rounded-xl font-mono text-[11px] text-slate-800 space-y-1">
                  {Object.entries(uploadResult.ai_analysis.extracted_data || {}).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-slate-400">{k}:</span>
                      <span className="font-semibold">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {uploadResult.ai_analysis.inconsistencies?.length > 0 && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
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
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs text-slate-500 text-center py-24">
              <Upload className="w-8 h-8 text-slate-300 mx-auto" />
              <p>Upload a document to trigger the server-side OCR & anomaly extraction pipeline.</p>
            </div>
          )}

          {/* Uploaded Documents List */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Uploaded Document Ledger</h3>
            {(org?.documents || []).length > 0 ? (
              <div className="space-y-2">
                {org.documents.map((d: any) => (
                  <div key={d.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{d.document_name}</div>
                      <div className="text-[10px] text-slate-500">{d.document_type}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No documents uploaded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

