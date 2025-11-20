
import { RRule, RRuleSet, rrulestr } from "rrule";
import { DateTime } from "luxon";


export function buildRRuleSetFromRecurringTask(recurringTask, exceptions = []) {
  const {
    startDate, 
    time, 
    frequency,
    interval = 1,
    endDate,
    byweekday,
    bymonthday,
  } = recurringTask;

  
  const dtStartISO = combineDateAndTimeISO(startDate, time);

  const ruleOptions = {
    dtstart: new Date(dtStartISO),
    interval: interval || 1,
  };

  
  switch (frequency) {
    case "daily":
      ruleOptions.freq = RRule.DAILY;
      break;
    case "weekly":
      ruleOptions.freq = RRule.WEEKLY;
      if (Array.isArray(byweekday) && byweekday.length > 0) {
        
        ruleOptions.byweekday = byweekday.map((d) => RRule[d]);
      }
      break;
    case "monthly":
      ruleOptions.freq = RRule.MONTHLY;
      if (bymonthday) ruleOptions.bymonthday = bymonthday;
      break;
    case "yearly":
      ruleOptions.freq = RRule.YEARLY;
      break;
    case "custom":
      
      ruleOptions.freq = RRule.DAILY;
      break;
    default:
      ruleOptions.freq = RRule.DAILY;
  }

  if (endDate) {
    ruleOptions.until = new Date(endDate);
  }

  const rrule = new RRule(ruleOptions);

  const set = new RRuleSet();
  set.rrule(rrule);

  
  exceptions?.forEach((ex) => {
   
    if (ex && ex.date) {
      set.exdate(new Date(ex.date));
    }
  });

  return set;
}


export function combineDateAndTimeISO(dateLike, timeStr) {
 
  const dt = DateTime.fromJSDate(new Date(dateLike), { zone: "utc" });
  
  if (timeStr) {
    const [hh, mm] = timeStr.split(":").map((s) => parseInt(s, 10));
    const withTime = dt.set({ hour: hh ?? 0, minute: mm ?? 0, second: 0, millisecond: 0 });
    return withTime.toJSDate().toISOString();
  }
  return dt.toJSDate().toISOString();
}

export function getOccurrencesBetween(recurringTask, exceptions = [], rangeStart, rangeEnd) {
  try {
    const rset = buildRRuleSetFromRecurringTask(recurringTask, exceptions);
    
    // Use reasonable date ranges - limit to 2 years max for performance
    const after = rangeStart ? new Date(rangeStart) : new Date();
    const before = rangeEnd ? new Date(rangeEnd) : new Date();
    
    // Add 2 years max from current date for performance
    if (!rangeEnd) {
      before.setFullYear(before.getFullYear() + 2);
    }
    
    // Limit the number of occurrences to prevent infinite loops
    const dates = rset.between(after, before, true);
    
    // Further limit to 1000 occurrences max for performance
    const limitedDates = dates.slice(0, 1000);

    const exceptionsByIso = {};
    exceptions?.forEach((ex) => {
      if (ex && ex.date) {
        const key = new Date(ex.date).toISOString();
        exceptionsByIso[key] = ex;
      }
    });

    const occurrences = limitedDates.map((d) => {
      const iso = d.toISOString();
      const ex = exceptionsByIso[iso];
      return {
        startDate: d,
        recurringTaskId: recurringTask.id,
        recurringTask,
        exception: ex ?? null,
      };
    });

    return occurrences;
  } catch (error) {
    console.error('Error in getOccurrencesBetween:', error);
    return []; 
  }
}