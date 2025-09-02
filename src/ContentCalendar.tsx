import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Trash2, Calendar, Sparkles, Instagram, Twitter } from 'lucide-react';

const ContentCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showFormatsModal, setShowFormatsModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventForm, setEventForm] = useState({
    platform: 'Réel',
    description: '',
    contentFormat: '',
    bigIdeaTitle: ''
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [animateModal, setAnimateModal] = useState(false);
  const [contentFormats, setContentFormats] = useState([
    { id: 1, name: 'Carousel éducatif', image: null },
    { id: 2, name: 'Story interactive', image: null },
    { id: 3, name: 'Thread informatif', image: null },
    { id: 4, name: 'Vidéo tutoriel', image: null }
  ]);
  const [newFormatName, setNewFormatName] = useState('');
  const [newFormatImage, setNewFormatImage] = useState(null);
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Tous');

  const platforms = [
    { name: 'Réel', color: 'from-purple-500 to-pink-500', icon: Instagram },
    { name: 'Carrousel', color: 'from-pink-500 to-purple-600', icon: Instagram },
    { name: 'Story', color: 'from-orange-400 to-pink-500', icon: Instagram },
    { name: 'Tweet', color: 'from-sky-400 to-blue-500', icon: Twitter }
  ];

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const filterOptions = [
    { name: 'Tous', color: 'from-gray-500 to-gray-600', icon: Calendar },
    { name: 'Réel', color: 'from-purple-500 to-pink-500', icon: Instagram },
    { name: 'Carrousel', color: 'from-pink-500 to-purple-600', icon: Instagram },
    { name: 'Story', color: 'from-orange-400 to-pink-500', icon: Instagram },
    { name: 'Tweet', color: 'from-sky-400 to-blue-500', icon: Twitter }
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getFilteredEvents = (dayEvents) => {
    if (selectedFilter === 'Tous') {
      return dayEvents;
    }
    return dayEvents.filter(event => event.platform === selectedFilter);
  };

  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getPlatformConfig = (platformName) => {
    return platforms.find(p => p.name === platformName) || platforms[0];
  };

  const isToday = (date) => {
    const today = new Date();
    return date && 
           date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const openModal = (date, event = null) => {
    setSelectedDate(date);
    setEditingEvent(event);
    if (event) {
      setEventForm(event);
    } else {
      setEventForm({
        platform: 'Réel',
        description: '',
        contentFormat: '',
        bigIdeaTitle: ''
      });
    }
    setShowModal(true);
    setTimeout(() => setAnimateModal(true), 10);
  };

  const closeModal = () => {
    setAnimateModal(false);
    setShowFormatDropdown(false);
    setTimeout(() => {
      setShowModal(false);
      setSelectedDate(null);
      setEditingEvent(null);
    }, 300);
  };

  const openFormatsModal = () => {
    setShowFormatsModal(true);
    setTimeout(() => setAnimateModal(true), 10);
  };

  const closeFormatsModal = () => {
    setAnimateModal(false);
    setNewFormatName('');
    setNewFormatImage(null);
    setTimeout(() => {
      setShowFormatsModal(false);
    }, 300);
  };

  const addContentFormat = () => {
    if (newFormatName.trim() && !contentFormats.find(f => f.name === newFormatName.trim())) {
      setContentFormats(prev => [...prev, { 
        id: Date.now(),
        name: newFormatName.trim(), 
        image: newFormatImage 
      }]);
      setNewFormatName('');
      setNewFormatImage(null);
    }
  };

  const deleteContentFormat = (formatId) => {
    setContentFormats(prev => prev.filter(format => format.id !== formatId));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewFormatImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveEvent = () => {
    if (!eventForm.description.trim()) return;

    const dateKey = formatDateKey(selectedDate);
    const newEvent = {
      ...eventForm,
      id: editingEvent ? editingEvent.id : Date.now()
    };

    setEvents(prev => {
      const dayEvents = prev[dateKey] || [];
      
      if (editingEvent) {
        const updatedEvents = dayEvents.map(event => 
          event.id === editingEvent.id ? newEvent : event
        );
        return { ...prev, [dateKey]: updatedEvents };
      } else {
        return { ...prev, [dateKey]: [...dayEvents, newEvent] };
      }
    });

    closeModal();
  };

  const deleteEvent = (date, eventId) => {
    const dateKey = formatDateKey(date);
    setEvents(prev => {
      const dayEvents = prev[dateKey] || [];
      const filteredEvents = dayEvents.filter(event => event.id !== eventId);
      return { ...prev, [dateKey]: filteredEvents };
    });
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 lg:p-8">
      <div className="max-w-[95vw] mx-auto">
        {/* Header et Gestion des Formats */}
        <div className="grid grid-cols-1 gap-4 mb-6 lg:grid-cols-3 lg:gap-8 lg:mb-8">
          {/* Formats de contenu - Section à gauche */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 lg:p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base lg:text-lg font-bold text-gray-800">Mes formats</h3>
              <button
                onClick={openFormatsModal}
                className="p-3 lg:p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="w-5 h-5 lg:w-4 lg:h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500">
              clique ici pour gérer les formats →
            </p>
          </div>

          {/* Titre principal - Section au centre */}
          <div className="text-center order-first lg:order-none">
            <div className="inline-flex items-center gap-2 lg:gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 lg:px-6 lg:py-3 rounded-2xl shadow-lg border border-white/20 mb-3 lg:mb-4">
              <div className="p-1.5 lg:p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Calendrier de Contenu
              </h1>
              <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-500" />
            </div>
            <p className="text-base lg:text-lg text-gray-600">Organisez votre stratégie de contenu avec style</p>
          </div>

          {/* Statistiques - Section à droite */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 lg:p-6">
            <h3 className="text-base lg:text-lg font-bold text-gray-800 mb-3 lg:mb-4">Statistiques</h3>
            <div className="space-y-2 lg:space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Contenus ce mois</span>
                <span className="font-bold text-lg lg:text-base text-blue-600">
                  {selectedFilter === 'Tous' 
                    ? Object.values(events).flat().length
                    : Object.values(events).flat().filter(event => event.platform === selectedFilter).length
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation avec Filtres */}
        <div className="flex flex-col gap-4 mb-6 bg-white/80 backdrop-blur-sm p-4 lg:flex-row lg:items-center lg:justify-between lg:mb-8 lg:p-6 rounded-2xl shadow-lg border border-white/20">
          <div className="flex justify-between items-center lg:contents">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            
            <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <button
              onClick={() => navigateMonth(1)}
              className="p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
          
          {/* Filtres */}
          <div className="flex gap-2 flex-wrap justify-center">
            {filterOptions.map(filter => {
              const IconComponent = filter.icon;
              return (
                <button
                  key={filter.name}
                  onClick={() => setSelectedFilter(filter.name)}
                  className={`flex items-center gap-2 px-3 py-2.5 lg:px-4 lg:py-2 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                    selectedFilter === filter.name
                      ? `border-transparent bg-gradient-to-r ${filter.color} text-white shadow-lg`
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{filter.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 bg-gradient-to-r from-blue-500 to-purple-600">
            {dayNames.map(day => (
              <div key={day} className="p-2 lg:p-4 text-center font-bold text-white border-r border-white/20 last:border-r-0 text-sm lg:text-base">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {days.map((day, index) => (
              <div
                key={index}
                className={`min-h-32 lg:min-h-48 xl:min-h-64 border-r border-b border-gray-100 last:border-r-0 transition-all duration-200 ${
                  day ? 'hover:bg-blue-50/50 cursor-pointer group' : 'bg-gray-50/30'
                }`}
              >
                {day && (
                  <>
                    <div className="p-2 lg:p-4 flex justify-between items-start">
                      <span className={`text-lg lg:text-xl font-bold ${
                        isToday(day) 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 lg:px-4 lg:py-2 rounded-full text-sm lg:text-base' 
                          : 'text-gray-700'
                      }`}>
                        {day.getDate()}
                      </span>
                      <button
                        onClick={() => openModal(day)}
                        className="p-2 lg:p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110 shadow-lg"
                      >
                        <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
                      </button>
                    </div>

                    <div className="px-2 pb-2 lg:px-4 lg:pb-4 space-y-2 lg:space-y-3">
                      {getFilteredEvents((events[formatDateKey(day)] || [])).slice(0, 4).map(event => {
                        const platformConfig = getPlatformConfig(event.platform);
                        const IconComponent = platformConfig.icon;
                        return (
                          <div
                            key={event.id}
                            className={`relative p-2 lg:p-4 rounded-xl bg-gradient-to-r ${platformConfig.color} text-white cursor-pointer group/event transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl`}
                            onClick={() => openModal(day, event)}
                          >
                            <div className="flex items-start gap-2 lg:gap-3">
                              <IconComponent className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0 mt-0.5 lg:mt-1" />
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-xs lg:text-sm mb-1">{event.platform}</div>
                                {event.bigIdeaTitle && (
                                  <div className="text-xs lg:text-sm font-semibold opacity-95 leading-tight">
                                    {event.bigIdeaTitle}
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteEvent(day, event.id);
                                }}
                                className="opacity-0 group-hover/event:opacity-100 p-1.5 lg:p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
                              >
                                <X className="w-3 h-3 lg:w-4 lg:h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {getFilteredEvents((events[formatDateKey(day)] || [])).length > 4 && (
                        <div className="text-xs lg:text-sm text-gray-500 text-center py-1.5 lg:py-2 bg-gray-100 rounded-xl font-medium">
                          +{getFilteredEvents((events[formatDateKey(day)] || [])).length - 4} autres contenus
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Nouveau Contenu */}
        {showModal && (
          <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 lg:p-4 z-50 transition-all duration-300 ${animateModal ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`bg-white rounded-3xl p-6 lg:p-8 w-full max-w-sm lg:max-w-lg shadow-2xl border border-white/20 transform transition-all duration-300 max-h-[90vh] overflow-y-auto ${animateModal ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
              <div className="flex justify-between items-center mb-6 lg:mb-8">
                <h3 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {editingEvent ? 'Modifier le contenu' : 'Nouveau contenu'}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-3 lg:p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-6 h-6 lg:w-5 lg:h-5 text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-5 lg:space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 lg:mb-4">
                    Type de contenu
                  </label>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {platforms.map(platform => {
                      const IconComponent = platform.icon;
                      return (
                        <button
                          key={platform.name}
                          onClick={() => setEventForm(prev => ({ ...prev, platform: platform.name }))}
                          className={`flex items-center gap-3 p-4 lg:p-4 rounded-xl border-2 transition-all duration-200 ${
                            eventForm.platform === platform.name
                              ? `border-transparent bg-gradient-to-r ${platform.color} text-white shadow-lg`
                              : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <IconComponent className="w-6 h-6 lg:w-5 lg:h-5 flex-shrink-0" />
                          <span className="font-semibold text-base lg:text-sm">{platform.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 lg:mb-4">
                    Format de contenu
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowFormatDropdown(!showFormatDropdown)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl text-left bg-gray-50 hover:border-gray-300 transition-colors flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        {eventForm.contentFormat && contentFormats.find(f => f.name === eventForm.contentFormat)?.image && (
                          <img 
                            src={contentFormats.find(f => f.name === eventForm.contentFormat).image} 
                            alt={eventForm.contentFormat}
                            className="w-8 h-8 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <span className={eventForm.contentFormat ? 'text-gray-900' : 'text-gray-500'}>
                          {eventForm.contentFormat || 'Sélectionner un format'}
                        </span>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-gray-400 transform transition-transform ${showFormatDropdown ? 'rotate-90' : ''}`} />
                    </button>
                    
                    {showFormatDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto">
                        <button
                          onClick={() => {
                            setEventForm(prev => ({ ...prev, contentFormat: '' }));
                            setShowFormatDropdown(false);
                          }}
                          className="w-full p-4 text-left hover:bg-gray-50 transition-colors text-gray-500 italic border-b border-gray-100"
                        >
                          Aucun format
                        </button>
                        {contentFormats.map(format => (
                          <button
                            key={format.id}
                            onClick={() => {
                              setEventForm(prev => ({ ...prev, contentFormat: format.name }));
                              setShowFormatDropdown(false);
                            }}
                            className="w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-4"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              {format.image ? (
                                <img 
                                  src={format.image} 
                                  alt={format.name}
                                  className="w-12 h-12 object-cover rounded-lg flex-shrink-0 border border-gray-200"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200">
                                  <span className="text-gray-400 text-xs">IMG</span>
                                </div>
                              )}
                              <div>
                                <span className="font-medium text-gray-900">{format.name}</span>
                                <p className="text-xs text-gray-500 mt-1">
                                  {format.image ? 'Avec exemple visuel' : 'Sans exemple'}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Titre de la big idea
                  </label>
                  <input
                    type="text"
                    value={eventForm.bigIdeaTitle}
                    onChange={(e) => setEventForm(prev => ({ ...prev, bigIdeaTitle: e.target.value }))}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200"
                    placeholder="ex : Élite économique VS Élite symbolique"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 lg:mb-4">
                    Description de la big idea
                  </label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 resize-none"
                    rows="4"
                    placeholder="Explique-là comme si tu parles à quelqu'un..."
                  />
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 mt-6 lg:mt-8">
                <button
                  onClick={closeModal}
                  className="w-full lg:flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors text-base lg:text-sm"
                >
                  Annuler
                </button>
                <button
                  onClick={saveEvent}
                  disabled={!eventForm.description.trim()}
                  className="w-full lg:flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg text-base lg:text-sm"
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Gestion des Formats */}
        {showFormatsModal && (
          <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 lg:p-4 z-50 transition-all duration-300 ${animateModal ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`bg-white rounded-3xl p-6 lg:p-8 w-full max-w-md lg:max-w-2xl shadow-2xl border border-white/20 transform transition-all duration-300 max-h-[90vh] overflow-hidden ${animateModal ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
              <div className="flex justify-between items-start mb-6 lg:mb-8">
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Gestion des Formats
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm lg:text-base">Créez et organisez vos formats de contenu</p>
                </div>
                <button
                  onClick={closeFormatsModal}
                  className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="space-y-6 lg:space-y-8">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 lg:p-6 border border-blue-100">
                  <h4 className="text-base lg:text-lg font-bold text-gray-800 mb-3 lg:mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-blue-600" />
                    Créer un nouveau format
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <input
                        type="text"
                        value={newFormatName}
                        onChange={(e) => setNewFormatName(e.target.value)}
                        className="w-full p-4 border-2 border-white bg-white rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 shadow-sm"
                        placeholder="Ex: Tutorial vidéo, Post carousel, Story Q&A..."
                        onKeyPress={(e) => e.key === 'Enter' && addContentFormat()}
                      />
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <div className="p-6 lg:p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors cursor-pointer bg-white">
                            <div className="text-center">
                              {newFormatImage ? (
                                <div className="flex items-center justify-center">
                                  <img 
                                    src={newFormatImage} 
                                    alt="Aperçu" 
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                </div>
                              ) : (
                                <div>
                                  <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                  <p className="text-sm text-gray-600">Image d'exemple</p>
                                  <p className="text-xs text-gray-400">Optionnel</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </label>
                      </div>
                      
                      <button
                        onClick={addContentFormat}
                        disabled={!newFormatName.trim()}
                        className="w-full lg:w-auto px-6 lg:px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Créer
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 gap-2">
                    <h4 className="text-base lg:text-lg font-bold text-gray-800">
                      Mes formats ({contentFormats.length})
                    </h4>
                    {contentFormats.length > 0 && (
                      <span className="text-sm text-gray-500">
                        Cliquez sur un format pour le supprimer
                      </span>
                    )}
                  </div>
                  
                  <div className="max-h-64 lg:max-h-80 overflow-y-auto">
                    {contentFormats.length === 0 ? (
                      <div className="text-center py-12 lg:py-16">
                        <div className="p-6 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                          <Calendar className="w-10 h-10 text-gray-400" />
                        </div>
                        <h5 className="text-base lg:text-lg font-medium text-gray-600 mb-2">Aucun format créé</h5>
                        <p className="text-gray-500 mb-6 text-sm lg:text-base">Commencez par créer votre premier format de contenu</p>
                        <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-400">
                          <span>💡 Exemples :</span>
                          <span className="bg-gray-100 px-2 py-1 rounded">Tutorial</span>
                          <span className="bg-gray-100 px-2 py-1 rounded">Carousel</span>
                          <span className="bg-gray-100 px-2 py-1 rounded">Story Q&A</span>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                        {contentFormats.map((format, index) => (
                          <div
                            key={format.id}
                            className="group relative p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 hover:border-red-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
                            onClick={() => deleteContentFormat(format.id)}
                          >
                            <div className="flex items-center gap-3">
                              {format.image && (
                                <img 
                                  src={format.image} 
                                  alt={format.name}
                                  className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <span className="font-semibold text-gray-800 block text-sm lg:text-base">{format.name}</span>
                                <span className="text-xs text-gray-500">Format #{index + 1}</span>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-all duration-200">
                                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                  <Trash2 className="w-4 h-4" />
                                </div>
                              </div>
                            </div>
                            <div className="absolute inset-0 bg-red-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200"></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-6 lg:mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={closeFormatsModal}
                  className="w-full lg:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Terminer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentCalendar;
