﻿import React, { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { EventDetail } from './components/EventDetail';
import { Register } from './components/Register';
import { Results } from './components/Results';
import { OrgDashboard } from './components/OrgDashboard';
import { AddEvent } from './components/AddEvent';
import { MyOrganisedEvents } from './components/MyOrganisedEvents';
import { Participants } from './components/Participants';
import { MyParticipatingEvents } from './components/MyParticipatingEvents';
import { Profile } from './components/Profile';
import { LiveStream } from './components/LiveStream';
import { SignIn } from './components/SignIn';
import { OTPVerification } from './components/OTPVerification';

export type Screen = 
  | 'signin'
  | 'otp_verification'
  | 'home'
  | 'event_detail'
  | 'register'
  | 'results'
  | 'org_dashboard'
  | 'add_event'
  | 'my_org'
  | 'participants'
  | 'my_part'
  | 'profile'
  | 'liveStream';

// Storage keys
const STORAGE_KEYS = {
  USER_EVENTS: 'zhevents_user_events',
  PROFILE_EMAIL: 'zhevents_profile_email',
  PROFILE_NAME: 'zhevents_profile_name',
  PROFILE_PHONE: 'zhevents_profile_phone',
  PROFILE_DATA: 'zhevents_profile_data',
  SENT_EMAILS: 'zhevents_sent_emails',
  REGISTERED_EVENTS: 'zhevents_registered_sub_events',
  PARTICIPANT_DATA: 'zhevents_participant_data',
  AUTH_STATE: 'zhevents_auth_state',
  USER_PROFILE_COMPLETE: 'zhevents_user_profile_complete',
  USER_PROFILES: 'zhevents_user_profiles' // Maps "email:phone" to complete profile data
} as const;

// Safe localStorage operations (moved outside component to avoid JSX parsing issues)
function saveToLocalStorage(key: string, value: any): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
    return false;
  }
}

function loadFromLocalStorage(key: string, defaultValue: any): any {
  try {
    const saved = localStorage.getItem(key);
    if (saved === null) return defaultValue;
    
    const parsed = JSON.parse(saved);
    return parsed;
  } catch (error) {
    // For backward compatibility with raw strings
    const saved = localStorage.getItem(key);
    if (saved && saved !== 'undefined' && saved !== 'null' && typeof defaultValue === 'string') {
      return saved;
    }
    console.warn(`Error loading from localStorage (${key}):`, error);
    return defaultValue;
  }
}

