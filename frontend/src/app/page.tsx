'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  FileText, 
  PlusCircle, 
  Search,
  Trash2,
  Edit3,
  UserCheck,
  LayoutDashboard,
  GraduationCap,
  Sparkles
} from 'lucide-react';

const API_BASE_URL = 'https://school-admission-backend-jz8m.onrender.com/api/';

interface Submission {
  id: number;
  applicant_name: string;
  grade_level: string;
  gender: string;
  extracurriculars?: string;
  status: string;
  profile_image?: string;
  document?: string;
}

interface Summary {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
}

const EXTRACURRICULAR_OPTIONS = ['Cricket', 'Chess', 'Swimming', 'Music', 'Dancing', 'Debate'];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'applicant' | 'manager'>('applicant');
  
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [summary, setSummary] = useState<Summary>({ total: 0, pending: 0, accepted: 0, rejected: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    applicant_name: '',
    grade_level: 'Grade 1',
    gender: 'Male',
  });
  const [selectedExtracurriculars, setSelectedExtracurriculars] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Edit State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    applicant_name: '',
    grade_level: 'Grade 1',
    gender: 'Male',
    extracurriculars: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subRes, sumRes] = await Promise.all([
        axios.get(`${API_BASE_URL}submissions/`),
        axios.get(`${API_BASE_URL}submissions/summary/`)
      ]);
      setSubmissions(subRes.data);
      setSummary(sumRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getMediaUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://127.0.0.1:8000${url}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (activity: string) => {
    if (selectedExtracurriculars.includes(activity)) {
      setSelectedExtracurriculars(selectedExtracurriculars.filter(item => item !== activity));
    } else {
      setSelectedExtracurriculars([...selectedExtracurriculars, activity]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('applicant_name', formData.applicant_name);
    data.append('grade_level', formData.grade_level);
    data.append('gender', formData.gender);
    data.append('extracurriculars', selectedExtracurriculars.join(', '));
    if (profileImage) data.append('profile_image', profileImage);
    if (documentFile) data.append('document', documentFile);

    try {
      await axios.post(`${API_BASE_URL}submissions/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Application submitted successfully! Switch to Admin Dashboard to review.');
      
      // Reset form
      setFormData({ applicant_name: '', grade_level: 'Grade 1', gender: 'Male' });
      setSelectedExtracurriculars([]);
      setProfileImage(null);
      setDocumentFile(null);
      setImagePreview(null);
      fetchData();
    } catch (error: any) {
      console.error("Submission failed:", error.response?.data || error.message);
      alert('Failed to submit application. Please check fields.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await axios.patch(`${API_BASE_URL}submissions/${id}/`, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error("Failed to update status", error);
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this applicant record?')) {
      try {
        await axios.delete(`${API_BASE_URL}submissions/${id}/`);
        fetchData();
      } catch (error) {
        console.error("Failed to delete submission", error);
        alert('Failed to delete record.');
      }
    }
  };

  const startEdit = (sub: Submission) => {
    setEditingId(sub.id);
    setEditFormData({
      applicant_name: sub.applicant_name,
      grade_level: sub.grade_level,
      gender: sub.gender,
      extracurriculars: sub.extracurriculars || '',
    });
  };

  const handleEditSubmit = async (id: number) => {
    try {
      await axios.patch(`${API_BASE_URL}submissions/${id}/`, editFormData);
      setEditingId(null);
      fetchData();
    } catch (error) {
      console.error("Failed to update submission", error);
      alert('Failed to update record.');
    }
  };

  const filteredSubmissions = submissions.filter((sub) => 
    sub.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.grade_level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="bg-white border border-slate-200/80 shadow-sm rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <GraduationCap size={28} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">School Admission Portal</h1>
              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Sparkles size={14} className="text-indigo-500" /> Fore Forms AB — Full-Stack Internship Evaluation
              </p>
            </div>
          </div>

          {/* Role Navigation Switcher Tabs */}
          <div className="bg-slate-100 p-1.5 rounded-xl flex gap-1 w-full md:w-auto">
            <button 
              onClick={() => setActiveTab('applicant')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'applicant' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck size={18} /> Applicant Portal
            </button>
            <button 
              onClick={() => setActiveTab('manager')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'manager' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard size={18} /> Admin Dashboard
            </button>
          </div>
        </header>

        {/* ================= TAB 1: APPLICANT FORM ================= */}
        {activeTab === 'applicant' && (
          <div className="max-w-2xl mx-auto bg-white border border-slate-200/80 shadow-sm rounded-2xl p-8">
            <div className="mb-6 border-b pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <PlusCircle className="text-indigo-600" size={22} /> Student Admission Form
              </h2>
              <p className="text-xs text-slate-500 mt-1">Submit your details, documents, and extracurricular preferences below.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  name="applicant_name" 
                  value={formData.applicant_name} 
                  onChange={handleChange} 
                  required
                  placeholder="e.g. Kasun Perera"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Grade Level</label>
                  <select 
                    name="grade_level" 
                    value={formData.grade_level} 
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition cursor-pointer"
                  >
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 6">Grade 6</option>
                    <option value="Grade 10">Grade 10</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender</label>
                  <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition cursor-pointer"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Checkboxes */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Extracurricular Activities</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                  {EXTRACURRICULAR_OPTIONS.map((activity) => (
                    <label key={activity} className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={selectedExtracurriculars.includes(activity)}
                        onChange={() => handleCheckboxChange(activity)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                      />
                      {activity}
                    </label>
                  ))}
                </div>
              </div>

              {/* Profile Image with Preview */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Profile Photo (JPG/PNG)</label>
                <input 
                  type="file" 
                  accept=".jpg,.jpeg,.png" 
                  onChange={handleImageChange}
                  required
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer border border-slate-300 rounded-xl bg-slate-50"
                />
                {imagePreview && (
                  <div className="mt-3 relative w-20 h-20 rounded-xl overflow-hidden border-2 border-indigo-200 shadow-sm">
                    <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
                  </div>
                )}
              </div>

              {/* Document Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Supporting Document (PDF/DOCX)</label>
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  onChange={handleDocChange}
                  required
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 cursor-pointer border border-slate-300 rounded-xl bg-slate-50"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition duration-200 shadow-md shadow-indigo-100 text-base cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}

        {/* ================= TAB 2: MANAGER / ADMIN DASHBOARD ================= */}
        {activeTab === 'manager' && (
          <div className="space-y-8">
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Applications</p>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{summary.total}</h3>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Users size={22} /></div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Pending Review</p>
                  <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{summary.pending}</h3>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock size={22} /></div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Accepted</p>
                  <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">{summary.accepted}</h3>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle size={22} /></div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-rose-500 uppercase tracking-wider">Rejected</p>
                  <h3 className="text-2xl font-extrabold text-rose-600 mt-1">{summary.rejected}</h3>
                </div>
                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl"><XCircle size={22} /></div>
              </div>
            </div>

            {/* Submissions Management Table */}
            <div className="bg-white border border-slate-200/80 shadow-sm rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="text-indigo-600" size={20} /> Manage Submissions
                </h2>
                
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search applicant name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                      <th className="py-3 px-4 font-bold">Applicant</th>
                      <th className="py-3 px-4 font-bold">Grade</th>
                      <th className="py-3 px-4 font-bold">Extracurriculars</th>
                      <th className="py-3 px-4 font-bold">Status</th>
                      <th className="py-3 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSubmissions.length > 0 ? (
                      filteredSubmissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50/60 transition">
                          
                          {/* Applicant Info */}
                          <td className="py-3.5 px-4 font-medium text-slate-900">
                            {editingId === sub.id ? (
                              <input 
                                type="text"
                                value={editFormData.applicant_name}
                                onChange={(e) => setEditFormData({...editFormData, applicant_name: e.target.value})}
                                className="border px-2 py-1 rounded text-sm w-full"
                              />
                            ) : (
                              <div className="flex items-center gap-3">
                                {sub.profile_image ? (
                                  <img 
                                    src={getMediaUrl(sub.profile_image)} 
                                    alt="Profile" 
                                    className="w-10 h-10 rounded-full object-cover border shadow-sm" 
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                                    {sub.applicant_name.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <div className="font-bold text-slate-900">{sub.applicant_name}</div>
                                  <div className="text-xs text-slate-400">{sub.gender}</div>
                                </div>
                              </div>
                            )}
                          </td>

                          {/* Grade Level */}
                          <td className="py-3.5 px-4 text-slate-600">
                            {editingId === sub.id ? (
                              <select 
                                value={editFormData.grade_level}
                                onChange={(e) => setEditFormData({...editFormData, grade_level: e.target.value})}
                                className="border px-2 py-1 rounded text-sm"
                              >
                                <option value="Grade 1">Grade 1</option>
                                <option value="Grade 6">Grade 6</option>
                                <option value="Grade 10">Grade 10</option>
                              </select>
                            ) : (
                              sub.grade_level
                            )}
                          </td>

                          {/* Extracurriculars */}
                          <td className="py-3.5 px-4 text-slate-600 text-xs max-w-xs truncate" title={sub.extracurriculars}>
                            {editingId === sub.id ? (
                              <input 
                                type="text"
                                value={editFormData.extracurriculars}
                                onChange={(e) => setEditFormData({...editFormData, extracurriculars: e.target.value})}
                                className="border px-2 py-1 rounded text-sm w-full"
                              />
                            ) : (
                              sub.extracurriculars || 'None'
                            )}
                          </td>

                          {/* Status Dropdown */}
                          <td className="py-3.5 px-4">
                            <select 
                              value={sub.status} 
                              onChange={(e) => handleStatusChange(sub.id, e.target.value)}
                              className={`text-xs font-bold px-3 py-1.5 rounded-xl border outline-none cursor-pointer shadow-sm ${
                                sub.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                sub.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                                'bg-amber-50 text-amber-700 border-amber-200'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Accepted">Accepted</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {sub.document && (
                                <a 
                                  href={getMediaUrl(sub.document)} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="text-indigo-600 hover:bg-indigo-50 text-xs font-semibold px-2.5 py-1.5 bg-indigo-50/70 rounded-lg border border-indigo-100 transition"
                                >
                                  📄 View Doc
                                </a>
                              )}
                              
                              {editingId === sub.id ? (
                                <button 
                                  onClick={() => handleEditSubmit(sub.id)}
                                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                                >
                                  Save
                                </button>
                              ) : (
                                <button 
                                  onClick={() => startEdit(sub)}
                                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                  title="Edit Record"
                                >
                                  <Edit3 size={16} />
                                </button>
                              )}

                              <button 
                                onClick={() => handleDelete(sub.id)}
                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                title="Delete Record"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-10 text-slate-400 font-medium">No application records found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}