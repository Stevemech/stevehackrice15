// Utility to reset localStorage data if needed
// This can be called to reset the user's progress

export const resetUserData = () => {
  // Clear XP data to start fresh
  localStorage.removeItem('userXPData');
  
  // Optionally clear other data
  // localStorage.removeItem('dailyReports');
  // localStorage.removeItem('checkIns');
  // localStorage.removeItem('completedVisits');
  
  console.log('User data has been reset. Hearts will start at 10 with no upper limit.');
  
  // Reload the page to reflect changes
  window.location.reload();
};

// Export for use in console if needed
if (typeof window !== 'undefined') {
  (window as any).resetUserData = resetUserData;
}