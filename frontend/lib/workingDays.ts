/**
 * Calcule le nombre de jours ouvrés entre deux dates
 * Exclut les weekends (samedi et dimanche) et les jours fériés
 */
export function calculateWorkingDays(
  startDate: string,
  endDate: string,
  publicHolidays: string[] = []
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Vérifier que la date de fin est après la date de début
  if (end < start) {
    return 0;
  }

  let workingDays = 0;
  const current = new Date(start);

  // Convertir les jours fériés en timestamps pour comparaison rapide
  const holidayTimestamps = new Set(
    publicHolidays.map(date => new Date(date).toDateString())
  );

  // Parcourir chaque jour entre start et end (inclus)
  while (current <= end) {
    const dayOfWeek = current.getDay();
    const dateString = current.toDateString();
    
    // Vérifier si c'est un jour ouvré (lundi à vendredi = 1 à 5)
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
    
    // Vérifier si ce n'est pas un jour férié
    const isNotHoliday = !holidayTimestamps.has(dateString);
    
    if (isWeekday && isNotHoliday) {
      workingDays++;
    }
    
    // Passer au jour suivant
    current.setDate(current.getDate() + 1);
  }

  return workingDays;
}

/**
 * Formate une date ISO en format lisible français
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Vérifie si une date est un weekend
 */
export function isWeekend(dateString: string): boolean {
  const date = new Date(dateString);
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // Dimanche ou Samedi
}

/**
 * Vérifie si une date est un jour férié
 */
export function isPublicHoliday(dateString: string, publicHolidays: string[]): boolean {
  const dateStr = new Date(dateString).toDateString();
  return publicHolidays.some(holiday => new Date(holiday).toDateString() === dateStr);
}
