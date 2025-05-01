
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  // Handle US phone numbers
  if (phoneNumber.startsWith('+1') && phoneNumber.length === 12) {
    const areaCode = phoneNumber.substring(2, 5);
    const middle = phoneNumber.substring(5, 8);
    const last = phoneNumber.substring(8);
    return `(${areaCode}) ${middle}-${last}`;
  }
  
  return phoneNumber;
};

export const getCallStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'text-call-active';
    case 'waiting':
      return 'text-call-waiting';
    case 'missed':
      return 'text-call-missed';
    case 'completed':
      return 'text-call-completed';
    default:
      return 'text-gray-500';
  }
};

export const getCallStatusBadge = (status: string): string => {
  switch (status) {
    case 'active':
      return 'call-badge-active';
    case 'waiting':
      return 'call-badge-waiting';
    case 'missed':
      return 'call-badge-missed';
    case 'completed':
      return 'call-badge-completed';
    default:
      return 'call-badge bg-gray-100 text-gray-500';
  }
};

export const getLeadStatusColor = (status: string): string => {
  switch (status) {
    case 'new':
      return 'text-blue-500';
    case 'contacted':
      return 'text-yellow-500';
    case 'qualified':
      return 'text-green-500';
    case 'unqualified':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

export const getAgentStatusColor = (status: string): string => {
  switch (status) {
    case 'online':
      return 'text-green-500';
    case 'busy':
      return 'text-orange-500';
    case 'away':
      return 'text-yellow-500';
    case 'offline':
      return 'text-gray-500';
    default:
      return 'text-gray-500';
  }
};
