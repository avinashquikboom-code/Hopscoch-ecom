'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowUp, 
  ArrowDown, 
  RefreshCw,
  SlidersHorizontal,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { searchKeywordService, SearchKeywordItem } from '@/services/search-keyword.service';

export default function AdminSearchKeywordsPage() {
  const [keywords, setKeywords] = useState<SearchKeywordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'ALL' | 'POPULAR' | 'TRENDING'>('ALL');
  const [searchFilter, setSearchFilter] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SearchKeywordItem | null>(null);
  const [formData, setFormData] = useState({
    keyword: '',
    type: 'POPULAR' as 'POPULAR' | 'TRENDING',
    priority: 0,
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Delete modal state
  const [deleteItem, setDeleteItem] = useState<SearchKeywordItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadKeywords();
  }, [filterType, searchFilter]);

  const loadKeywords = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await searchKeywordService.getAdminKeywords(filterType, searchFilter);
      setKeywords(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load search keywords');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      keyword: '',
      type: 'POPULAR',
      priority: keywords.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: SearchKeywordItem) => {
    setEditingItem(item);
    setFormData({
      keyword: item.keyword,
      type: item.type || 'POPULAR',
      priority: item.priority ?? 0,
      isActive: item.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.keyword.trim()) return;

    setSaving(true);
    setErrorMessage('');
    try {
      if (editingItem) {
        await searchKeywordService.updateKeyword(editingItem.id, formData);
      } else {
        await searchKeywordService.createKeyword(formData);
      }
      setIsModalOpen(false);
      loadKeywords();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save keyword');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (item: SearchKeywordItem) => {
    try {
      const updatedStatus = !item.isActive;
      // Optimistic update
      setKeywords(prev => prev.map(k => k.id === item.id ? { ...k, isActive: updatedStatus } : k));
      await searchKeywordService.updateKeywordStatus(item.id, updatedStatus);
    } catch (err: any) {
      loadKeywords();
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      await searchKeywordService.deleteKeyword(deleteItem.id);
      setDeleteItem(null);
      loadKeywords();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete keyword');
    } finally {
      setDeleting(false);
    }
  };

  const handlePriorityChange = async (item: SearchKeywordItem, newPriority: number) => {
    if (newPriority < 0) return;
    try {
      setKeywords(prev => prev.map(k => k.id === item.id ? { ...k, priority: newPriority } : k));
      await searchKeywordService.updateKeyword(item.id, { priority: newPriority });
    } catch (err) {
      loadKeywords();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-[#0d9488] uppercase tracking-wider">Content Management</span>
            <span className="text-gray-300">/</span>
            <span className="text-xs font-bold text-gray-500">Search Keywords</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white mt-1">
            Search Keywords Management
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Manage dynamic Popular and Trending search keywords displayed across Website &amp; Mobile App.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={loadKeywords}
            className="h-10 px-3 border-gray-200 dark:border-gray-700"
          >
            <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            onClick={handleOpenAddModal}
            className="h-10 px-4 bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Keyword</span>
          </Button>
        </div>
      </div>

      {/* Filter & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        {/* Type Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          {[
            { id: 'ALL', label: 'All Keywords' },
            { id: 'POPULAR', label: 'Popular' },
            { id: 'TRENDING', label: 'Trending 🔥' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer border-none ${
                filterType === tab.id
                  ? 'bg-white dark:bg-gray-900 text-[#0d9488] shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input filter */}
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search keywords..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="pl-9 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-xs"
          />
        </div>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#0d9488]" />
            <span className="text-xs font-semibold">Loading search keywords...</span>
          </div>
        ) : keywords.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center gap-3">
            <Search className="w-12 h-12 text-gray-300 dark:text-gray-700" />
            <div>
              <p className="font-bold text-sm text-gray-800 dark:text-gray-200">No Search Keywords Found</p>
              <p className="text-xs text-gray-500 mt-1">Get started by creating your first keyword or resetting filters.</p>
            </div>
            <Button onClick={handleOpenAddModal} size="sm" className="bg-[#0d9488] text-white text-xs mt-2">
              Add Keyword
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-gray-500 font-extrabold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 w-24">Priority</th>
                  <th className="py-3.5 px-4">Keyword Name</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Search Volume</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-semibold text-gray-800 dark:text-gray-200">
                {keywords.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors">
                    {/* Priority Control */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        <span className="font-mono font-bold text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
                          #{item.priority ?? 0}
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => handlePriorityChange(item, (item.priority ?? 0) - 1)}
                            className="p-0.5 hover:text-[#0d9488] text-gray-400 cursor-pointer border-none bg-transparent"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handlePriorityChange(item, (item.priority ?? 0) + 1)}
                            className="p-0.5 hover:text-[#0d9488] text-gray-400 cursor-pointer border-none bg-transparent"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Keyword Name */}
                    <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white">
                      {item.keyword}
                    </td>

                    {/* Type Badge */}
                    <td className="py-3.5 px-4">
                      {item.type === 'TRENDING' ? (
                        <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2.5 py-0.5 font-extrabold text-[10px] flex items-center gap-1 w-max">
                          <Sparkles className="w-3 h-3 fill-amber-500" />
                          TRENDING
                        </Badge>
                      ) : (
                        <Badge className="bg-teal-500/15 text-[#0d9488] border border-teal-500/30 px-2.5 py-0.5 font-extrabold text-[10px] flex items-center gap-1 w-max">
                          <TrendingUp className="w-3 h-3" />
                          POPULAR
                        </Badge>
                      )}
                    </td>

                    {/* Search Count Analytics */}
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-600 dark:text-gray-400">
                      {item.searchCount ?? 0} searches
                    </td>

                    {/* Active/Inactive Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 cursor-pointer border transition-colors ${
                          item.isActive !== false
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                            : 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                        }`}
                      >
                        {item.isActive !== false ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span>ACTIVE</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-gray-400" />
                            <span>INACTIVE</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditModal(item)}
                          className="h-8 w-8 p-0 text-gray-600 hover:text-[#0d9488]"
                          title="Edit Keyword"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteItem(item)}
                          className="h-8 w-8 p-0 text-gray-600 hover:text-rose-600"
                          title="Delete Keyword"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4">
              {editingItem ? 'Edit Search Keyword' : 'Add New Search Keyword'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                  Keyword Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Silk Saree, Anarkali Suit"
                  value={formData.keyword}
                  onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                  required
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                    Type Selection
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-xs font-bold text-gray-800 dark:text-gray-200 outline-none"
                  >
                    <option value="POPULAR" className="bg-white dark:bg-gray-900">POPULAR</option>
                    <option value="TRENDING" className="bg-white dark:bg-gray-900">TRENDING 🔥</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                    Priority Order
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value, 10) || 0 })}
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Active Status</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer transition-colors ${
                    formData.isActive
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400'
                      : 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                >
                  {formData.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="h-9 px-4 text-xs rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="h-9 px-5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold rounded-xl"
                >
                  {saving ? 'Saving...' : editingItem ? 'Update Keyword' : 'Create Keyword'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
              Delete Search Keyword?
            </h3>
            <p className="text-xs text-gray-500">
              Are you sure you want to delete <span className="font-bold text-gray-800 dark:text-gray-200">"{deleteItem.keyword}"</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setDeleteItem(null)}
                className="h-9 px-4 text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleting}
                className="h-9 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
              >
                {deleting ? 'Deleting...' : 'Delete Keyword'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
