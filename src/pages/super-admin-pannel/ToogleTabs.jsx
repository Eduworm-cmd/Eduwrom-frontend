import { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, Users, NotebookPen, Settings } from "lucide-react";

const iconMap = {
  'LayoutDashboard': LayoutDashboard,
  'Users': Users,
  'NotebookPen': NotebookPen,
  'Settings': Settings
};

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    icon: 'LayoutDashboard',
    forRole: 'superadmin',
    parent: '',
    isParent: false,
    order: 0,
    type: 'main'
  });
  const [parents, setParents] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    // Fetch all menu items
    fetchMenuItems();
  }, []);

  useEffect(() => {
    // Extract parents for dropdown selection
    const parentItems = menuItems.filter(item => item.isParent)
      .map(item => ({ id: item._id, title: item.title }));
    setParents(parentItems);
  }, [menuItems]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/api/menu/items/all');
      
      if (response.data.success) {
        setMenuItems(response.data.data);
      } else {
        setError('Failed to load menu items');
      }
    } catch (err) {
      setError('Error connecting to server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMenuItem = async (id) => {
    try {
      const response = await axios.patch(`http://localhost:4000/api/menu/item/${id}/toggle`);
      
      if (response.data.success) {
        // Update the local state to reflect the change
        setMenuItems(menuItems.map(item => 
          item._id === id ? {...item, isActive: !item.isActive} : item
        ));
      }
    } catch (err) {
      alert('Failed to toggle menu item: ' + err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Update existing item
        const response = await axios.put(`http://localhost:4000/api/menu/item/${editingId}`, formData);
        if (response.data.success) {
          setMenuItems(menuItems.map(item => 
            item._id === editingId ? response.data.data : item
          ));
          resetForm();
        }
      } else {
        // Create new item
        const response = await axios.post('http://localhost:4000/api/menu/item', formData);
        if (response.data.success) {
          setMenuItems([...menuItems, response.data.data]);
          resetForm();
        }
      }
    } catch (err) {
      alert(`Failed to ${editingId ? 'update' : 'create'} menu item: ${err.message}`);
    }
  };

  const editMenuItem = (item) => {
    setFormData({
      title: item.title,
      url: item.url,
      icon: item.icon || 'LayoutDashboard',
      forRole: item.forRole,
      parent: item.parent || '',
      isParent: item.isParent,
      order: item.order,
      type: item.type
    });
    setEditingId(item._id);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      url: '',
      icon: 'LayoutDashboard',
      forRole: 'superadmin',
      parent: '',
      isParent: false,
      order: 0,
      type: 'main'
    });
    setEditingId(null);
  };
  
  // Group menu items by role for easier management
  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.forRole]) {
      acc[item.forRole] = [];
    }
    acc[item.forRole].push(item);
    return acc;
  }, {});

  if (loading) return <div className="flex justify-center p-6">Loading menu items...</div>;
  if (error) return <div className="text-red-500 p-6">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Menu Management</h1>
      
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Menu Item' : 'Add New Menu Item'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block mb-1">URL</label>
              <input
                type="text"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block mb-1">Icon</label>
              <select
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="LayoutDashboard">Dashboard</option>
                <option value="Users">Users</option>
                <option value="NotebookPen">Notebook</option>
                <option value="Settings">Settings</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-1">Role</label>
              <select
                name="forRole"
                value={formData.forRole}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="superadmin">Super Admin</option>
                <option value="schooladmin">School Admin</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-1">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="main">Main Navigation</option>
                <option value="button">Top Button</option>
                <option value="footerBtn">Footer Button</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-1">Order</label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="isParent"
                name="isParent"
                checked={formData.isParent}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="isParent">Is Parent Menu</label>
            </div>
            
            {!formData.isParent && formData.type === 'main' && (
              <div>
                <label className="block mb-1">Parent Menu</label>
                <select
                  name="parent"
                  value={formData.parent}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Parent Menu</option>
                  {parents.map(parent => (
                    <option key={parent.id} value={parent.title}>
                      {parent.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {editingId ? 'Update Item' : 'Add Item'}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      {Object.keys(groupedMenuItems).map(role => (
        <div key={role} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 capitalize">{role} Menu Items</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">Title</th>
                  <th className="py-2 px-4 border-b text-left">Type</th>
                  <th className="py-2 px-4 border-b text-left">URL</th>
                  <th className="py-2 px-4 border-b text-left">Parent</th>
                  <th className="py-2 px-4 border-b text-left">Icon</th>
                  <th className="py-2 px-4 border-b text-left">Order</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupedMenuItems[role].map(item => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{item.title}</td>
                    <td className="py-2 px-4 border-b">{item.type}{item.isParent ? ' (parent)' : ''}</td>
                    <td className="py-2 px-4 border-b">{item.url}</td>
                    <td className="py-2 px-4 border-b">{item.parent || '-'}</td>
                    <td className="py-2 px-4 border-b">{item.icon || '-'}</td>
                    <td className="py-2 px-4 border-b">{item.order}</td>
                    <td className="py-2 px-4 border-b">
                      <span className={`inline-block px-2 py-1 rounded ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b flex gap-2">
                      <button 
                        onClick={() => toggleMenuItem(item._id)}
                        className={`px-2 py-1 rounded ${item.isActive ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                      >
                        {item.isActive ? 'Hide' : 'Show'}
                      </button>
                      <button 
                        onClick={() => editMenuItem(item)}
                        className="px-2 py-1 rounded bg-blue-500 text-white"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}