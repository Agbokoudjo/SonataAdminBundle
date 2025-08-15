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

// turbo_module_handler_controller.js
import { Controller } from '@hotwired/stimulus';
import __turboModuleHandler_instance from '../turbo';

/**
 * Handles same-page anchor clicks without triggering Turbo page reloads.
 * Prevents unnecessary reloads for links like "#section" by manually updating the URL.
 */
export default class extends Controller {
    connect() {
        // Attach click listener globally
        document.addEventListener('turbo:click', this.handleTurboClick.bind(this));
    }

    disconnect() {
        // Clean up listener when the controller disconnects
        document.removeEventListener('turbo:click', this.handleTurboClick.bind(this));
    }

    /**
     * Handles Turbo click events and delegates to the singleton
     * @param {MouseEvent} e
     */
    handleTurboClick = (e) => {
       __turboModuleHandler_instance.anchorElementHandler(e);
    }
}

