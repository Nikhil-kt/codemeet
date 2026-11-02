'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { Calendar, MapPin, Users, ShieldCheck, Search, ArrowRight, Sparkles, Filter, X } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/motion/ProgressBar';
import EmptyState from '@/components/ui/EmptyState';

export default function EventsCatalogPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchEvents = async () => {
      setLoading(true);
      const params = [];
      if (category) params.push(`category=${category}`);
      if (city) params.push(`city=${city}`);

      const res = await api.getEvents(params.join('&'));
      if (isMounted) {
        setLoading(false);
        if (res.success && res.data) {
          setEvents(res.data.events || []);
        }
      }
    };

    fetchEvents();
    return () => {
      isMounted = false;
    };
  }, [category, city]);

  const filteredEvents = events.filter(e =>
    search ? (e.title.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase())) : true
  );

  const formatMonth = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    } catch {
      return 'DATE';
    }
  };

  const formatDay = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.getDate() || '--';
    } catch {
      return '--';
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF4E8] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Heading & Filter Bar */}
        <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-[#FF6B1A]/15 shadow-[0_4px_24px_rgba(255,107,26,0.08)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-[#FF6B1A]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Verified Civic Initiatives"
              title="Community Campaigns"
              subtitle="Discover verified, high-impact volunteering opportunities near you. Direct matching with certified organizers."
              align="left"
            />

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-[#6B5B53] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FFF4E8]/60 border border-[#FF6B1A]/20 hover:border-[#FF6B1A] text-[#7A2E0E] placeholder-[#6B5B53]/70 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B5B53] hover:text-[#7A2E0E]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="px-4 py-3 rounded-2xl bg-[#FFF4E8]/60 border border-[#FF6B1A]/20 hover:border-[#FF6B1A] text-[#7A2E0E] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] transition-all cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="ENVIRONMENTAL">Environmental</option>
                <option value="EDUCATIONAL">Educational</option>
                <option value="HEALTH_AWARENESS">Health Awareness</option>
                <option value="COMMUNITY_WELFARE">Community Welfare</option>
                <option value="SOCIAL_SERVICE">Social Service</option>
              </select>

              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="px-4 py-3 rounded-2xl bg-[#FFF4E8]/60 border border-[#FF6B1A]/20 hover:border-[#FF6B1A] text-[#7A2E0E] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] transition-all cursor-pointer"
              >
                <option value="">All Cities</option>
                <option value="Chennai">Chennai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {(category || city || search) && (
            <div className="relative z-10 flex flex-wrap items-center gap-2 pt-6 mt-6 border-t border-[#FF6B1A]/10">
              <span className="text-xs font-bold text-[#6B5B53] uppercase tracking-wider flex items-center space-x-1">
                <Filter className="w-3.5 h-3.5 text-[#FF6B1A]" />
                <span>Active Filters:</span>
              </span>
              {category && (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FFE3CC] text-[#7A2E0E] text-xs font-bold">
                  <span>Category: {category.replace('_', ' ')}</span>
                  <button onClick={() => setCategory('')} className="hover:text-[#FF6B1A]"><X className="w-3 h-3" /></button>
                </span>
              )}
              {city && (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FFE3CC] text-[#7A2E0E] text-xs font-bold">
                  <span>City: {city}</span>
                  <button onClick={() => setCity('')} className="hover:text-[#FF6B1A]"><X className="w-3 h-3" /></button>
                </span>
              )}
              {search && (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FFE3CC] text-[#7A2E0E] text-xs font-bold">
                  <span>Search: &quot;{search}&quot;</span>
                  <button onClick={() => setSearch('')} className="hover:text-[#FF6B1A]"><X className="w-3 h-3" /></button>
                </span>
              )}
              <button
                onClick={() => { setCategory(''); setCity(''); setSearch(''); }}
                className="text-xs font-bold text-[#FF6B1A] hover:text-[#E8590C] hover:underline ml-2 cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Campaigns Grid */}
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#FF6B1A] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-[#6B5B53] text-sm font-semibold">Discovering verified campaigns...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            title="No Campaigns Found"
            description="No active initiatives match your selected criteria. Try resetting filters or exploring other cities."
            actionLabel="Reset All Filters"
            onAction={() => { setCategory(''); setCity(''); setSearch(''); }}
          />
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08 }
              }
            }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredEvents.map(event => {
              const maxCap = event.max_capacity || event.volunteers_required || 15;
              const confirmed = event.confirmed_count || 1;
              const isFull = event.status === 'REGISTRATION_CLOSED' || confirmed >= maxCap;
              const fillPct = Math.min(100, Math.round((confirmed / maxCap) * 100));

              return (
                <motion.div
                  key={event.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="group relative bg-white rounded-[28px] border border-[#FF6B1A]/15 hover:border-[#FF6B1A] shadow-[0_4px_20px_rgba(255,107,26,0.06)] hover:shadow-[0_20px_40px_rgba(255,107,26,0.18)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Top Header Strip with Stacked Date Badge */}
                  <div className="p-7 space-y-5">
                    <div className="flex items-start justify-between gap-4">
                      {/* Stacked Date Badge */}
                      <div className="flex flex-col items-center justify-center w-14 h-16 rounded-2xl bg-gradient-to-br from-[#FFE3CC] to-[#FFF4E8] border border-[#FF6B1A]/20 shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#FF6B1A]">
                          {formatMonth(event.event_date)}
                        </span>
                        <span className="text-xl font-black text-[#7A2E0E] leading-none mt-0.5">
                          {formatDay(event.event_date)}
                        </span>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 flex-1">
                        <Badge
                          variant={event.category.toLowerCase().includes('env') ? 'success' : 'peach'}
                          size="sm"
                        >
                          {event.category.replace('_', ' ')}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs font-bold text-[#7A2E0E]">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#FF6B1A]" />
                          <span>Trust: {event.organization_trust_score || 78}/100</span>
                        </div>
                      </div>
                    </div>

                    {/* Title & Organization */}
                    <div>
                      <h3 className="text-xl font-heading font-extrabold text-[#7A2E0E] group-hover:text-[#FF6B1A] transition-colors line-clamp-2 leading-snug">
                        <Link href={`/events/${event.id}`}>{event.title}</Link>
                      </h3>
                      <p className="text-xs font-semibold text-[#6B5B53] mt-1.5">
                        By <span className="text-[#7A2E0E]">{event.organization_name}</span>
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#6B5B53] line-clamp-3 leading-relaxed">
                      {event.description}
                    </p>

                    {/* Logistics Row */}
                    <div className="space-y-2.5 pt-4 border-t border-[#FF6B1A]/10 text-xs font-medium text-[#6B5B53]">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-[#FF6B1A] flex-shrink-0" />
                        <span>{event.event_date} ({event.start_time.slice(0, 5)} - {event.end_time.slice(0, 5)})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-[#FF6B1A] flex-shrink-0" />
                        <span className="truncate">{event.location_name}, {event.city}</span>
                      </div>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#6B5B53] font-semibold">Volunteers Joined</span>
                        <span className="font-bold text-[#7A2E0E]">{confirmed} / {maxCap}</span>
                      </div>
                      <ProgressBar value={fillPct} variant={isFull ? 'peach' : 'orange'} />
                    </div>
                  </div>

                  {/* Card Bottom CTA Strip */}
                  <div className="p-5 bg-gradient-to-r from-[#FFF4E8] to-[#FFE3CC]/50 border-t border-[#FF6B1A]/15 flex items-center justify-between">
                    {isFull ? (
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                        Closed (Full)
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-[#6B5B53]">
                        {maxCap - confirmed} spots remaining
                      </span>
                    )}

                    <Link
                      href={`/events/${event.id}`}
                      className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#FF6B1A] hover:bg-[#E8590C] text-white text-xs font-bold shadow-md shadow-orange-500/20 group-hover:scale-105 active:scale-95 transition-all"
                    >
                      <span>{isFull ? 'View Details' : 'View & Register'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
