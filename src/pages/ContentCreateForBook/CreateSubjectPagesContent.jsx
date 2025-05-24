import { Trash2, Plus } from 'lucide-react';
import React, { useState } from 'react';
import RichtoolEditor from '@/components/RichtoolEditor/RichtoolEditor';
import { subjectPageContentCreate } from '@/Network/Super_Admin/auth';
import { useLocation, useParams } from 'react-router-dom';

const defaultObjective = { objectiveTitle: '', objectiveValue: '' };
const defaultActivity = { title: '', link: '', poster: null };

const CreateSubjectPagesContent = () => {
  const { id: SubjectPageId } = useParams();
  const { classId, subjectId } = useLocation().state || {};

  const [formData, setFormData] = useState({
    contentAvtar: null,
    title: '',
    duration: '',
    objectives: [defaultObjective],
    interactiveActivity: [defaultActivity],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (key, index = null, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => {
        if (index === null) return { ...prev, [key]: reader.result };
        const updated = [...prev[key]];
        updated[index].poster = reader.result;
        return { ...prev, [key]: updated };
      });
    };
    reader.readAsDataURL(file);
  };

  const handleListChange = (key, index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev[key]];
      updated[index][field] = value;
      return { ...prev, [key]: updated };
    });
  };

  const addListItem = (key, defaultItem) => {
    setFormData((prev) => ({
      ...prev,
      [key]: [...prev[key], { ...defaultItem }],
    }));
  };

  const removeListItem = (key, index) => {
    setFormData((prev) => {
      const list = [...prev[key]];
      list.splice(index, 1);
      return { ...prev, [key]: list.length ? list : [{ ...defaultObjective }] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const { title, duration, contentAvtar, objectives } = formData;

    if (!title || !duration || !contentAvtar) {
      setError('Please fill all required fields.');
      setLoading(false);
      return;
    }

    if (objectives.some((o) => !o.objectiveTitle.trim() || !o.objectiveValue.trim())) {
      setError('Please complete all objective fields.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        classId,
        SubjectId: subjectId,
        SubjectPageId,
        ...formData,
      };
      const response = await subjectPageContentCreate(payload);
      if (response.data.success) {
        setSuccess(true);
        setFormData({
          contentAvtar: null,
          title: '',
          duration: '',
          objectives: [defaultObjective],
          interactiveActivity: [defaultActivity],
        });
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create content.');
    } finally {
      setLoading(false);
    }
  };

  const renderList = (list, key, template, renderFields) => (
    <div>
      {list.map((item, idx) => (
        <div key={idx} className="relative bg-gray-100 p-4 mb-4 rounded-lg space-y-3">
          {list.length > 1 && (
            <button
              type="button"
              className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 p-1 rounded"
              onClick={() => removeListItem(key, idx)}
            >
              <Trash2 size={16} />
            </button>
          )}
          {renderFields(item, idx)}
        </div>
      ))}
      <button
        type="button"
        onClick={() => addListItem(key, template)}
        className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
      >
        <Plus size={18} /> Add {key === 'objectives' ? 'Objective' : 'Activity'}
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-6 text-center">Add Subject Page Content</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">Content added successfully!</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              placeholder="Enter title"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Duration *</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              placeholder="e.g. 45 mins"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Content Image *</label>
          <input
            type="file"
            accept="image/*"
            className="w-full border p-2 rounded"
            onChange={(e) => handleFileChange('contentAvtar', null, e)}
          />
          {formData.contentAvtar && (
            <img src={formData.contentAvtar} alt="Preview" className="h-24 mt-2 rounded object-cover" />
          )}
        </div>

        <div>
          <label className="block font-medium mb-2">Objectives *</label>
          {renderList(formData.objectives, 'objectives', defaultObjective, (item, idx) => (
            <>
              <input
                type="text"
                placeholder="Objective Title"
                className="w-full border p-2 rounded"
                value={item.objectiveTitle}
                onChange={(e) => handleListChange('objectives', idx, 'objectiveTitle', e.target.value)}
              />
              <RichtoolEditor
                editorValue={item.objectiveValue}
                onEditorChange={(val) => handleListChange('objectives', idx, 'objectiveValue', val)}
              />
            </>
          ))}
        </div>

        <div>
          <label className="block font-medium mb-2">Interactive Activities</label>
          {renderList(formData.interactiveActivity, 'interactiveActivity', defaultActivity, (item, idx) => (
            <>
              <input
                type="text"
                placeholder="Activity Title"
                className="w-full border p-2 rounded"
                value={item.title}
                onChange={(e) => handleListChange('interactiveActivity', idx, 'title', e.target.value)}
              />
              <input
                type="url"
                placeholder="Activity Link"
                className="w-full border p-2 rounded"
                value={item.link}
                onChange={(e) => handleListChange('interactiveActivity', idx, 'link', e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                className="w-full border p-2 rounded"
                onChange={(e) => handleFileChange('interactiveActivity', idx, e)}
              />
              {item.poster && (
                <img src={item.poster} alt="Poster" className="h-24 mt-2 rounded object-cover" />
              )}
            </>
          ))}
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Create Content'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSubjectPagesContent;
