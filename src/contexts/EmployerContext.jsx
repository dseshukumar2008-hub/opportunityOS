/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const EmployerContext = createContext(null);

export function EmployerProvider({ children }) {
  const { user } = useAuth();
  const [companyProfile, setCompanyProfile] = useState(null);
  const [employerOpportunities, setEmployerOpportunities] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [employerReviews, setEmployerReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [opportunitiesTotal, setOpportunitiesTotal] = useState(0);
  const [applicantsTotal, setApplicantsTotal] = useState(0);
  const [reviewsTotal, setReviewsTotal] = useState(0);

  const fetchCompanyProfile = useCallback(async () => {
    if (!user) return null;
    const { data: company } = await supabase
      .from('companies')
      .select('*')
      .eq('owner_id', user.id)
      .maybeSingle();
    setCompanyProfile(company || null);
    return company;
  }, [user]);

  const fetchEmployerOpportunities = useCallback(async ({ page = 1, limit = 10, search = '' } = {}) => {
    if (!companyProfile) return;
    setLoading(true);
    let query = supabase.from('opportunities').select('*', { count: 'exact' }).eq('company_id', companyProfile.id);
    
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, count } = await query.order('created_at', { ascending: false }).range(start, end);
    setEmployerOpportunities(data || []);
    setOpportunitiesTotal(count || 0);
    setLoading(false);
  }, [companyProfile]);

  const fetchEmployerApplicants = useCallback(async ({ page = 1, limit = 10, opportunityId = 'all', status = 'all' } = {}) => {
    if (!companyProfile) return;
    setLoading(true);

    // If we want all applicants for all company opportunities, we need the company's opp IDs first
    // If opportunityId is 'all', we query by oppIds.
    let oppIds = [opportunityId];
    if (opportunityId === 'all') {
      const { data: opps } = await supabase.from('opportunities').select('id').eq('company_id', companyProfile.id);
      if (!opps || opps.length === 0) {
        setApplicants([]);
        setApplicantsTotal(0);
        setLoading(false);
        return;
      }
      oppIds = opps.map(o => o.id);
    }

    let query = supabase
      .from('applications')
      .select(`
        *,
        profiles ( full_name, avatar_url, headline, bio, location ),
        resumes ( title, personal_info, education, experience, projects, skills, certifications )
      `, { count: 'exact' })
      .in('opportunity_id', oppIds);

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, count } = await query.order('created_at', { ascending: false }).range(start, end);
    setApplicants(data || []);
    setApplicantsTotal(count || 0);
    setLoading(false);
  }, [companyProfile]);

  const fetchEmployerReviews = useCallback(async ({ page = 1, limit = 10 } = {}) => {
    if (!companyProfile) return;
    const start = (page - 1) * limit;
    const end = start + limit - 1;
    const { data, count } = await supabase
      .from('employer_reviews')
      .select('*', { count: 'exact' })
      .eq('company_id', companyProfile.id)
      .order('created_at', { ascending: false })
      .range(start, end);
    
    setEmployerReviews(data || []);
    setReviewsTotal(count || 0);
  }, [companyProfile]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const company = await fetchCompanyProfile();
      if (company) {
        // Fetch initial pages on load
        // Note: fetchEmployerOpportunities and fetchEmployerApplicants depend on companyProfile state,
        // but since they are in useCallback depending on companyProfile, we shouldn't manually call them here.
        // Actually, let's trigger them when companyProfile changes using another useEffect.
      } else {
        setLoading(false);
      }
    };
    init();
  }, [fetchCompanyProfile]);

  useEffect(() => {
    if (companyProfile) {
      fetchEmployerOpportunities();
      fetchEmployerApplicants();
      fetchEmployerReviews();
    }
  }, [companyProfile, fetchEmployerOpportunities, fetchEmployerApplicants, fetchEmployerReviews]);

  const updateCompanyProfile = async (updates) => {
    // ... logic unchanged (omitted for brevity? No, need to keep it exact)
    if (!user) return;
    try {
      if (companyProfile) {
        const { data, error } = await supabase.from('companies').update(updates).eq('id', companyProfile.id).select().single();
        if (error) throw error;
        setCompanyProfile(data);
        toast.success('Company profile updated');
      } else {
        const { data, error } = await supabase.from('companies').insert([{ ...updates, owner_id: user.id }]).select().single();
        if (error) throw error;
        setCompanyProfile(data);
        toast.success('Company profile created');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to save company profile');
    }
  };

  const createOpportunity = async (opportunity) => {
    if (!companyProfile) return null;
    try {
      const { data, error } = await supabase.from('opportunities').insert([{ ...opportunity, company_id: companyProfile.id }]).select().single();
      if (error) throw error;
      setEmployerOpportunities(prev => [data, ...prev]);
      toast.success('Opportunity posted successfully');
      return data;
    } catch (err) {
      console.error(err);
      toast.error('Failed to post opportunity');
      return null;
    }
  };

  const updateOpportunity = async (id, updates) => {
    try {
      const { data, error } = await supabase.from('opportunities').update(updates).eq('id', id).select().single();
      if (error) throw error;
      setEmployerOpportunities(prev => prev.map(o => o.id === id ? data : o));
      toast.success('Opportunity updated');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update opportunity');
    }
  };

  const updateReviewStatus = async (applicationId, status, notes = null) => {
    if (!companyProfile) return;

    try {
      const existing = employerReviews.find(r => r.application_id === applicationId);
      let payload = { status };
      if (notes !== null) payload.notes = notes;

      if (existing) {
        const { data, error } = await supabase
          .from('employer_reviews')
          .update(payload)
          .eq('id', existing.id)
          .select()
          .single();
        if (error) throw error;
        setEmployerReviews(prev => prev.map(r => r.id === existing.id ? data : r));
      } else {
        const { data, error } = await supabase
          .from('employer_reviews')
          .insert([{ company_id: companyProfile.id, application_id: applicationId, ...payload }])
          .select()
          .single();
        if (error) throw error;
        setEmployerReviews(prev => [...prev, data]);
      }
      toast.success(`Candidate marked as ${status}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update candidate status');
    }
  };

  const saveAIEvaluation = async (applicationId, aiData) => {
    if (!companyProfile) return;
    try {
      const existing = employerReviews.find(r => r.application_id === applicationId);
      const payload = {
        gemini_score: aiData.candidateScore,
        gemini_strengths: aiData.strengths,
        gemini_concerns: aiData.concerns,
        gemini_missing_skills: aiData.missingSkills,
        gemini_recommendation: aiData.recommendation,
        gemini_interview_priority: aiData.interviewPriority,
        gemini_summary: aiData.summary
      };

      if (existing) {
        const { data, error } = await supabase.from('employer_reviews').update(payload).eq('id', existing.id).select().single();
        if (error) throw error;
        setEmployerReviews(prev => prev.map(r => r.id === existing.id ? data : r));
        return data;
      } else {
        const { data, error } = await supabase.from('employer_reviews').insert([{ company_id: companyProfile.id, application_id: applicationId, status: 'Pending', ...payload }]).select().single();
        if (error) throw error;
        setEmployerReviews(prev => [...prev, data]);
        return data;
      }
    } catch (err) {
      console.error('Failed to cache AI evaluation:', err);
    }
  };

  return (
    <EmployerContext.Provider value={{
      companyProfile,
      employerOpportunities,
      applicants,
      employerReviews,
      loading,
      opportunitiesTotal,
      applicantsTotal,
      reviewsTotal,
      updateCompanyProfile,
      createOpportunity,
      updateOpportunity,
      updateReviewStatus,
      saveAIEvaluation,
      fetchEmployerOpportunities,
      fetchEmployerApplicants,
      fetchEmployerReviews
    }}>
      {children}
    </EmployerContext.Provider>
  );
}

export function useEmployer() {
  const context = useContext(EmployerContext);
  if (!context) {
    throw new Error('useEmployer must be used within an EmployerProvider');
  }
  return context;
}
