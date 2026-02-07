import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../config/supabase'
import { useRealtimeProfile } from '../hooks/useRealtimeProfile'
import { 
  LogOut, Save, Plus, Trash2, GripVertical, 
  Image as ImageIcon, Palette, Type, Link as LinkIcon, Lock 
} from 'lucide-react'

export default function AdminDashboard() {
  const { username } = useParams()
  const navigate = useNavigate()
  const { profile, sections, links } = useRealtimeProfile(username)
  
  const [formData, setFormData] = useState({
    bio: '',
    background_color: '#0f0f23',
    text_color: '#e8e8e8',
    button_color: '#1a1a2e',
    button_text_color: '#ffffff'
  })
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })
  const [sectionsData, setSectionsData] = useState([])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [draggedItem, setDraggedItem] = useState(null)
  const [draggedType, setDraggedType] = useState(null) // 'section' or 'link'

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem(`admin_${username}`)
    if (!isAuthenticated) {
      navigate(`/${username}/admin`)
    }
  }, [username, navigate])

  useEffect(() => {
    if (profile) {
      setFormData({
        bio: profile.bio || '',
        background_color: profile.background_color,
        text_color: profile.text_color,
        button_color: profile.button_color,
        button_text_color: profile.button_text_color
      })
    }
  }, [profile])

  useEffect(() => {
    if (sections.length > 0) {
      const formattedSections = sections.map(section => ({
        ...section,
        links: links.filter(link => link.section_id === section.id)
      }))
      setSectionsData(formattedSections)
    } else {
      setSectionsData([])
    }
  }, [sections, links])

  const handleLogout = () => {
    sessionStorage.removeItem(`admin_${username}`)
    navigate(`/${username}/admin`)
  }

  const handleProfileUpdate = async () => {
    setSaving(true)
    setMessage('')
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          bio: formData.bio,
          background_color: formData.background_color,
          text_color: formData.text_color,
          button_color: formData.button_color,
          button_text_color: formData.button_text_color
        })
        .eq('username', username)

      if (error) throw error
      setMessage('✅ Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage('❌ Error updating profile')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleColorChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPasswordMessage('')

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordMessage('❌ New passwords do not match')
      setTimeout(() => setPasswordMessage(''), 3000)
      return
    }

    if (passwordData.new_password.length < 6) {
      setPasswordMessage('❌ Password must be at least 6 characters')
      setTimeout(() => setPasswordMessage(''), 3000)
      return
    }

    try {
      const { data: profileData, error: fetchError } = await supabase
        .from('profiles')
        .select('admin_password')
        .eq('username', username)
        .single()

      if (fetchError) throw fetchError

      if (profileData.admin_password !== passwordData.current_password) {
        setPasswordMessage('❌ Current password is incorrect')
        setTimeout(() => setPasswordMessage(''), 3000)
        return
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ admin_password: passwordData.new_password })
        .eq('username', username)

      if (updateError) throw updateError

      setPasswordMessage('✅ Password changed successfully!')
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      })
      setTimeout(() => setPasswordMessage(''), 3000)
    } catch (error) {
      console.error('Error changing password:', error)
      setPasswordMessage('❌ Error changing password')
      setTimeout(() => setPasswordMessage(''), 3000)
    }
  }

  const removeProfileImage = async () => {
    if (!confirm('Remove profile image?')) return
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ profile_image: null })
        .eq('username', username)

      if (error) throw error
      setMessage('✅ Profile image removed')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error removing image:', error)
      setMessage('❌ Error removing image')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const addSection = async () => {
    try {
      const { error } = await supabase
        .from('sections')
        .insert({
          profile_id: profile.id,
          title: 'New Section',
          position: sectionsData.length
        })

      if (error) throw error
    } catch (error) {
      console.error('Error adding section:', error)
    }
  }

  const updateSection = async (sectionId, updates) => {
    try {
      const { error } = await supabase
        .from('sections')
        .update(updates)
        .eq('id', sectionId)

      if (error) throw error
    } catch (error) {
      console.error('Error updating section:', error)
    }
  }

  const deleteSection = async (sectionId) => {
    if (!confirm('Delete this section and all its links?')) return
    
    try {
      const { error } = await supabase
        .from('sections')
        .delete()
        .eq('id', sectionId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting section:', error)
    }
  }

  const addLink = async (sectionId) => {
    try {
      const section = sectionsData.find(s => s.id === sectionId)
      const { error } = await supabase
        .from('links')
        .insert({
          section_id: sectionId,
          title: 'New Link',
          url: 'https://example.com',
          position: section?.links?.length || 0
        })

      if (error) throw error
    } catch (error) {
      console.error('Error adding link:', error)
    }
  }

  const updateLink = async (linkId, updates) => {
    try {
      const { error } = await supabase
        .from('links')
        .update(updates)
        .eq('id', linkId)

      if (error) throw error
    } catch (error) {
      console.error('Error updating link:', error)
    }
  }

  const removeLinkIcon = async (linkId) => {
    if (!confirm('Remove this link icon?')) return
    
    try {
      const { error } = await supabase
        .from('links')
        .update({ icon_url: null })
        .eq('id', linkId)

      if (error) throw error
    } catch (error) {
      console.error('Error removing icon:', error)
    }
  }

  const deleteLink = async (linkId) => {
    if (!confirm('Delete this link?')) return
    
    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', linkId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting link:', error)
    }
  }

  const uploadImage = async (file, type, itemId) => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${username}/${type}_${itemId}_${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName)

      if (type === 'profile') {
        await supabase
          .from('profiles')
          .update({ profile_image: publicUrl })
          .eq('username', username)
      } else if (type === 'link') {
        await updateLink(itemId, { icon_url: publicUrl })
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image')
    }
  }

  // Drag and Drop Handlers
  const handleDragStart = (e, item, type) => {
    setDraggedItem(item)
    setDraggedType(type)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, targetItem, type) => {
    e.preventDefault()
    
    if (!draggedItem || draggedType !== type) return

    if (type === 'section') {
      await reorderSections(draggedItem, targetItem)
    } else if (type === 'link') {
      await reorderLinks(draggedItem, targetItem)
    }

    setDraggedItem(null)
    setDraggedType(null)
  }

  const reorderSections = async (draggedSection, targetSection) => {
    if (draggedSection.id === targetSection.id) return

    const sortedSections = [...sectionsData]
    const draggedIndex = sortedSections.findIndex(s => s.id === draggedSection.id)
    const targetIndex = sortedSections.findIndex(s => s.id === targetSection.id)

    sortedSections.splice(draggedIndex, 1)
    sortedSections.splice(targetIndex, 0, draggedSection)

    // Update positions in database
    for (let i = 0; i < sortedSections.length; i++) {
      await updateSection(sortedSections[i].id, { position: i })
    }
  }

  const reorderLinks = async (draggedLink, targetLink) => {
    if (draggedLink.id === targetLink.id) return
    if (draggedLink.section_id !== targetLink.section_id) return // Can't drag between sections

    const sectionLinks = sectionsData
      .find(s => s.id === draggedLink.section_id)
      .links.slice()
    
    const draggedIndex = sectionLinks.findIndex(l => l.id === draggedLink.id)
    const targetIndex = sectionLinks.findIndex(l => l.id === targetLink.id)

    sectionLinks.splice(draggedIndex, 1)
    sectionLinks.splice(targetIndex, 0, draggedLink)

    // Update positions in database
    for (let i = 0; i < sectionLinks.length; i++) {
      await updateLink(sectionLinks[i].id, { position: i })
    }
  }

  if (!profile) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f8fafc 0%, #e2e8f0 100%)',
      padding: '2rem 1rem',
      fontFamily: '"DM Sans", sans-serif'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          padding: '1.5rem',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <div>
            <h1 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '0.25rem'
            }}>
              Admin Dashboard
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              @{username}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = '#dc2626'}
            onMouseLeave={(e) => e.target.style.background = '#ef4444'}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {message && (
          <div style={{
            padding: '1rem',
            background: message.includes('❌') ? '#fee2e2' : '#d1fae5',
            color: message.includes('❌') ? '#dc2626' : '#059669',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            {message}
          </div>
        )}

        {/* Profile Settings */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{
            fontSize: '1.3rem',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Palette size={22} />
            Profile Settings
          </h2>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#475569',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              Profile Image
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {profile.profile_image && (
                <div style={{ position: 'relative' }}>
                  <img
                    src={profile.profile_image}
                    alt="Profile"
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                  <button
                    onClick={removeProfileImage}
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    uploadImage(e.target.files[0], 'profile', profile.id)
                  }
                }}
                style={{
                  padding: '0.5rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#475569',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell people about yourself..."
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '1rem',
                fontFamily: '"DM Sans", sans-serif',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            {[
              { label: 'Background Color', key: 'background_color' },
              { label: 'Text Color', key: 'text_color' },
              { label: 'Button Color', key: 'button_color' },
              { label: 'Button Text Color', key: 'button_text_color' }
            ].map(({ label, key }) => (
              <div key={key}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#475569',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  {label}
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={formData[key]}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    style={{
                      width: '50px',
                      height: '40px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  />
                  <input
                    type="text"
                    value={formData[key]}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleProfileUpdate}
            disabled={saving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 1.5rem',
              background: saving ? '#94a3b8' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!saving) e.target.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
            }}
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>

        {/* Password Change Section */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{
            fontSize: '1.3rem',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Lock size={22} />
            Change Password
          </h2>

          <form onSubmit={handlePasswordChange}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#475569',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.current_password}
                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontFamily: '"DM Sans", sans-serif'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#475569',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                New Password
              </label>
              <input
                type="password"
                value={passwordData.new_password}
                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontFamily: '"DM Sans", sans-serif'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#475569',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirm_password}
                onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontFamily: '"DM Sans", sans-serif'
                }}
              />
            </div>

            {passwordMessage && (
              <div style={{
                padding: '1rem',
                background: passwordMessage.includes('❌') ? '#fee2e2' : '#d1fae5',
                color: passwordMessage.includes('❌') ? '#dc2626' : '#059669',
                borderRadius: '12px',
                marginBottom: '1rem',
                textAlign: 'center',
                fontWeight: '500'
              }}>
                {passwordMessage}
              </div>
            )}

            <button
              type="submit"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <Lock size={18} />
              Update Password
            </button>
          </form>
        </div>

        {/* Sections */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <LinkIcon size={22} />
              Sections & Links
            </h2>
            <button
              onClick={addSection}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#059669'}
              onMouseLeave={(e) => e.target.style.background = '#10b981'}
            >
              <Plus size={18} />
              Add Section
            </button>
          </div>

          {sectionsData.map((section) => (
            <SectionEditor
              key={section.id}
              section={section}
              updateSection={updateSection}
              deleteSection={deleteSection}
              addLink={addLink}
              updateLink={updateLink}
              deleteLink={deleteLink}
              uploadImage={uploadImage}
              removeLinkIcon={removeLinkIcon}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              isDragging={draggedItem?.id === section.id && draggedType === 'section'}
            />
          ))}

          {sectionsData.length === 0 && (
            <p style={{
              textAlign: 'center',
              color: '#94a3b8',
              padding: '2rem',
              fontSize: '1rem'
            }}>
              No sections yet. Click "Add Section" to get started!
            </p>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        
        .dragging {
          opacity: 0.5;
        }
        
        .drag-over {
          border: 2px dashed #667eea !important;
          background: #f0f4ff !important;
        }
      `}</style>
    </div>
  )
}

// Section Editor Component
function SectionEditor({ 
  section, 
  updateSection, 
  deleteSection, 
  addLink, 
  updateLink, 
  deleteLink, 
  uploadImage, 
  removeLinkIcon,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging
}) {
  const [title, setTitle] = useState(section.title)
  const [isEditing, setIsEditing] = useState(false)

  const handleSaveTitle = () => {
    updateSection(section.id, { title })
    setIsEditing(false)
  }

  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, section, 'section')}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, section, 'section')}
      className={isDragging ? 'dragging' : ''}
      style={{
        marginBottom: '2rem',
        padding: '1.5rem',
        background: '#f8fafc',
        borderRadius: '12px',
        border: '2px solid #e2e8f0',
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
          <GripVertical 
            size={20} 
            color="#94a3b8" 
            style={{ cursor: 'grab' }} 
            title="Drag to reorder"
          />
          {isEditing ? (
            <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                autoFocus
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: '2px solid #667eea',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  fontFamily: '"DM Sans", sans-serif'
                }}
              />
            </div>
          ) : (
            <h3
              onClick={() => setIsEditing(true)}
              style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#1e293b',
                cursor: 'pointer',
                margin: 0
              }}
            >
              {section.title}
            </h3>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => addLink(section.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.5rem 1rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}
          >
            <Plus size={16} />
            Link
          </button>
          <button
            onClick={() => deleteSection(section.id)}
            style={{
              padding: '0.5rem',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {section.links?.map((link) => (
          <LinkEditor
            key={link.id}
            link={link}
            updateLink={updateLink}
            deleteLink={deleteLink}
            uploadImage={uploadImage}
            removeLinkIcon={removeLinkIcon}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
          />
        ))}
      </div>
    </div>
  )
}

// Link Editor Component
function LinkEditor({ link, updateLink, deleteLink, uploadImage, removeLinkIcon, onDragStart, onDragOver, onDrop }) {
  const [formData, setFormData] = useState({
    title: link.title,
    url: link.url
  })
  const [isDragging, setIsDragging] = useState(false)

  const handleUpdate = (field, value) => {
    setFormData({ ...formData, [field]: value })
    updateLink(link.id, { [field]: value })
  }

  return (
    <div 
      draggable
      onDragStart={(e) => {
        setIsDragging(true)
        onDragStart(e, link, 'link')
      }}
      onDragEnd={() => setIsDragging(false)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, link, 'link')}
      className={isDragging ? 'dragging' : ''}
      style={{
        display: 'flex',
        gap: '0.75rem',
        padding: '1rem',
        background: 'white',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <GripVertical 
          size={18} 
          color="#94a3b8" 
          style={{ cursor: 'grab' }} 
          title="Drag to reorder"
        />
        <div style={{ position: 'relative' }}>
          {link.icon_url ? (
            <div style={{ position: 'relative' }}>
              <img
                src={link.icon_url}
                alt="Icon"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  objectFit: 'cover'
                }}
              />
              <button
                onClick={() => removeLinkIcon(link.id)}
                style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  padding: 0
                }}
                title="Remove icon"
              >
                ×
              </button>
            </div>
          ) : (
            <div style={{
              width: '40px',
              height: '40px',
              background: '#f1f5f9',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ImageIcon size={20} color="#94a3b8" />
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files[0]) {
              uploadImage(e.target.files[0], 'link', link.id)
            }
          }}
          style={{
            width: '80px',
            fontSize: '0.75rem'
          }}
        />
      </div>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          onBlur={(e) => handleUpdate('title', e.target.value)}
          placeholder="Link title"
          style={{
            padding: '0.5rem',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: '500'
          }}
        />
        <input
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          onBlur={(e) => handleUpdate('url', e.target.value)}
          placeholder="https://example.com"
          style={{
            padding: '0.5rem',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '0.85rem',
            fontFamily: 'monospace'
          }}
        />
      </div>

      <button
        onClick={() => deleteLink(link.id)}
        style={{
          padding: '0.5rem',
          background: '#fee2e2',
          color: '#dc2626',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          alignSelf: 'flex-start'
        }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
