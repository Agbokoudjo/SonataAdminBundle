/*!
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * Phone: +229 01 67 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-apps-services-120520193/
 * Github: https://github.com/Agbokoudjo/
 * Company: INTERNATIONALES WEB APPS & SERVICES
 *
 * For more information, please feel free to contact the author.
 */

class TurboModuleHandler {
    static #instance = null;

    /**
     * Prevent direct instantiation (Singleton pattern).
     */
    constructor() {
        if (TurboModuleHandler.#instance) {
            throw new Error("Use TurboModuleHandler.getInstance() to access the single instance.");
        }
    }

    /**
     * Returns the single instance of TurboModuleHandler.
     * @returns {TurboModuleHandler}
     */
    static getInstance() {
        if (!TurboModuleHandler.#instance) {
            TurboModuleHandler.#instance = new TurboModuleHandler();
        }
        return TurboModuleHandler.#instance;
    }
    initialize() {
        this.bootstrapHandler();
     }
    /**
     * Handles click events on anchor elements within the page.
     * Prevents Turbo from handling same-page anchor clicks,
     * and manually updates the URL + triggers a hashchange event.
     * 
     * @param {Event} e - The click event.
     */
    anchorElementHandler(e) {
         const anchorElement = e.target.closest('a');
        if (!anchorElement) return;

        const href = anchorElement.getAttribute('href') || '';
        const hash = anchorElement.hash;

        // Ignore empty href or just "#"
        if (!href || href === '#' || hash === '#') {
            e.preventDefault();
            return;
        }

        const currentUrl = new URL(window.location.href);
        const targetUrl = new URL(anchorElement.href, currentUrl);

        const isSamePageAnchor =
            targetUrl.origin === currentUrl.origin &&
            targetUrl.pathname === currentUrl.pathname &&
            hash; // must have a valid hash

        if (isSamePageAnchor) {
            e.preventDefault(); // Prevent Turbo from handling the click
            history.pushState({}, '', targetUrl.href); // Update URL manually
            window.dispatchEvent(new Event('hashchange')); // Trigger hashchange event
        }
    }
    bootstrapHandler() {
    
        if (typeof bootstrap !== 'undefined') {
        // 1. Initialisation des dropdowns
        const dropdownToggleList = jQuery('[data-bs-toggle="dropdown"]');
        dropdownToggleList.each(function (_, dropdownToggleEl) {
            new bootstrap.Dropdown(dropdownToggleEl);
        });
    
        // 2. Initialisation des éléments collapsibles
        const collapseToggleList = jQuery('[data-bs-toggle="collapse"]');
        collapseToggleList.each(function (_, collapseToggleEl) {
            new bootstrap.Collapse(collapseToggleEl, {
                toggle: false // Empêche l'ouverture automatique
            });
        });
    
        // 3. Initialisation des tooltips (infobulles)
        const tooltipTriggerList = jQuery('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.each(function (_, tooltipTriggerEl) {
            new bootstrap.Tooltip(tooltipTriggerEl);
        });
    
        // 4. Initialisation des popovers
        const popoverTriggerList = jQuery('[data-bs-toggle="popover"]');
        popoverTriggerList.each(function (_, popoverTriggerEl) {
            new bootstrap.Popover(popoverTriggerEl);
        });
    } else {
        console.warn("Bootstrap object not found. Make sure Bootstrap CDN is loaded before your custom script.");
    }
    }
}
const __turboModuleHandler_instance = TurboModuleHandler.getInstance();
export default __turboModuleHandler_instance;
jQuery(window).on("load", () => {
    
    __turboModuleHandler_instance.initialize()
});
jQuery(function turboModuleHandler() {
    jQuery(document).on("turbo:load", () =>
          __turboModuleHandler_instance.initialize()
    );
    jQuery(document).on('turbo:frame-load', () =>
        __turboModuleHandler_instance.initialize()
    );
})

