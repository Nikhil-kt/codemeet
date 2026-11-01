'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Calendar, MapPin, Users, ShieldCheck, Search, Filter, ArrowRight } from 'lucide-react';

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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Community Campaigns</h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">Discover verified volunteering opportunities near you</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 placeholder-stone-500 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 w-48 sm:w-64"
            />
          </div>

          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
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
            className="px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
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
        <div className="py-20 text-center text-stone-500 text-sm">Loading campaigns...</div>
      ) : filteredEvents.length === 0 ? (
        <div className="py-20 text-center bg-stone-900/60 rounded-3xl border border-stone-800 space-y-3">
          <p className="text-stone-400 font-medium text-sm">No campaigns found matching these filters.</p>
          <button
            onClick={() => { setCategory(''); setCity(''); setSearch(''); }}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <div
              key={event.id}
              className="bg-stone-900/75 backdrop-blur-xl rounded-3xl border border-stone-800 hover:border-amber-500/40 shadow-xl transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    {event.category.replace('_', ' ')}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-amber-400 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Trust: {event.organization_trust_score || 78}/100</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                    <Link href={`/events/${event.id}`}>{event.title}</Link>
                  </h3>
                  <div className="text-xs font-medium text-stone-400 mt-1">
                    By {event.organization_name}
                  </div>
                </div>

                <p className="text-xs text-stone-300/80 line-clamp-3 leading-relaxed font-light">
                  {event.description}
                </p>

                <div className="space-y-2 pt-3 border-t border-stone-800/80 text-xs text-stone-400">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-amber-400/80" />
                    <span>{event.event_date} ({event.start_time.slice(0, 5)} - {event.end_time.slice(0, 5)})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-amber-400/80" />
                    <span className="truncate">{event.location_name}, {event.city}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-amber-400/80" />
                    <span>{event.confirmed_count || 1} confirmed / {event.volunteers_required} volunteers needed</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-stone-950/70 border-t border-stone-800/80 flex items-center justify-between">
                {event.status === 'REGISTRATION_CLOSED' || ((event.confirmed_count || 0) >= (event.max_capacity || 15)) ? (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Closed (Full)
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-stone-400">
                    Capacity: {event.max_capacity} max
                  </span>
                )}
                <Link
                  href={`/events/${event.id}`}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 group-hover:translate-x-1 transition-all"
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

