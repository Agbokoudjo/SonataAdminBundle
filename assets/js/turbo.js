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

export class TurboModuleHandler {
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
      
        const isSamePageAnchor =
            anchorElement.hash &&
            anchorElement.origin === window.location.origin &&
            anchorElement.pathname === window.location.pathname;
      
        if (isSamePageAnchor) {
            e.preventDefault(); // prevent Turbo from handling the click
            history.pushState({}, '', anchorElement.href); // manually update URL
            window.dispatchEvent(new Event('hashchange')); // trigger hashchange event
        }
    }
}
const __turboModuleHandler_instance = TurboModuleHandler.getInstance();
export default __turboModuleHandler_instance;

