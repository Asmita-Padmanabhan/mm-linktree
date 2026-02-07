import React from 'react'
import { useParams } from 'react-router-dom'
import { useRealtimeProfile } from '../hooks/useRealtimeProfile'
import { ExternalLink } from 'lucide-react'

export default function PublicView() {
  const { username } = useParams()
  const { profile, sections, links, loading } = useRealtimeProfile(username)

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          fontSize: '1.5rem',
          color: '#fff',
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: '500'
        }}>
          Loading...
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          fontSize: '1.5rem',
          color: '#fff',
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: '500'
        }}>
          Profile not found
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: profile.background_color,
      color: profile.text_color,
      padding: '3rem 1rem',
      fontFamily: '"DM Sans", sans-serif',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        maxWidth: '680px',
        margin: '0 auto'
      }}>
        {/* Profile Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          animation: 'fadeInDown 0.6s ease-out'
        }}>
          {profile.profile_image && (
            <img
              src={profile.profile_image}
              alt={username}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '1.5rem',
                border: `4px solid ${profile.button_color}`,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            />
          )}
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
          }}>
            @{username}
          </h1>
          {profile.bio && (
            <p style={{
              fontSize: '1.1rem',
              opacity: 0.9,
              maxWidth: '500px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              {profile.bio}
            </p>
          )}
        </div>

        {/* Sections and Links */}
        {sections.map((section, sectionIndex) => {
          const sectionLinks = links.filter(link => link.section_id === section.id)
          
          return (
            <div
              key={section.id}
              style={{
                marginBottom: '3rem',
                animation: `fadeInUp 0.6s ease-out ${sectionIndex * 0.1}s backwards`
              }}
            >
              <h2 style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                marginBottom: '1rem',
                paddingLeft: '0.5rem',
                opacity: 0.95,
                letterSpacing: '-0.01em'
              }}>
                {section.title}
              </h2>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                {sectionLinks.map((link, linkIndex) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.25rem 1.5rem',
                      backgroundColor: profile.button_color,
                      color: profile.button_text_color,
                      borderRadius: '16px',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      border: '2px solid transparent',
                      position: 'relative',
                      overflow: 'hidden',
                      animation: `fadeInUp 0.6s ease-out ${(sectionIndex * 0.1) + (linkIndex * 0.05)}s backwards`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)'
                      e.currentTarget.style.borderColor = profile.text_color + '40'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                      e.currentTarget.style.borderColor = 'transparent'
                    }}
                  >
                    {link.icon_url && (
                      <img
                        src={link.icon_url}
                        alt={link.title}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          flexShrink: 0
                        }}
                      />
                    )}
                    <span style={{
                      flex: 1,
                      fontSize: '1.1rem',
                      fontWeight: '500',
                      letterSpacing: '-0.01em'
                    }}>
                      {link.title}
                    </span>
                    <ExternalLink size={20} style={{ opacity: 0.7, flexShrink: 0 }} />
                  </a>
                ))}
              </div>
            </div>
          )
        })}

        {sections.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            opacity: 0.6,
            fontSize: '1.1rem'
          }}>
            No links yet. Check back soon!
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
