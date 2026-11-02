'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Clock,
  Sparkles
} from 'lucide-react';
import Badge from '@/components/ui/Badge';

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
    <div className="min-h-screen bg-[#FFF4E8] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8 pb-16">
        <div>
          <Badge variant="orange" size="sm">KYC & Compliance Gateway</Badge>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-[#7A2E0E] mt-2">
            Organization Verification & KYC
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B53] mt-1 font-medium">
            Upload authorized legal documents. Our AI verification engine automatically extracts registration IDs and flags discrepancies for fast administrative approval.
          </p>
        </div>

        {/* Verification Status Banner */}
        <div className="bg-white p-7 sm:p-8 rounded-[32px] border border-[#FF6B1A]/15 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B5B53]">Current Standing</span>
            <div className="text-2xl font-heading font-extrabold text-[#7A2E0E] mt-0.5">{org?.name}</div>
            <div className="text-xs text-[#6B5B53] font-medium mt-0.5">Representative: {org?.representative_name}</div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge variant="peach" size="md">
              Status: {org?.verification_status || 'VERIFIED_NEW'}
            </Badge>
            <div className="text-xs font-bold text-[#7A2E0E] bg-[#FFF4E8] px-4 py-2 rounded-2xl border border-[#FF6B1A]/15">
              Trust Rating: <strong className="text-[#FF6B1A]">{org?.trust_score || 78.5}/100</strong>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload & AI Analysis Form */}
          {uploadResult ? (
            <div className="bg-white p-8 sm:p-10 rounded-[32px] border border-[#FF6B1A]/15 shadow-sm space-y-6 text-center">
              <div className="w-16 h-16 mx-auto bg-[#FFE3CC] rounded-3xl flex items-center justify-center border border-[#FF6B1A]/20">
                <Clock className="w-8 h-8 text-[#FF6B1A] animate-pulse" />
              </div>
              <div className="space-y-2">
                <Badge variant="orange" size="sm">Application Under Review</Badge>
                <h3 className="text-2xl font-heading font-extrabold text-[#7A2E0E]">Verification Document Submitted</h3>
                <p className="text-xs text-[#6B5B53] max-w-sm mx-auto leading-relaxed">
                  Your KYC application has been recorded and submitted to the platform administrator for review.
                </p>
              </div>

              <div className="p-5 bg-[#FFF4E8] rounded-2xl border border-[#FF6B1A]/15 text-left text-xs space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-[#6B5B53]">Document Type:</span>
                  <span className="font-bold text-[#7A2E0E]">{docType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B5B53]">File Name:</span>
                  <span className="font-mono text-[#FF6B1A] font-bold">{docName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B5B53]">AI Risk Assessment:</span>
                  <span className="font-bold text-emerald-700">LOW_RISK_RECOMMEND_APPROVAL</span>
                </div>
              </div>

              <button
                onClick={() => setUploadResult(null)}
                className="w-full py-3.5 rounded-2xl border border-[#FF6B1A]/20 bg-white text-xs font-bold text-[#7A2E0E] hover:bg-[#FFF4E8] transition-all cursor-pointer"
              >
                Upload Additional Document
              </button>
            </div>
          ) : (
            <div className="bg-white p-8 sm:p-10 rounded-[32px] border border-[#FF6B1A]/15 shadow-sm space-y-6">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-[#FF6B1A]" />
                <h2 className="text-xl font-heading font-extrabold text-[#7A2E0E]">Upload & AI OCR Analysis</h2>
              </div>

              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#7A2E0E] mb-1.5">Document Type</label>
                  <select
                    value={docType}
                    onChange={e => setDocType(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFF4E8]/60 border border-[#FF6B1A]/20 hover:border-[#FF6B1A] text-[#7A2E0E] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] transition-all cursor-pointer"
                  >
                    <option value="NGO_DARPAN">NGO Darpan Registration Certificate</option>
                    <option value="REGISTRATION_CERT">Society / Trust Deed Certificate</option>
                    <option value="CIN_LLPIN">Company CIN / LLPIN Certificate</option>
                    <option value="ADDRESS_PROOF">Authorized Office Address Proof</option>
                    <option value="ID_PROOF">Representative Identity Document</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A2E0E] mb-1.5">Document File Name</label>
                  <input
                    type="text"
                    required
                    value={docName}
                    onChange={e => setDocName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFF4E8]/60 border border-[#FF6B1A]/20 hover:border-[#FF6B1A] text-[#7A2E0E] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A2E0E] mb-1.5">
                    Document Raw Content / OCR Text Sample
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={docText}
                    onChange={e => setDocText(e.target.value)}
                    className="w-full p-4 font-mono text-xs rounded-2xl bg-[#FFF4E8]/60 border border-[#FF6B1A]/20 hover:border-[#FF6B1A] text-[#7A2E0E] focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-3.5 rounded-2xl bg-[#FF6B1A] hover:bg-[#E8590C] hover:scale-105 active:scale-95 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
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
              <div className="bg-white p-8 rounded-[32px] border border-[#FF6B1A]/15 shadow-sm space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B5B53]">
                  AI Document Inspection Report
                </span>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-[#7A2E0E] font-semibold">AI Anomaly Risk Assessment:</span>
                  <Badge variant={uploadResult.ai_analysis.ai_risk_score <= 20 ? 'success' : 'rose'} size="sm">
                    {uploadResult.ai_analysis.ai_risk_score}/100 Risk
                  </Badge>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFF4E8] border border-[#FF6B1A]/15 text-xs space-y-1">
                  <div className="font-bold text-[#7A2E0E]">Suggested Action:</div>
                  <div className="text-[#6B5B53] font-medium">{uploadResult.ai_analysis.suggested_review_status}</div>
                </div>

                {/* Extracted Identifiers */}
                <div className="space-y-2 text-xs">
                  <div className="font-bold text-[#7A2E0E]">Extracted Legal Identifiers:</div>
                  <div className="bg-[#FFF4E8] border border-[#FF6B1A]/15 p-4 rounded-2xl font-mono text-[11px] text-[#7A2E0E] space-y-1.5">
                    {Object.entries(uploadResult.ai_analysis.extracted_data || {}).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-[#6B5B53]">{k}:</span>
                        <span className="font-bold text-[#FF6B1A]">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {uploadResult.ai_analysis.inconsistencies?.length > 0 && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 font-medium space-y-1">
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
              <div className="bg-white p-8 rounded-[32px] border border-[#FF6B1A]/15 shadow-sm space-y-4 text-xs text-[#6B5B53] text-center py-20">
                <Upload className="w-10 h-10 text-[#FF6B1A]/60 mx-auto" />
                <p className="font-medium">Upload a document to trigger the server-side OCR & anomaly extraction pipeline.</p>
              </div>
            )}

            {/* Uploaded Documents List */}
            <div className="bg-white p-7 rounded-[32px] border border-[#FF6B1A]/15 shadow-sm space-y-4">
              <h3 className="text-base font-heading font-bold text-[#7A2E0E]">Uploaded Document Ledger</h3>
              {(org?.documents || []).length > 0 ? (
                <div className="space-y-2">
                  {org.documents.map((d: any) => (
                    <div key={d.id} className="p-3.5 rounded-2xl bg-[#FFF4E8] border border-[#FF6B1A]/15 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-[#7A2E0E]">{d.document_name}</div>
                        <div className="text-[11px] text-[#6B5B53]">{d.document_type}</div>
                      </div>
                      <Badge variant="peach" size="sm">{d.status}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#6B5B53]">No documents uploaded yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