const initialEvents = [
  {
    id: 'pandu',
    college: 'Pandurang College',
    eventName: 'Pandu Fest',
    location: 'Mumbai, Vile Parle',
    dates: '12th to 13th Dec 25',
    type: 'Mixed',
    competition: 'Intraâ€‘Collegiate',
    color: 'bg-green-200',
    createdAt: 1704063600000,
    address: '89th Road, Near Aar Centre, Vile Parle, Mumbai 400054',
    contact: 'Akhat â€¢ 9834672322',
    entryFees: 'Free',
    deadline: '11 Dec 2025 at 10:00 pm (or until slots are available)',
    otse: 'Yes (Subject to availability)',
    events: [{
      name: 'Event 1',
      type: 'Dancing',
      competition: 'Interâ€‘Collegiate',
      groupType: 'Group',
      date: '12 Dec 2025',
      time: '10:00 am',
      participants: '6â€“8',
      rules: ['Rule 1', 'Rule 2', 'Rule 3', 'Rule 4', 'Rule 5'],
      contact: 'Akhat â€¢ 9834672322',
      entryFees: 'Free',
      deadline: '11 Dec 2025 at 10:00 pm (or until slots are available)',
      otse: 'Yes (Subject to availability)'
    }, {
      name: 'Event 2',
      type: 'Singing',
      competition: 'Interâ€‘Collegiate',
      groupType: 'Solo',
      date: '13 Dec 2025',
      time: '2:00 pm',
      participants: '1',
      rules: ['Rule A', 'Rule B', 'Rule C'],
      contact: 'Akhat â€¢ 9834672322',
      entryFees: 'â‚¹50',
      deadline: '10 Dec 2025 at 5:00 pm (or until slots are available)',
      otse: 'No'
    }]
  },
  {
    id: 'kaiso',
    college: 'Sindhu College',
    eventName: 'Kaiso',
    location: 'Mumbai, Mira Road',
    dates: '15th to 17th Dec 25',
    type: 'Mixed',
    competition: 'Interâ€‘Collegiate',
    color: 'bg-yellow-200',
    createdAt: 1704150000000
  },
  {
    id: 'maker',
    college: 'ABV College',
    eventName: 'Maker',
    location: 'Mumbai, Ghatkopar',
    dates: '20th to 22nd Dec 25',
    type: 'Mixed',
    competition: 'Interâ€‘Collegiate',
    color: 'bg-orange-300',
    createdAt: 1704236400000
  },
  {
    id: 'aitran',
    college: 'Newbei College',
    eventName: 'Aitran',
    location: 'Mumbai, Charni Road',
    dates: '10th to 11th Dec 25',
    type: 'Singing',
    competition: 'Intraâ€‘Collegiate',
    color: 'bg-amber-200',
    createdAt: 1704322800000
  },
  {
    id: 'saman',
    college: 'Sanghi College',
    eventName: 'Saman',
    location: 'Mumbai, Jogeshwari',
    dates: '8th to 9th Dec 25',
    type: 'Sports',
    competition: 'Intraâ€‘Collegiate',
    color: 'bg-green-300',
    createdAt: 1704409200000
  },
  {
    id: 'sund',
    college: 'Sund College',
    eventName: 'Sund Fest',
    location: 'Mumbai',
    dates: '25th to 28th Dec 25',
    type: 'Dramatics',
    competition: 'Interâ€‘Collegiate',
    color: 'bg-purple-300',
    createdAt: 1704495600000
  }
];

