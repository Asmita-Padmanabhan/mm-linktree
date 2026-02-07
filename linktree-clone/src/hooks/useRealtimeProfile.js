import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'

export function useRealtimeProfile(username) {
  const [profile, setProfile] = useState(null)
  const [sections, setSections] = useState([])
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!username) return

    async function fetchData() {
      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single()

        if (profileError) throw profileError
        setProfile(profileData)

        // Fetch sections
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('sections')
          .select('*')
          .eq('profile_id', profileData.id)
          .order('position', { ascending: true })

        if (sectionsError) throw sectionsError
        setSections(sectionsData || [])

        // Fetch links
        const { data: linksData, error: linksError } = await supabase
          .from('links')
          .select('*')
          .in('section_id', sectionsData.map(s => s.id))
          .order('position', { ascending: true })

        if (linksError) throw linksError
        setLinks(linksData || [])

        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()

    // Subscribe to profile changes
    const profileChannel = supabase
      .channel('profile-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles', filter: `username=eq.${username}` },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setProfile(payload.new)
          }
        }
      )
      .subscribe()

    // Subscribe to sections changes
    const sectionsChannel = supabase
      .channel('sections-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'sections' },
        async () => {
          const { data } = await supabase
            .from('sections')
            .select('*')
            .eq('profile_id', profile?.id)
            .order('position', { ascending: true })
          setSections(data || [])
        }
      )
      .subscribe()

    // Subscribe to links changes
    const linksChannel = supabase
      .channel('links-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'links' },
        async () => {
          if (sections.length === 0) return
          const { data } = await supabase
            .from('links')
            .select('*')
            .in('section_id', sections.map(s => s.id))
            .order('position', { ascending: true })
          setLinks(data || [])
        }
      )
      .subscribe()

    return () => {
      profileChannel.unsubscribe()
      sectionsChannel.unsubscribe()
      linksChannel.unsubscribe()
    }
  }, [username, profile?.id, sections])

  return { profile, sections, links, loading }
}
