'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Calendar, MapPin, Users, ShieldCheck, Search, ArrowRight } from 'lucide-react';

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

  return (
    <div className="space-y-8 py-2">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#FED7AA] pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#7C2D12]">Community Campaigns</h1>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1">Discover verified volunteering opportunities near you</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 rounded-xl bg-white border border-[#FED7AA] hover:border-[#F97316] text-[#431407] placeholder-[#78716C] text-xs focus:outline-none focus:ring-2 focus:ring-[#F97316] w-48 sm:w-64 transition-all"
            />
          </div>

          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-[#FED7AA] hover:border-[#F97316] text-[#431407] text-xs focus:outline-none focus:ring-2 focus:ring-[#F97316] transition-all cursor-pointer"
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
            className="px-3 py-2 rounded-xl bg-white border border-[#FED7AA] hover:border-[#F97316] text-[#431407] text-xs focus:outline-none focus:ring-2 focus:ring-[#F97316] transition-all cursor-pointer"
          >
            <option value="">All Cities</option>
            <option value="Chennai">Chennai</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Mumbai">Mumbai</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="py-20 text-center text-[#78716C] text-sm font-medium">Loading campaigns...</div>
      ) : filteredEvents.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-[#FED7AA] space-y-3 shadow-xs">
          <p className="text-[#78716C] font-medium text-sm">No campaigns found matching these filters.</p>
          <button
            onClick={() => { setCategory(''); setCity(''); setSearch(''); }}
            className="text-xs font-semibold text-[#F97316] hover:text-[#EA580C] hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <div
              key={event.id}
              className="bg-white rounded-3xl border border-[#FED7AA] hover:border-[#F97316] hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer shadow-xs"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FFEDD5] text-[#9A3412] border border-[#FED7AA] group-hover:bg-[#FED7AA] group-hover:border-[#F97316]/50 transition-colors">
                    {event.category.replace('_', ' ')}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-[#9A3412] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#F97316] group-hover:scale-110 transition-transform" />
                    <span>Trust: {event.organization_trust_score || 78}/100</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#7C2D12] group-hover:text-[#F97316] transition-colors line-clamp-2">
                    <Link href={`/events/${event.id}`}>{event.title}</Link>
                  </h3>
                  <div className="text-xs font-medium text-[#78716C] mt-1">
                    By {event.organization_name}
                  </div>
                </div>

                <p className="text-xs text-[#431407] line-clamp-3 leading-relaxed font-light">
                  {event.description}
                </p>

                <div className="space-y-2 pt-3 border-t border-[#FED7AA] text-xs text-[#78716C]">
                  <div className="flex items-center space-x-2 group-hover:text-[#431407] transition-colors">
                    <Calendar className="w-4 h-4 text-[#F97316]" />
                    <span>{event.event_date} ({event.start_time.slice(0, 5)} - {event.end_time.slice(0, 5)})</span>
                  </div>
                  <div className="flex items-center space-x-2 group-hover:text-[#431407] transition-colors">
                    <MapPin className="w-4 h-4 text-[#F97316]" />
                    <span className="truncate">{event.location_name}, {event.city}</span>
                  </div>
                  <div className="flex items-center space-x-2 group-hover:text-[#431407] transition-colors">
                    <Users className="w-4 h-4 text-[#F97316]" />
                    <span>{event.confirmed_count || 1} confirmed / {event.volunteers_required} volunteers needed</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#FFEDD5]/40 group-hover:bg-[#FFEDD5]/70 border-t border-[#FED7AA] flex items-center justify-between transition-colors">
                {event.status === 'REGISTRATION_CLOSED' || ((event.confirmed_count || 0) >= (event.max_capacity || 15)) ? (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                    Closed (Full)
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-[#78716C]">
                    Capacity: {event.max_capacity} max
                  </span>
                )}
                <Link
                  href={`/events/${event.id}`}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#F97316] group-hover:text-[#EA580C] group-hover:translate-x-1.5 transition-all"
                >
                  <span>{event.status === 'REGISTRATION_CLOSED' || ((event.confirmed_count || 0) >= (event.max_capacity || 15)) ? 'View Details' : 'View & Register'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