export default function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(false);
      // ---- Auth guard:   // ---- Auth guard:   // ---- Auth guard:   // ---- Auth guard:   // ---- Auth guard:   // ---- Auth guard: which screens require a signed-in user ----
  const PROTECTED_SCREENS: Screen[] = [
    'home','event_detail','register','results',
    'org_dashboard','add_event','my_org','participants',
    'my_part','profile','liveStream'
  ];
  // If not authenticated and trying to view a protected screen, go to signin
  useEffect(() => {
    if (!isAuthenticated && PROTECTED_SCREENS.includes(currentScreen)) {
      setCurrentScreen('signin');
    }
  }, [isAuthenticated, currentScreen]);   // ---- Auth guard:   // ---- Auth guard:   // ---- Auth guard:   // ---- Auth guard:   // ---- Auth guard: which screens require a signed-in user ----
  const PROTECTED_SCREENS: Screen[] = [
    'home','event_detail','register','results',
    'org_dashboard','add_event','my_org','participants',
    'my_part','profile','liveStream'
  ];
  // If not authenticated and trying to view a protected screen, go to signin
  useEffect(() => {
    if (!isAuthenticated && PROTECTED_SCREENS.includes(currentScreen)) {
      setCurrentScreen('signin');
    }
  }, [isAuthenticated, currentScreen]);  const [selectedEvent, setSelectedEvent] = useState<string>('pandu');
  const [selectedSubEvent, setSelectedSubEvent] = useState<number | null>(null); // Track specific sub-event
  const [eventsState, setEventsState] = useState(initialEvents);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [isNewFromDashboard, setIsNewFromDashboard] = useState<boolean>(false);
  const [profileEmail, setProfileEmail] = useState<string>('');
  const [profileName, setProfileName] = useState<string>('');
  const [profilePhone, setProfilePhone] = useState<string>('');
  const [profileData, setProfileData] = useState<{
    collegeName: string;
    collegeAddress: string;
    collegeLocality: string;
    city: string;
    pincode: string;
    academicYear: string;
    stream: string;
  }>({
    collegeName: '',
    collegeAddress: '',
    collegeLocality: '',
    city: '',
    pincode: '',
    academicYear: '',
    stream: ''
  });
  const [sentEmails, setSentEmails] = useState<string[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentLiveStream, setCurrentLiveStream] = useState<{eventId: string, eventName: string} | null>(null);
  const [participantData, setParticipantData] = useState<{[registrationKey: string]: {
    name: string;
    college: string;
    phone: string;
    email: string;
    registrationDate: string;
  }}>({}); // Add participantData state

  // Helper function to get user profile key
  const getUserProfileKey = (email: string, phone: string) => {
    return `${email}:${phone}`;
  };

  // Helper function to load user profile from persistent storage
  const loadUserProfile = (email: string, phone: string) => {
    const userProfiles = loadFromLocalStorage(STORAGE_KEYS.USER_PROFILES, {});
    const profileKey = getUserProfileKey(email, phone);
    return userProfiles[profileKey] || null;
  };

  // Helper function to save user profile to persistent storage
  const saveUserProfile = (email: string, phone: string, profileData: any) => {
    const userProfiles = loadFromLocalStorage(STORAGE_KEYS.USER_PROFILES, {});
    const profileKey = getUserProfileKey(email, phone);
    userProfiles[profileKey] = {
      name: profileData.name,
      email: email,
      phone: phone,
      collegeName: profileData.collegeName,
      collegeAddress: profileData.collegeAddress,
      collegeLocality: profileData.collegeLocality,
      city: profileData.city,
      pincode: profileData.pincode,
      academicYear: profileData.academicYear,
      stream: profileData.stream,
      completedAt: new Date().toISOString()
    };
    saveToLocalStorage(STORAGE_KEYS.USER_PROFILES, userProfiles);
  };

  // Initialize data from localStorage (run once on mount)
  useEffect(() => {
    // Check authentication state
    const authState = loadFromLocalStorage(STORAGE_KEYS.AUTH_STATE, { 
      isAuthenticated: false, 
      email: '', 
      phone: '' 
    });
    
    if (authState.isAuthenticated && authState.email && authState.phone) {
      setIsAuthenticated(true);
      setProfileEmail(authState.email);
      setProfilePhone(authState.phone);
      
      // Check if user has a completed profile in persistent storage
      const savedProfile = loadUserProfile(authState.email, authState.phone);
      
      if (savedProfile) {
        // Profile exists - load it and skip profile setup
        setIsProfileComplete(true);
        setProfileName(savedProfile.name || '');
        setProfileData({
          collegeName: savedProfile.collegeName || '',
          collegeAddress: savedProfile.collegeAddress || '',
          collegeLocality: savedProfile.collegeLocality || '',
          city: savedProfile.city || '',
          pincode: savedProfile.pincode || '',
          academicYear: savedProfile.academicYear || '',
          stream: savedProfile.stream || ''
        });
        setCurrentScreen('home');
      } else {
        // No profile exists - user needs to complete setup
        setIsProfileComplete(false);
        setCurrentScreen('profile');
      }
    } else {
      setCurrentScreen('signin');
    }

    // Load user events
    const userEvents = loadFromLocalStorage(STORAGE_KEYS.USER_EVENTS, []);
    if (Array.isArray(userEvents) && userEvents.length > 0) {
      const allEvents = [...initialEvents];
      userEvents.forEach((userEvent: any) => {
        if (!allEvents.some(event => event.id === userEvent.id)) {
          allEvents.push(userEvent);
        }
      });
      setEventsState(allEvents);
    }

    // Load other data with type checking
    const name = loadFromLocalStorage(STORAGE_KEYS.PROFILE_NAME, '');
    if (typeof name === 'string') {
      setProfileName(name);
    }

    // Load complete profile data
    const completeProfileData = loadFromLocalStorage(STORAGE_KEYS.PROFILE_DATA, {
      collegeName: '',
      collegeAddress: '',
      collegeLocality: '',
      city: '',
      pincode: '',
      academicYear: '',
      stream: ''
    });
    if (typeof completeProfileData === 'object' && completeProfileData !== null) {
      setProfileData(completeProfileData);
    }

    const emails = loadFromLocalStorage(STORAGE_KEYS.SENT_EMAILS, []);
    if (Array.isArray(emails)) {
      setSentEmails(emails);
    }

    const registered = loadFromLocalStorage(STORAGE_KEYS.REGISTERED_EVENTS, []);
    if (Array.isArray(registered)) {
      setRegisteredEvents(registered);
    }

    const participants = loadFromLocalStorage(STORAGE_KEYS.PARTICIPANT_DATA, {});
    if (typeof participants === 'object' && participants !== null) {
      setParticipantData(participants);
    } else {
      // Add some sample participant data for demonstration
      const sampleParticipants = {
        'pandu:0': {
          name: 'Arjun Patel',
          college: 'Trinity College',
          phone: '9876543210',
          email: 'arjun.patel@trinity.edu',
          registrationDate: new Date().toISOString()
        },
        'pandu:1': {
          name: 'Priya Sharma',
          college: 'Sindhu College',
          phone: '9876543211',
          email: 'priya.sharma@sindhu.edu',
          registrationDate: new Date().toISOString()
        }
      };
      setParticipantData(sampleParticipants);
    }

    // Mark as initialized after loading
    setIsInitialized(true);
  }, []); // Empty dependency array - run only on mount

  // Save user events to localStorage (only after initialization)
  useEffect(() => {
    if (!isInitialized) return;
    const userEvents = eventsState.filter(event => event.createdByUser);
    saveToLocalStorage(STORAGE_KEYS.USER_EVENTS, userEvents);
  }, [eventsState, isInitialized]);

  // Save profile email to localStorage (only after initialization)
  useEffect(() => {
    if (!isInitialized || !profileEmail) return;
    saveToLocalStorage(STORAGE_KEYS.PROFILE_EMAIL, profileEmail);
  }, [profileEmail, isInitialized]);

  // Save profile name to localStorage (only after initialization)
  useEffect(() => {
    if (!isInitialized || !profileName) return;
    saveToLocalStorage(STORAGE_KEYS.PROFILE_NAME, profileName);
  }, [profileName, isInitialized]);

  // Save profile phone to localStorage (only after initialization)
  useEffect(() => {
    if (!isInitialized || !profilePhone) return;
    saveToLocalStorage(STORAGE_KEYS.PROFILE_PHONE, profilePhone);
  }, [profilePhone, isInitialized]);

  // Save complete profile data to localStorage (only after initialization)
  useEffect(() => {
    if (!isInitialized) return;
    saveToLocalStorage(STORAGE_KEYS.PROFILE_DATA, profileData);
  }, [profileData, isInitialized]);

  // Save sent emails to localStorage (only after initialization)
  useEffect(() => {
    if (!isInitialized) return;
    saveToLocalStorage(STORAGE_KEYS.SENT_EMAILS, sentEmails);
  }, [sentEmails, isInitialized]);

  // Save registered events to localStorage (only after initialization)
  useEffect(() => {
    if (!isInitialized) return;
    saveToLocalStorage(STORAGE_KEYS.REGISTERED_EVENTS, registeredEvents);
  }, [registeredEvents, isInitialized]);

  // Save participant data to localStorage (only after initialization)
  useEffect(() => {
    if (!isInitialized) return;
    saveToLocalStorage(STORAGE_KEYS.PARTICIPANT_DATA, participantData);
  }, [participantData, isInitialized]);

  // Authentication handlers
  const handleSignInComplete = (email: string, phone: string, isGoogleSignIn: boolean) => {
    setTempAuthData({ email, phone });
    setCurrentScreen('otp_verification');
  };

  const handleOTPVerificationComplete = () => {
    if (tempAuthData) {
      setIsAuthenticated(true);
      setProfileEmail(tempAuthData.email);
      setProfilePhone(tempAuthData.phone);
      
      // Save authentication state
      saveToLocalStorage(STORAGE_KEYS.AUTH_STATE, {
        isAuthenticated: true,
        email: tempAuthData.email,
        phone: tempAuthData.phone
      });
      
      // Check if user has a completed profile in persistent storage
      const savedProfile = loadUserProfile(tempAuthData.email, tempAuthData.phone);
      
      if (savedProfile) {
        // Profile exists - load it and go directly to home
        setIsProfileComplete(true);
        setProfileName(savedProfile.name || '');
        setProfileData({
          collegeName: savedProfile.collegeName || '',
          collegeAddress: savedProfile.collegeAddress || '',
          collegeLocality: savedProfile.collegeLocality || '',
          city: savedProfile.city || '',
          pincode: savedProfile.pincode || '',
          academicYear: savedProfile.academicYear || '',
          stream: savedProfile.stream || ''
        });
        setCurrentScreen('home');
      } else {
        // No profile exists - user needs to complete setup
        setIsProfileComplete(false);
        setCurrentScreen('profile');
      }
      
      setTempAuthData(null);
    }
  };

  const handleProfileComplete = () => {
    setIsProfileComplete(true);
    
    // Save profile to persistent storage tied to email+phone
    if (profileEmail && profilePhone) {
      saveUserProfile(profileEmail, profilePhone, {
        name: profileName,
        collegeName: profileData.collegeName,
        collegeAddress: profileData.collegeAddress,
        collegeLocality: profileData.collegeLocality,
        city: profileData.city,
        pincode: profileData.pincode,
        academicYear: profileData.academicYear,
        stream: profileData.stream
      });
    }
    
    setCurrentScreen('home');
  };

  const handleSignOut = () => {
    // Clear only authentication state, NOT profile data
    // Profile data persists in USER_PROFILES storage for future sign-ins
    setIsAuthenticated(false);
    setIsProfileComplete(false);
    setProfileEmail('');
    setProfileName('');
    setProfilePhone('');
    setProfileData({
      collegeName: '',
      collegeAddress: '',
      collegeLocality: '',
      city: '',
      pincode: '',
      academicYear: '',
      stream: ''
    });
    setTempAuthData(null);
    
    // Clear only session-based localStorage (NOT USER_PROFILES - that persists)
    localStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE_COMPLETE);
    localStorage.removeItem(STORAGE_KEYS.PROFILE_EMAIL);
    localStorage.removeItem(STORAGE_KEYS.PROFILE_NAME);
    localStorage.removeItem(STORAGE_KEYS.PROFILE_PHONE);
    localStorage.removeItem(STORAGE_KEYS.PROFILE_DATA);
    
    // Redirect to sign in
    setCurrentScreen('signin');
  };

  // Profile data update handler
  const handleProfileDataUpdate = (newProfileData: {
    collegeName: string;
    collegeAddress: string;
    collegeLocality: string;
    city: string;
    pincode: string;
    academicYear: string;
    stream: string;
  }) => {
    setProfileData(newProfileData);
    
    // If profile is already complete, update persistent storage immediately
    if (isProfileComplete && profileEmail && profilePhone) {
      saveUserProfile(profileEmail, profilePhone, {
        name: profileName,
        collegeName: newProfileData.collegeName,
        collegeAddress: newProfileData.collegeAddress,
        collegeLocality: newProfileData.collegeLocality,
        city: newProfileData.city,
        pincode: newProfileData.pincode,
        academicYear: newProfileData.academicYear,
        stream: newProfileData.stream
      });
    }
  };

  // Auto-email checking (simplified to prevent infinite loops)
  useEffect(() => {
    if (!profileEmail || !isInitialized || !isAuthenticated) return;

    // Simple check once per minute without state updates during the effect
    const intervalId = setInterval(() => {
      const now = new Date();
      
      eventsState.forEach(event => {
        if (!event.createdByUser || !event.deadline) return;
        
        try {
          let deadlineDate;
          if (event.deadline.includes('at')) {
            const parts = event.deadline.split('at');
            const datePart = parts[0].trim();
            const timePart = parts[1].trim().replace(/pm|am/i, '');
            deadlineDate = new Date(`${datePart} ${timePart}`);
          } else {
            deadlineDate = new Date(event.deadline);
          }
          
          if (now > deadlineDate) {
            // Check if email was already sent using localStorage directly
            const sentEmailsFromStorage = loadFromLocalStorage(STORAGE_KEYS.SENT_EMAILS, []);
            if (!sentEmailsFromStorage.includes(event.id)) {
              console.log(`ðŸ“§ Participant list for "${event.eventName}" sent to ${profileEmail}`);
              // Update localStorage directly to avoid state update loops
              const updatedSentEmails = [...sentEmailsFromStorage, event.id];
              saveToLocalStorage(STORAGE_KEYS.SENT_EMAILS, updatedSentEmails);
              // Update state only once
              setSentEmails(updatedSentEmails);
            }
          }
        } catch (error) {
          console.warn(`Could not parse deadline for event ${event.eventName}:`, error);
        }
      });
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [profileEmail, isInitialized]); // Removed eventsState to prevent loops

  const navigate = (screen: Screen, eventId?: string, editEvent?: any, isNewFromDashboard?: boolean, subEventIndex?: number) => {
    // If not authenticated, always redirect to signin
    if (!isAuthenticated && screen !== 'signin' && screen !== 'otp_verification') {
      setCurrentScreen('signin');
      return;
    }

    // If authenticated but profile not complete, only allow home and profile
    if (isAuthenticated && !isProfileComplete && screen !== 'home' && screen !== 'profile') {
      setCurrentScreen('profile');
      return;
    }

    if (eventId) setSelectedEvent(eventId);
    if (subEventIndex !== undefined) setSelectedSubEvent(subEventIndex);
    else if (screen !== 'event_detail') setSelectedSubEvent(null); // Clear sub-event selection when not going to event_detail
    
    // Handle editingEvent properly - only set it if explicitly provided or if staying on add_event with existing editingEvent
    if (editEvent !== undefined) {
      setEditingEvent(editEvent);
    } else if (screen === 'add_event' && currentScreen !== 'add_event') {
      // When navigating TO add_event from another screen, clear editingEvent unless explicitly provided
      setEditingEvent(null);
    }
    
    setIsNewFromDashboard(isNewFromDashboard || false);
    setCurrentScreen(screen);
  };

  const addEvent = (eventData: any, isEdit: boolean = false) => {
    if (isEdit && editingEvent) {
      setEventsState(prev => 
        prev.map(event => 
          event.id === editingEvent.id 
            ? { ...eventData, id: editingEvent.id, createdAt: editingEvent.createdAt, createdByUser: editingEvent.createdByUser }
            : event
        )
      );
    } else {
      const eventWithTimestamp = {
        ...eventData,
        createdAt: Date.now(),
        createdByUser: true
      };
      setEventsState(prev => [...prev, eventWithTimestamp]);
    }
  };

  const deleteEvent = (eventId: string) => {
    setEventsState(prev => prev.filter(event => event.id !== eventId));
  };

  const registerForEvent = (eventId: string, subEventIndex?: number, participantDetails?: {
    name: string;
    college: string;
    phone: string;
    email: string;
  }) => {
    // Create composite key for sub-event registration: "eventId:subEventIndex"
    const registrationKey = subEventIndex !== undefined 
      ? `${eventId}:${subEventIndex}` 
      : eventId;
    
    console.log('Registering for:', registrationKey);
    console.log('Current registered events before:', registeredEvents);
    
    setRegisteredEvents(prev => {
      const newRegistrations = prev.includes(registrationKey) ? prev : [...prev, registrationKey];
      console.log('New registered events:', newRegistrations);
      return newRegistrations;
    });

    // Store participant details if provided
    if (participantDetails) {
      setParticipantData(prev => ({
        ...prev,
        [registrationKey]: {
          ...participantDetails,
          registrationDate: new Date().toISOString()
        }
      }));
    }
  };

  const withdrawFromEvent = (registrationKey: string) => {
    setRegisteredEvents(prev => prev.filter(id => id !== registrationKey));
    
    // Remove participant data when withdrawing
    setParticipantData(prev => {
      const newData = { ...prev };
      delete newData[registrationKey];
      return newData;
    });
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'signin':
        return <SignIn onSignInComplete={handleSignInComplete} />;
      case 'otp_verification':
        return tempAuthData ? (
          <OTPVerification 
            email={tempAuthData.email}
            phone={tempAuthData.phone}
            onVerificationComplete={handleOTPVerificationComplete}
            onBack={() => setCurrentScreen('signin')}
          />
        ) : <SignIn onSignInComplete={handleSignInComplete} />;
      case 'home':
        return <Home navigate={navigate} events={eventsState} userProfile={{ name: profileName, email: profileEmail, phone: profilePhone, isProfileComplete }} />;
      case 'event_detail':
        const selectedEventData = eventsState.find(e => e.id === selectedEvent);
        return selectedEventData 
          ? <EventDetail 
              navigate={navigate} 
              event={selectedEventData} 
              onRegister={registerForEvent} 
              registeredEvents={registeredEvents}
              setCurrentLiveStream={setCurrentLiveStream}
              selectedSubEvent={selectedSubEvent}
              userProfile={{
                name: profileName,
                email: profileEmail,
                phone: profilePhone,
                profileData: profileData
              }}
            />
          : <Home navigate={navigate} events={eventsState} userProfile={{ name: profileName, email: profileEmail, phone: profilePhone, isProfileComplete }} />;
      case 'register':
        return <Register navigate={navigate} />;
      case 'results':
        return <Results navigate={navigate} />;
      case 'org_dashboard':
        return <OrgDashboard navigate={navigate} />;
      case 'add_event':
        return <AddEvent 
          navigate={navigate} 
          addEvent={addEvent} 
          editingEvent={editingEvent} 
          isNewFromDashboard={isNewFromDashboard}
          userProfile={{
            name: profileName || 'John Doe',
            email: profileEmail || 'john.doe@college.edu', 
            phone: profilePhone || '9876543210',
            profileData: profileData
          }}
        />; 
      case 'my_org':
        return <MyOrganisedEvents navigate={navigate} events={eventsState} deleteEvent={deleteEvent} />;
      case 'participants':
        const participantsEventData = eventsState.find(e => e.id === selectedEvent);
        return <Participants 
          navigate={navigate} 
          event={participantsEventData} 
          profileEmail={profileEmail}
          emailSent={sentEmails.includes(selectedEvent)}
          participantData={participantData}
          selectedEventId={selectedEvent}
        />;
      case 'my_part':
        return <MyParticipatingEvents 
          navigate={navigate} 
          events={eventsState}
          registeredEvents={registeredEvents}
          onWithdrawParticipation={withdrawFromEvent}
        />;
      case 'profile':
        return <Profile 
          navigate={navigate} 
          onEmailUpdate={setProfileEmail} 
          onNameUpdate={setProfileName} 
          onPhoneUpdate={setProfilePhone} 
          onProfileDataUpdate={handleProfileDataUpdate}
          savedEmail={profileEmail} 
          savedName={profileName} 
          savedPhone={profilePhone}
          savedProfileData={profileData}
          isInitialSetup={!isProfileComplete}
          onSetupComplete={handleProfileComplete}
          onSignOut={handleSignOut}
        />;
      case 'liveStream':
        return currentLiveStream ? (
          <LiveStream 
            navigate={navigate} 
            eventId={currentLiveStream.eventId}
            eventName={currentLiveStream.eventName}
          />
        ) : (
          <Home navigate={navigate} events={eventsState} userProfile={{ name: profileName, email: profileEmail, phone: profilePhone, isProfileComplete }} />
        );
      default:
        return <Home navigate={navigate} events={eventsState} userProfile={{ name: profileName, email: profileEmail, phone: profilePhone, isProfileComplete }} />;
    }
  };

  return (
    <div className="min-h-screen bg-white w-full max-w-[360px] h-[100dvh] mx-auto overflow-x-hidden">
      {renderScreen()}
    </div>
  );
}