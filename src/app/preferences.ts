// Visitor preferences are stored in localStorage and mirrored onto <html> as
// data attributes, so CSS can react to them on any page.
export const ANIMATIONS_KEY = 'catie:animations';
export const VIEW_KEY = 'catie:resume-view';

// Runs in <head> before first paint so a saved preference never flashes.
export const preferencesScript = `(function(){try{var d=document.documentElement;if(localStorage.getItem('${ANIMATIONS_KEY}')==='off')d.dataset.animations='off';if(localStorage.getItem('${VIEW_KEY}')==='plain')d.dataset.view='plain';}catch(e){}})();`;

export const savePreference = (key: string, value: string) => {
    try {
        localStorage.setItem(key, value);
    } catch {
        // Storage can be unavailable (private mode, blocked site data); the toggle still works for this visit.
    }
}
